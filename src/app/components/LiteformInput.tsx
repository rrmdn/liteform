import {
  Col,
  Form
} from "antd";
import { UseFormReturn } from "react-hook-form";
import builder from "./fields/builder";
import { FormField } from "./LiteformContext";
import { Node } from "../FactoryBuilder";


export default function LiteformInput(props: {
  field: FormField;
  form: UseFormReturn<Record<string, any>>;
}) {
  const FieldFactory = builder.factories[props.field.type];
  const node: Node = {
    ...props.field,
    value: props.form.watch(props.field.id)
  };
  return (
    <Col md={12} sm={24} xs={24}>
      <Form.Item label={props.field.name}>
        <FieldFactory.ValueEditor form={props.form} node={node} />
      </Form.Item>
    </Col>
  );
}
