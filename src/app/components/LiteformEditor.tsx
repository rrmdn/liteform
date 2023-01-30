import {
  Button,
  Col,
  Form,
  Input,
  Popconfirm,
  Popover,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import {
  TbAlignCenter,
  TbAlignJustified,
  TbAlignLeft,
  TbAlignRight,
  TbBlockquote,
  TbBold,
  TbEdit,
  TbHeading,
  TbItalic,
  TbList,
  TbListNumbers,
  TbUnderline,
} from "react-icons/tb";
import React, { useState } from "react";
import { isHotkey } from "is-hotkey";
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  Text as SlateText,
  Point,
  Range,
  BasePoint,
} from "slate";
import {
  ReactEditor,
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderElementProps,
  RenderLeafProps,
  useFocused,
  useSelected,
} from "slate-react";
import { FormContext, FormField, LiteformMode } from "./LiteformContext";
import FieldRenderer from "./FieldRenderer";
import { nanoid } from "nanoid";
import { CustomElement, CustomText } from "../../slate";
import { Controller, useForm } from "react-hook-form";
import LiteForm from "./LiteForm";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import "./fields/loader";
import builder from "./fields/builder";
import EditMetadata from "./EditMetadata";

function FieldCreationPopover(props: {
  onCreate: (name: string, type: string) => void;
}) {
  const form = useForm({
    defaultValues: {
      name: "",
      type: Object.values(builder.factories)[0].defaultNode.type,
    },
  });
  const [state, setState] = useState({ isOpen: false });
  const fieldTypes = React.useMemo(() => {
    return Object.values(builder.factories).map((f) => ({
      value: f.defaultNode.type,
      label: f.defaultNode.name,
    }));
  }, []);
  const isFocused = ReactEditor.isFocused(useSlate());
  return (
    <Popover
      open={state.isOpen}
      onOpenChange={() => {
        setState({ isOpen: !state.isOpen });
      }}
      trigger={["click"]}
      content={
        <Form
          onSubmitCapture={(e) => {
            const values = form.getValues();
            props.onCreate(values.name, values.type);
            setState({ isOpen: false });
            form.reset();
          }}
        >
          <Form.Item label="Field name">
            <Controller
              control={form.control}
              name="name"
              render={(input) => {
                return (
                  <Input
                    value={input.field.value}
                    onChange={input.field.onChange}
                    onBlur={input.field.onBlur}
                  />
                );
              }}
            />
          </Form.Item>
          <Form.Item label="Field type">
            <Controller
              control={form.control}
              name="type"
              render={(input) => {
                return (
                  <Select
                    value={input.field.value}
                    onChange={input.field.onChange}
                    onBlur={input.field.onBlur}
                    options={fieldTypes}
                  />
                );
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Create
            </Button>
          </Form.Item>
        </Form>
      }
    >
      <Button size="small" type="primary" disabled={!isFocused}>
        Add field
      </Button>
    </Popover>
  );
}

type LiteformProps = {
  width: number;
};

export default function LiteformEditorContainer(props: LiteformProps) {
  const docSize = React.useMemo(() => {
    const ratio = 2480 / 3508; // A4
    return {
      width: props.width,
      height: props.width / ratio,
    };
  }, [props.width]);
  return (
    <FormContext.Provider>
      <Row style={{}}>
        <Col
          style={{
            height: "100vh",
            padding: 16,
            marginRight: 16,
            width: docSize.width,
          }}
        >
          <LiteformRichText width={docSize.width} />
        </Col>
        <Col flex={1}>
          <SimpleBar style={{ maxHeight: "100vh", padding: 16 }}>
            <LiteForm />
          </SimpleBar>
        </Col>
      </Row>
    </FormContext.Provider>
  );
}

export function LiteformRichText(props: { width: number }) {
  const renderElement = React.useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = React.useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const formActions = FormContext.useActions();

  const editor = React.useMemo(
    () => withFields(formActions)(withTables(withReact(createEditor()))),
    []
  );

  const rawForm = FormContext.useSelectState((state) => state.form);
  const formValue = FormContext.useSelectState((state) => state.form.source);
  const mode = FormContext.useSelectState((state) => state.mode);

  const handleDownloadForm = React.useCallback(() => {
    const downloadLink = document.createElement("a");
    const file = new Blob([JSON.stringify(rawForm)], {
      type: "application/json",
    });
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = `form-${rawForm.id}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, [rawForm]);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event as any)) {
          event.preventDefault();
          // @ts-ignore
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
        }
      }
    },
    []
  );

  return (
    <Slate
      editor={editor}
      value={formValue}
      key={rawForm.id}
      onChange={(value) => {
        formActions.setSource(value);
      }}
    >
      {mode === LiteformMode.EDIT ? (
        <Row>
          <Col>
            <Space>
              <Button.Group>
                <MarkButton format="bold" icon={<TbBold />} />
                <MarkButton format="italic" icon={<TbItalic />} />
                <MarkButton format="underline" icon={<TbUnderline />} />
              </Button.Group>
              <Button.Group>
                <BlockButton format="heading-one" icon={<TbHeading />} />
                <BlockButton
                  format="heading-two"
                  icon={<TbHeading size={12} />}
                />
                <BlockButton format="block-quote" icon={<TbBlockquote />} />
                <BlockButton format="numbered-list" icon={<TbListNumbers />} />
                <BlockButton format="bulleted-list" icon={<TbList />} />
                <BlockButton format="left" icon={<TbAlignLeft />} />
                <BlockButton format="center" icon={<TbAlignCenter />} />
                <BlockButton format="right" icon={<TbAlignRight />} />
                <BlockButton format="justify" icon={<TbAlignJustified />} />
              </Button.Group>
              <Button.Group>
                <FieldCreationPopover
                  onCreate={(name, type) => {
                    const defaultField = builder.factories[type].defaultNode;
                    const field = {
                      ...defaultField,
                      name,
                      id: nanoid(6),
                    };
                    formActions.addField(field);
                    insertField(editor, `[${name}]`, field.id);
                  }}
                />
              </Button.Group>
              <Button.Group>
                <Button size="small" onClick={handleDownloadForm}>
                  Download Form
                </Button>
              </Button.Group>
              <Button.Group>
                <EditMetadata />
              </Button.Group>
            </Space>
          </Col>
        </Row>
      ) : null}
      <SimpleBar
        style={
          mode === LiteformMode.EDIT
            ? {
                width: props.width,
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "calc(100vh - 8px)",
                border: "1px solid #eee",
                padding: 16,
                boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
              }
            : {}
        }
      >
        <Editable
          readOnly={mode === LiteformMode.RESPONSE}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          style={{ lineHeight: 1.65, fontSize: 16 }}
        />
      </SimpleBar>
    </Slate>
  );
}

const withFields =
  (formActions: ReturnType<typeof FormContext["useActions"]>) =>
  (editor: Editor) => {
    const {
      isInline,
      markableVoid,
      isVoid,
      deleteFragment,
      deleteBackward,
      deleteForward,
    } = editor;

    editor.isInline = (element) => {
      return SlateElement.isElementType(element, "field")
        ? true
        : isInline(element);
    };

    editor.isVoid = (element) => {
      return SlateElement.isElementType(element, "field")
        ? true
        : isVoid(element);
    };

    editor.markableVoid = (element) => {
      return (
        SlateElement.isElementType(element, "field") || markableVoid(element)
      );
    };

    editor.deleteBackward = (unit) => {
      const { selection } = editor;
      if (selection) {
        const position = Editor.before(editor, selection, { unit });
        if (position) {
          const [parent] = Editor.parent(editor, position);
          if (SlateElement.isElementType(parent, "field") && parent.field_id) {
            formActions.deleteField(parent.field_id);
          }
        }
      }
      deleteBackward(unit);
    };

    editor.deleteForward = (unit) => {
      const { selection } = editor;
      if (selection) {
        const position = Editor.after(editor, selection, { unit });
        if (position) {
          const [parent] = Editor.parent(editor, position);
          if (SlateElement.isElementType(parent, "field") && parent.field_id) {
            formActions.deleteField(parent.field_id);
          }
        }
      }
      deleteForward(unit);
    };

    editor.deleteFragment = (direction) => {
      const { selection } = editor;
      if (selection) {
        const nodes = Editor.nodes(editor, {
          at: selection,
          match: (n) => SlateElement.isElementType(n, "field"),
        });
        for (const [node, path] of nodes) {
          if (SlateElement.isElementType(node, "field") && node.field_id) {
            formActions.deleteField(node.field_id);
          }
        }
      }
      deleteFragment(direction);
    };

    return editor;
  };

const insertField = (editor: Editor, name: string, field_id: string) => {
  const input: CustomElement = {
    field_id,
    type: "field",
    children: [{ text: name }],
  };
  Transforms.insertNodes(editor, [input, { text: " " }]);
};

const withTables = (editor: Editor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table-cell",
      });

      if (cell) {
        const [, cellPath] = cell;
        const start = Editor.start(editor, cellPath);

        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table-cell",
      });

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
    }

    deleteForward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === "table",
      });

      if (table) {
        return;
      }
    }

    insertBreak();
  };

  return editor;
};

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case "table":
      return (
        <table>
          <tbody {...attributes}>{children}</tbody>
        </table>
      );
    case "table-row":
      return <tr {...attributes}>{children}</tr>;
    case "table-cell":
      return <td {...attributes}>{children}</td>;
    case "field":
      return <FieldRenderer {...props}>{children}</FieldRenderer>;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = (props: RenderLeafProps) => {
  let { attributes, children, leaf } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      // @ts-ignore
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
};

const BlockButton = ({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      icon={icon}
      size="small"
      type={
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )
          ? "primary"
          : "default"
      }
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    ></Button>
  );
};

const MarkButton = ({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      size="small"
      type={isMarkActive(editor, format) ? "primary" : "default"}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      icon={icon}
    ></Button>
  );
};
