import { Button, Form, Row, Space, Typography } from "antd";
import { useForm } from "react-hook-form";
import "./fields/loader";
import { FormContext, LiteformForm, LiteformResponse } from "./LiteformContext";
import FormLoader from "./FormLoader";
import LiteformInput from "./LiteformInput";
import React from "react";
import firebase from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import collections from "../collections";
import { nanoid } from "nanoid";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

export default function LiteForm() {
  const fields = FormContext.useSelectState((state) => state.form.fields);
  const title = FormContext.useSelectState((state) => state.form.name);
  const description = FormContext.useSelectState(
    (state) => state.form.description
  );
  const router = useRouter();
  const rawForm = FormContext.useSelectState((state) => state.form);
  const form = useForm({
    defaultValues: Object.values(fields).reduce(
      (values, field) => ({
        ...values,
        [field.name]: field.default,
      }),
      {}
    ) as Record<string, any>,
    mode: "onChange",
  });
  const submitResponse = useMutation({
    mutationFn: async (response: LiteformResponse) => {
      const responseRef = doc(collections.responses, response.id);
      console.log(response);
      await setDoc(responseRef, response);
      router.push(`/responses?id=${response.id}`);
    },
  });
  const handleSubmit = React.useCallback(() => {
    const values = form.getValues();
    for (const key in values) {
      if (typeof values[key] === "undefined") {
        delete values[key];
      }
    }
    const user = firebase.auth().currentUser;
    const response: LiteformResponse & { form: LiteformForm } = {
      id: nanoid(13),
      respondent: {
        name: user?.displayName || "unknown",
        email: user?.email || "unknown",
        id: user?.uid || nanoid(13),
      },
      responses: values,
      form: rawForm,
      responded_at: new Date(),
    };
    submitResponse.mutate(response);
  }, [rawForm, submitResponse.mutate]);
  return (
    <>
      <FormLoader />
      <Form
        layout="vertical"
        size="small"
        onSubmitCapture={handleSubmit}
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
            <Button
              loading={submitResponse.isLoading}
              htmlType="submit"
              size="small"
              type="primary"
            >
              Submit
            </Button>
            <Button
              htmlType="reset"
              size="small"
              disabled={submitResponse.isLoading}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
