import { Button, Col, Form, Row, Space, Typography } from "antd";
import { useForm, UseFormReturn } from "react-hook-form";
import "./fields/loader";
import builder from "./fields/builder";
import { FormContext, FormField } from "./LiteformContext";
import { Node } from "../FactoryBuilder";
import FormLoader from "./FormLoader";

function LiteformInput(props: {
  field: FormField;
  form: UseFormReturn<Record<string, any>>;
}) {
  const FieldFactory = builder.factories[props.field.type];
  const node: Node = {
    ...props.field,
    value: props.form.watch(props.field.id),
  };
  return (
    <Col md={12} sm={24} xs={24}>
      <Form.Item label={props.field.name}>
        <FieldFactory.ValueEditor form={props.form} node={node} />
      </Form.Item>
    </Col>
  );
}

export default function LiteForm() {
  const fields = FormContext.useSelectState((state) => state.form.fields);
  const title = FormContext.useSelectState((state) => state.form.name);
  const rawForm = FormContext.useSelectState((state) => state.form);
  const form = useForm({
    defaultValues: Object.values(fields).reduce(
      (values, field) => ({
        ...values,
        [field.name]: field.default,
      }),
      {}
    ),
    mode: "onChange",
  });
  return (
    <>
      <FormLoader />
      <Form
        layout="vertical"
        size="small"
        onSubmitCapture={(e) => {
          const printWindow = window.open(
            `/print`,
            "_blank",
            "location=yes,height=570,width=640,scrollbars=yes,status=yes"
          );
          printWindow?.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
              printWindow?.postMessage({
                form: rawForm,
                values: form.getValues(),
                action: "LOAD_FORM_RESPONSE",
              });
            }, 1000);
          });
        }}
        style={{
          padding: 16,
        }}
      >
        <Typography.Title level={3}>{title}</Typography.Title>
        <Row gutter={16}>
          {Object.values(fields).map((field) => (
            <LiteformInput form={form} field={field} key={field.id} />
          ))}
        </Row>
        <Form.Item>
          <Space>
            <Button htmlType="submit" size="small" type="primary">
              Submit
            </Button>
            <Button htmlType="reset" size="small">
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
