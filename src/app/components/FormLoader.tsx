import { TypeCheck } from "@sinclair/typebox/compiler";
import {
  Button,
  Col,
  Dropdown,
  Input,
  message,
  Radio,
  Row,
  Space,
  Tag,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import axios from "axios";
import copy from "copy-to-clipboard";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import React from "react";
import { TbChevronDown, TbFileUpload, TbLink } from "react-icons/tb";
import { useQuery } from "react-query";
import firebase, { db } from "../firebase";
import {
  FormContext,
  LiteformCompiler,
  LiteformForm,
  LiteformMode,
} from "./LiteformContext";

type LoaderState =
  | {
      from: "url";
      url: string;
    }
  | {
      from: "cloud";
      docId: string;
    }
  | {
      from: "file";
      fileList: UploadFile[];
    };

export default function FormLoader() {
  const [state, setState] = React.useState<LoaderState>({
    from: "url",
    url: "",
  });
  const formContext = FormContext.useActions();
  React.useEffect(() => {
    if (state.from === "url") {
      axios.get(state.url).then((res) => {
        if (LiteformCompiler.Check(res.data)) {
          formContext.setForm(res.data);
        }
      });
    } else if (state.from === "file") {
      const file = state.fileList[0]?.originFileObj;
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const form = JSON.parse(e.target?.result as string);
        formContext.setForm(form);
      };
      reader.readAsText(file);
    } else {
      if (!state.docId) return;
      const documentRef = doc(db, "documents", state.docId);
      getDoc(documentRef).then((doc) => {
        if (doc.exists()) {
          const form = doc.data() as LiteformForm;
          formContext.setForm(form);
        }
      });
    }
  }, [state]);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const formUrl = url.searchParams.get("from_url");
    if (formUrl) {
      setState({ from: "url", url: formUrl });
      return;
    }
    const fromCloud = url.searchParams.get("from_cloud");
    if (fromCloud) {
      setState({ from: "cloud", docId: fromCloud });
      return;
    }
  }, []);

  return (
    <Row
      gutter={[12, 12]}
      style={{
        padding: "0 16px",
      }}
    >
      <Col>
        <Radio.Group
          size="small"
          value={state.from}
          onChange={(e) => {
            const source = e.target.value;
            const url = new URL(window.location.href);
            if (source === "url") {
              setState({
                from: "url",
                url: url.searchParams.get("from_url") || "",
              });
            } else if (source === "file") {
              setState({ from: "file", fileList: [] });
            } else {
              setState({
                from: "cloud",
                docId: url.searchParams.get("from_cloud") || "",
              });
            }
          }}
        >
          <Radio.Button value="url">From URL</Radio.Button>
          <Radio.Button value="file">From File</Radio.Button>
          <Radio.Button value="cloud">From Cloud</Radio.Button>
        </Radio.Group>
      </Col>
      <Col>
        {state.from === "url" ? (
          <Input
            size="small"
            value={state.url}
            addonBefore={<TbLink />}
            onChange={(e) => {
              setState({
                ...state,
                url: e.target.value,
              });
            }}
          />
        ) : state.from === "file" ? (
          <Upload
            accept=".json"
            onChange={(info) => {
              setState({
                from: "file",
                fileList: info.fileList,
              });
            }}
          >
            <Button icon={<TbFileUpload />} size="small">
              Upload
            </Button>
          </Upload>
        ) : (
          <CloudDocuments
            docId={state.docId}
            onChange={(docId) => {
              setState({
                from: "cloud",
                docId,
              });
            }}
          />
        )}
      </Col>
    </Row>
  );
}

function CloudDocuments(props: {
  docId: string;
  onChange: (docId: string) => void;
}) {
  const mode = FormContext.useSelectState((state) => state.mode);
  const documents = useQuery(["documents", mode], async () => {
    const documentsRef = collection(db, "documents");
    const user = firebase.auth().currentUser;
    if (!user || mode === LiteformMode.RESPONSE) return [];
    const forms = await getDocs(
      query(
        documentsRef,
        where("owner.id", "==", firebase.auth().currentUser?.uid)
      )
    );
    return forms.docs.map((doc) => doc.data() as LiteformForm);
  });

  const form = FormContext.useSelectState((state) => state.form);

  const [state, setState] = React.useState({ isLoading: false });

  React.useEffect(
    function saveFormToCloud() {
      const timeout = setTimeout(() => {
        const documentsRef = collection(db, "documents");
        if (!props.docId || mode === LiteformMode.RESPONSE) return;
        const docRef = doc(documentsRef, props.docId);
        getDoc(docRef)
          .then((doc) => doc.exists())
          .then(() => {
            setDoc(docRef, form).then(() => {
              documents.refetch();
            });
          });
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    },
    [form, props.docId, mode]
  );

  const handleAddNewDoc = React.useCallback(() => {
    setState({ isLoading: true });
    const documentsRef = collection(db, "documents");
    const formCopy: LiteformForm = {
      ...form,
      id: nanoid(6),
      name: `Copy of ${form.name}`,
      owner: {
        email: firebase.auth().currentUser?.email || "",
        name: firebase.auth().currentUser?.displayName || "",
        id: firebase.auth().currentUser?.uid || "",
      },
    };
    setDoc(doc(documentsRef, formCopy.id), formCopy)
      .then(() => {
        props.onChange(formCopy.id);
      })
      .finally(() => {
        setState({ isLoading: false });
      });
  }, [form, props.onChange]);
  const items = React.useMemo(() => {
    if (mode === LiteformMode.RESPONSE) return [];
    const items: ItemType[] = [
      {
        key: "0",
        label: "Save as new document",
        onClick: handleAddNewDoc,
      },
    ];

    items.push(
      ...(documents.data?.map((doc) => ({
        label: doc.name,
        key: doc.id,
        type: "",
      })) || [])
    );

    return items;
  }, [documents.data, handleAddNewDoc, mode]);
  return (
    <Space>
      {mode === LiteformMode.EDIT ? (
        <Dropdown
          menu={{
            items,
            onClick: (item) => {
              if (item.key === "0") return;
              props.onChange(item.key);
            },
          }}
        >
          <Button size="small" loading={state.isLoading}>
            <Space>
              <Typography.Text ellipsis style={{ width: 150 }}>
                {form.name}
              </Typography.Text>
              <TbChevronDown />
            </Space>
          </Button>
        </Dropdown>
      ) : null}
      {props.docId ? (
        <Button
          size="small"
          onClick={(e) => {
            copy(`${window.location.origin}/form?from_cloud=${props.docId}`);
            message.info("Link copied to clipboard");
          }}
        >
          Share
        </Button>
      ) : null}
    </Space>
  );
}
