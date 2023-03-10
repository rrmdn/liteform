import { Button, Form, Input, Popover, Tag } from "antd";
import React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Controller, useForm } from "react-hook-form";
import { RenderElementProps } from "slate-react";
import "./fields/loader";
import builder from "./fields/builder";
import { FormContext, FormField, LiteformMode } from "./LiteformContext";
import { Node } from "../FactoryBuilder";

function FieldEditor(props: { fieldId: string; children: React.ReactNode }) {
  const field = FormContext.useSelectState(
    (state) => state.form.fields[props.fieldId]
  );
  const formActions = FormContext.useActions();
  const FieldFactory = builder.factories[field.type];
  const form = useForm<
    Pick<typeof field, "options" | "name"> & {
      value: typeof field["default"];
    }
  >({
    defaultValues: {
      options: field.options,
      name: field.name,
      value: field.default,
    },
    mode: "onBlur",
  });
  const [state, setState] = React.useState({
    isOpen: false,
  });
  const options = form.watch("options");
  const valueEditorNode = React.useMemo(
    () => ({ ...FieldFactory.defaultNode, options }),
    [options, FieldFactory]
  );
  if (!FieldFactory) return null;
  return (
    <Popover
      open={state.isOpen}
      onOpenChange={(isOpen) => {
        setState({ isOpen });
      }}
      content={
        <Form
          size="small"
          layout="vertical"
          onSubmitCapture={form.handleSubmit((val) => {
            formActions.updateField(props.fieldId, val);
            setState({ isOpen: false });
          })}
        >
          <FieldFactory.OptionsEditor
            node={FieldFactory.defaultNode}
            // @ts-ignore
            form={form}
          />
          <Form.Item label="Default value">
            <FieldFactory.ValueEditor
              node={valueEditorNode}
              // @ts-ignore
              form={form}
            />
          </Form.Item>
          <Form.Item>
            <Button size="small" htmlType="submit" type="primary">
              Save
            </Button>
          </Form.Item>
        </Form>
      }
      trigger={["click"]}
    >
      {props.children}
    </Popover>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Tag closable onClose={resetErrorBoundary} color="error">
      Error
    </Tag>
  );
}

const ValueRenderer = (props: { field: FormField, attributes: RenderElementProps['attributes'] }) => {
  const FieldFactory = builder.factories[props.field.type];
  const value = FormContext.useSelectState(
    (state) =>
      state.response?.responses[props.field.name] || `[${props.field.name}]`
  );
  const node: Node = {
    ...props.field,
    value,
  };
  if (!FieldFactory) return null;
  return <FieldFactory.ValueRenderer attributes={props.attributes} node={node} />;
};

function FieldRenderer(props: RenderElementProps) {
  const fieldId = props.element.field_id || "";
  const field = FormContext.useSelectState(
    (state) => state.form.fields[fieldId]
  );
  const mode = FormContext.useSelectState((state) => state.mode);

  if (mode === LiteformMode.RESPONSE) {
    return <ValueRenderer attributes={props.attributes} field={field} />;
  }

  return (
    <FieldEditor fieldId={fieldId}>
      <Tag
        {...props.attributes}
        contentEditable={false}
        style={{ padding: "0 2px", margin: 0 }}
        color={"blue"}
      >
        {props.children}[{field.name}]
      </Tag>
    </FieldEditor>
  );
}

export default function FieldRendererBoundary(props: RenderElementProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FieldRenderer {...props} />
    </ErrorBoundary>
  );
}
