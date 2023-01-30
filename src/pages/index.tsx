import {
  Button,
  Card,
  Col,
  Divider,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import fs, { readFileSync } from "fs";
import path from "path";
import { LiteformForm } from "../app/components/LiteformContext";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export const headingStyle = {
  backgroundImage: "linear-gradient(60deg, #3a47d5 0%, #00d2ff 100%)",
  color: "transparent",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
};

export default function Home(props: { forms: LiteformForm[] }) {
  return (
    <SimpleBar
      style={{
        maxHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: 1024,
          margin: "0 auto",
          padding: 16,
        }}
      >
        <Typography.Title
          style={{
            margin: "120px 0",
            fontSize: 48,
            textAlign: "center",
            ...headingStyle,
          }}
        >
          LiteForm | Build printable forms with ease
        </Typography.Title>
        <Divider style={{ margin: "32px 0" }} />
        <Row gutter={[32, 32]}>
          <Col md={8} sm={24}>
            <Typography.Title level={1} style={headingStyle}>
              Build the form
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: 16 }}>
              Write a document using the rich text editor. Add{" "}
              <Tag style={{ padding: "0 2px", margin: 0 }} color={"blue"}>
                [parameterized field]
              </Tag>{" "}
              to your document while editing by clicking the{" "}
              <Button
                type="primary"
                size="small"
                style={{ fontSize: 12, height: 20 }}
              >
                Add field
              </Button>{" "}
              button. Choose any field type from the dropdown. For example, you
              can add a dropdown field with options like "Yes" and "No". You can
              also add a text field, a date field, a number field, and more.
            </Typography.Paragraph>
            <Typography.Paragraph style={{ fontSize: 16 }}>
              When you are done with the form. You can click the{" "}
              <Button size="small" style={{ fontSize: 12, height: 20 }}>
                Download Form
              </Button>{" "}
              button to save the form as a JSON file and share it with your
              team.
            </Typography.Paragraph>
            <br />
            <Link href={"/editor"}>
              <Button type="primary">Build a form →</Button>
            </Link>
          </Col>
          <Col md={16} sm={24}>
            <img
              style={{
                width: "100%",
                borderRadius: 5,
              }}
              src="/images/build-printable-form.png"
            />
          </Col>
        </Row>
        <Divider style={{ margin: "32px 0" }} />
        <Row gutter={[32, 32]}>
          <Col md={16} sm={24}>
            <img
              style={{
                width: "100%",
                borderRadius: 5,
              }}
              src="/images/fill-the-form.png"
            />
          </Col>
          <Col md={8} sm={24}>
            <Typography.Title level={1} style={headingStyle}>
              Fill the form
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: 16 }}>
              Load your form either from a URL or a file and start filling it.
              Hit the{" "}
              <Button
                type="primary"
                size="small"
                style={{ fontSize: 12, height: 20 }}
              >
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
        <Row gutter={[32, 32]}>
          <Col md={8} sm={24}>
            <Typography.Title level={1} style={headingStyle}>
              Print the document
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: 16 }}>
              A new window will popup with the filled form. A print dialog will
              appear. You can choose to print the document or save it as a PDF
              file.
            </Typography.Paragraph>
          </Col>

          <Col md={16} sm={24}>
            <img
              style={{
                width: "100%",
                borderRadius: 6,
              }}
              src="/images/print-the-form.png"
            />
          </Col>
        </Row>
        <Divider style={{ margin: "32px 0" }} />
        <Row id="examples">
          <Col span={24}>
            <Typography.Title level={1} style={headingStyle}>
              Examples
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: 16 }}>
              Here are some examples of forms built with LiteForm.
            </Typography.Paragraph>
            <Row gutter={[32, 32]}>
              {props.forms.map((form) => (
                <Col md={8} sm={24} key={form.id}>
                  <Card title={form.name}>
                    <Typography.Paragraph style={{ fontSize: 16 }}>
                      {form.description}
                    </Typography.Paragraph>
                    <Space>
                      <Link href={`/form?form_url=/forms/form-${form.id}.json`}>
                        <Button type="primary" size="small">
                          Fill
                        </Button>
                      </Link>
                      <Link
                        href={`/editor?form_url=/forms/form-${form.id}.json`}
                      >
                        <Button size="small">Copy</Button>
                      </Link>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </SimpleBar>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(path.join(process.cwd(), "public", "forms"));
  const jsonContents = files
    .filter((file) => file.endsWith(".json"))
    .map((file) =>
      readFileSync(path.join(process.cwd(), "public", "forms", file), "utf-8")
    );
  const forms = jsonContents.map(
    (content) => JSON.parse(content) as LiteformForm
  );

  return {
    props: {
      forms,
    },
  };
}
