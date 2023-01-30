import {
  Button,
  Col,
  Input,
  Radio,
  Row, Upload,
  UploadFile
} from "antd";
import React from "react";
import { TbFileUpload, TbLink } from "react-icons/tb";
import { FormContext } from "./LiteformContext";

export default function FormLoader() {
  const [state, setState] = React.useState({
    from: "url" as "url" | "file",
    url: "",
    fileList: [] as UploadFile<any>[]
  });
  const formContext = FormContext.useActions();
  React.useEffect(() => {
    if (state.from === "url") {
      fetch(state.url)
        .then((res) => res.json())
        .then((form) => {
          formContext.setForm(form);
        });
    } else {
      const file = state.fileList[0]?.originFileObj;
      if (!file)
        return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const form = JSON.parse(e.target?.result as string);
        formContext.setForm(form);
      };
      reader.readAsText(file);
    }
  }, [state.from, state.url, state.fileList]);

  return (
    <Row
      gutter={[12, 12]}
      style={{
        padding: "0 16px"
      }}
    >
      <Col>
        <Radio.Group
          size="small"
          value={state.from}
          onChange={(e) => {
            setState({
              ...state,
              from: e.target.value
            });
          }}
        >
          <Radio.Button value="url">From URL</Radio.Button>
          <Radio.Button value="file">From File</Radio.Button>
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
                url: e.target.value
              });
            }} />
        ) : (
          <Upload
            accept=".json"
            fileList={state.fileList}
            onChange={(info) => {
              setState({
                ...state,
                fileList: info.fileList
              });
            }}
          >
            <Button icon={<TbFileUpload />} size="small">
              Upload
            </Button>
          </Upload>
        )}
      </Col>
    </Row>
  );
}
