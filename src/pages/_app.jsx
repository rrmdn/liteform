import "antd/dist/reset.css";
import {
  ConfigProvider,
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Button,
  Space,
  Col,
  Row,
} from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { headingStyle } from ".";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      <Head>
        <title>LiteForm | Build printable forms with ease</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="The future of digital forms" />
        <meta name="author" content="Rizki Romadhoni" />
        <meta
          property="og:image"
          content="https://liteform.digital/images/build-printable-form.png"
        />
        <meta
          property="og:title"
          content="LiteForm | Build printable forms with ease"
        />
        <meta property="og:description" content="The future of digital forms" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@rrmdn__" />
        <meta
          name="twitter:title"
          content="LiteForm | Build printable forms with ease"
        />
        <meta
          name="twitter:description"
          content="The future of digital forms"
        />
        <meta
          name="twitter:image"
          content="https://liteform.digital/images/build-printable-form.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <Component {...pageProps} />

      {router.pathname !== "/print" ? (
        <div
          style={{
            position: "fixed",
            height: 40,
            background: "#ffffff",
            top: 0,
            left: 0,
            right: 0,
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <div
            style={{ maxWidth: 1024, margin: "0 auto", padding: "8px 16px" }}
          >
            <Row>
              <Col>
                <Space>
                  <Link href="/">
                    <Button
                      type="link"
                      size="small"
                      style={{ ...headingStyle, fontWeight: "bold", paddingLeft: 0 }}
                    >
                      LITEFORM
                    </Button>
                  </Link>
                  <Link href="/#examples">
                    <Button
                      style={{ color: "#666", fontWeight: "500" }}
                      type="link"
                      size="small"
                    >
                      Examples
                    </Button>
                  </Link>
                  <Link href="/editor">
                    <Button
                      style={{ color: "#666", fontWeight: "500" }}
                      type="link"
                      size="small"
                    >
                      Editor
                    </Button>
                  </Link>
                  <Link href="/form">
                    <Button
                      style={{ color: "#666", fontWeight: "500" }}
                      type="link"
                      size="small"
                    >
                      Form
                    </Button>
                  </Link>
                </Space>
              </Col>
              <Col flex={1}></Col>
              <Col>
                <Space>
                  <Button
                    href="https://github.com/rrmdn/liteform/issues"
                    type="link"
                    size="small"
                    target="_blank"
                    style={{paddingRight: 0}}
                  >
                    Report a bug
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      ) : null}
    </ConfigProvider>
  );
}
