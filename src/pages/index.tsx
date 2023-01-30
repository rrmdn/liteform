import { Button, Col, Divider, Layout, Row, Typography } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: 16 }}>
      <Typography.Title style={{ margin: "120px 0", textAlign: "center" }}>
        LiteForm | Build printable forms with ease
      </Typography.Title>
      <Divider style={{ margin: "32px 0" }} />
      <Row gutter={32}>
        <Col span={8}>
          <Typography.Title level={2}>Build the form</Typography.Title>
          <Typography.Paragraph style={{ lineHeight: 1.7 }}>
            Write a document using the rich text editor. Click on the{" "}
            <Button type="primary" size="small">
              Add field
            </Button>{" "}
            button to add a parameterized field to your document. Choose any
            field type from the dropdown. For example, you can add a dropdown
            field with options like "Yes" and "No". You can also add a text
            field, a date field, a number field, and more.
          </Typography.Paragraph>
          <Typography.Paragraph style={{ lineHeight: 1.7 }}>
            When you are done with the form. You can click the{" "}
            <Button size="small">Download Form</Button> button to save the form
            as a JSON file and share it with your team.
          </Typography.Paragraph>
          <br />
          <Link href={"/editor"}>
            <Button type="primary">Build a form →</Button>
          </Link>
        </Col>
        <Col span={16}>
          <img
            style={{ width: "100%", borderRadius: 8, border: "1px solid #ccc" }}
            src="/images/build-printable-form.png"
          />
        </Col>
      </Row>
      <Divider style={{ margin: "32px 0" }} />
      <Row gutter={32}>
        <Col span={16}>
          <img
            style={{ width: "100%", borderRadius: 8, border: "1px solid #ccc" }}
            src="/images/fill-the-form.png"
          />
        </Col>
        <Col span={8}>
          <Typography.Title level={2}>Fill the form</Typography.Title>
          <Typography.Paragraph style={{ lineHeight: 1.7 }}>
            Load your form either from a URL or a file and start filling it. Hit
            the{" "}
            <Button type="primary" size="small">
              Submit
            </Button>{" "}
            button to start printing the document.
          </Typography.Paragraph>
          <br />
          <Link href={"/form"}>
            <Button type="primary">Fill a form →</Button>
          </Link>
        </Col>
      </Row>
      <Divider style={{ margin: "32px 0" }} />
    </div>
  );
}
