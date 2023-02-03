import { Button, Form, Row, Space, Typography } from "antd";
import { useForm } from "react-hook-form";
import "./fields/loader";
import { FormContext, LiteformMode } from "./LiteformContext";
import FormLoader from "./FormLoader";
import LiteformInput from "./LiteformInput";
import React from "react";
import * as openpgp from "openpgp/lightweight";
import { nanoid } from "nanoid";
import { app } from "../firebase";

export default function LiteForm() {
  const fields = FormContext.useSelectState((state) => state.form.fields);
  const title = FormContext.useSelectState((state) => state.form.name);
  const description = FormContext.useSelectState(
    (state) => state.form.description
  );
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
  React.useEffect(function generateKeypairIfNotExist() {
    const keypair = localStorage.getItem("keypair");
    if (!keypair) {
      openpgp
        .generateKey({
          type: "ecc",
          curve: "curve25519",
          userIDs: [
            {
              name: "Liteform",
              email:
                app.auth().currentUser?.email || `${nanoid()}@liteform.digital`,
            },
          ],
        })
        .then((key) => {
          localStorage.setItem("keypair", JSON.stringify(key));
        });
    }
  }, []);
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
        <Typography.Paragraph>{description}</Typography.Paragraph>
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
