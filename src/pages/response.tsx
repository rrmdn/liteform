import { Button, Col, Row, Skeleton, Space, Typography } from "antd";
import dayjs from "dayjs";
import { doc, Firestore, getDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import collections from "../app/collections";
import LiteForm from "../app/components/LiteForm";
import {
  FormContext,
  LiteformForm,
  LiteformMode,
  LiteformResponse,
} from "../app/components/LiteformContext";
import { LiteformRichText } from "../app/components/LiteformEditor";

const ResponseLoader = () => {
  const formActions = FormContext.useActions();
  const router = useRouter();
  const form = FormContext.useSelectState((state) => state.form);
  const rawResponse = FormContext.useSelectState((state) => state.response);
  const response = useQuery(["responses", router.query.id], async () => {
    if (!router.query.id) return undefined;
    return getDoc(doc(collections.responses, router.query.id as string)).then(
      (doc) => {
        return doc.data() as
          | (LiteformResponse & { form: LiteformForm })
          | undefined;
      }
    );
  });
  React.useEffect(() => {
    if (response.data) {
      if (response.data.responded_at instanceof Timestamp) {
        response.data.responded_at = response.data.responded_at.toDate();
      }
      formActions.setForm(response.data.form);
      formActions.setMode(LiteformMode.RESPONSE);
      formActions.setResponse(response.data);
    }
  }, [response.data]);
  const handlePrint = React.useCallback(() => {
    const printWindow = window.open(
      `/print`,
      "_blank",
      "location=yes,scrollbars=yes,status=yes"
    );
    printWindow?.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        printWindow?.postMessage({
          form: form,
          values: rawResponse?.responses || {},
          action: "LOAD_FORM_RESPONSE",
        });
      }, 1000);
    });
  }, [rawResponse?.responses, form]);
  const handleShare = React.useCallback(() => {
    navigator.share({
      title: form.name,
      text: form.description,
      url: window.location.href,
    });
  }, [form]);

  const handleDownload = React.useCallback(() => {
    if (!rawResponse) return;
    const el = document.createElement("a");
    el.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify({ form, response: rawResponse }, null, 2)
      )}`
    );
    el.setAttribute(
      "download",
      `form-${form.id}-response-${rawResponse.id}.json`
    );
    el.style.display = "none";
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }, [rawResponse, form]);

  if (response.isLoading) return <Skeleton />;
  if (response.isError) return <div>Something went wrong</div>;
  if (!response.data) return <div>Response not found</div>;
  return (
    <Row>
      <Col span={24}>
        <Typography.Title level={2}>{form.name}</Typography.Title>
        <Typography.Paragraph>{form.description}</Typography.Paragraph>
        {rawResponse ? (
          <Typography.Paragraph>
            {rawResponse.responded_at.toISOString()} •{" "}
            {rawResponse.respondent.name} • {rawResponse.respondent.email}
          </Typography.Paragraph>
        ) : null}
      </Col>
      <Col span={24}>
        <Space>
          <Button size="small" onClick={handlePrint}>
            Print
          </Button>
          <Button size="small" type="primary" onClick={handleShare}>
            Share
          </Button>
          <Button size="small" type="primary" onClick={handleDownload}>
            Download
          </Button>
        </Space>
      </Col>
      <Col span={24}>
        <LiteformRichText width={640} />
      </Col>
    </Row>
  );
};

export default function Response() {
  return (
    <div
      style={{
        maxWidth: 1024,
        margin: "0 auto",
        padding: "16px",
      }}
    >
      <div style={{ height: 52 }}></div>
      <FormContext.Provider>
        <ResponseLoader />
      </FormContext.Provider>
    </div>
  );
}
