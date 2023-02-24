import "antd/dist/reset.css";
import "./main.css";
import {
  ConfigProvider,
  Button,
  Space,
  Col,
  Row,
  Popover,
  Avatar,
  Dropdown,
} from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { headingStyle } from ".";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import UserContext from "../app/components/UserContext";
import { AppProps } from "next/app";
import React from "react";
import * as openpgp from "openpgp/lightweight";
import { QueryClient, QueryClientProvider } from "react-query";
import firebase, { db } from "../app/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const queryClient = new QueryClient();

const Navigation = () => {
  const router = useRouter();
  const user = UserContext.useSelectState((state) => state.user);
  const userActions = UserContext.useActions();
  React.useEffect(() => {
    firebase.auth().onIdTokenChanged((user) => {
      const keypair = localStorage.getItem("keypair");
      if (!keypair && user) {
        openpgp
          .generateKey({
            type: "ecc",
            curve: "curve25519",
            userIDs: [
              {
                name: user.displayName || "",
                email: user.email || user.uid || "",
              },
            ],
          })
          .then((key) => {
            localStorage.setItem("keypair", JSON.stringify(key));
            return key;
          })
          .then(async function savePublicKey(key) {
            const profilesRef = collection(db, "profiles");
            const profile = {
              id: user.uid,
              keys: {
                publicKey: key.publicKey,
              },
            };
            setDoc(doc(profilesRef, profile.id), profile);
          })
          .catch((err) => {
            localStorage.removeItem("keypair");
            throw err;
          });
      }
      if (!user) {
        localStorage.removeItem("keypair");
      }
      userActions.setUser(user);
    });
  }, []);

  const handleLogout = React.useCallback(() => {
    firebase.auth().signOut();
  }, []);

  if (router.pathname === "/print") return null;

  return (
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
      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "8px 16px" }}>
        <Row>
          <Col>
            <Space>
              <Link href="/">
                <Button
                  type="link"
                  size="small"
                  style={{
                    ...headingStyle,
                    fontWeight: "bold",
                    paddingLeft: 0,
                  }}
                >
                  LITEFORM
                </Button>
              </Link>
              <Link className="nav-item" href="/#examples">
                <Button
                  style={{ color: "#666", fontWeight: "500" }}
                  type="link"
                  size="small"
                >
                  Examples
                </Button>
              </Link>
              <Link className="nav-item" href="/editor">
                <Button
                  style={{ color: "#666", fontWeight: "500" }}
                  type="link"
                  size="small"
                >
                  Editor
                </Button>
              </Link>
              <Link className="nav-item" href="/form">
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
              >
                Report a bug
              </Button>
              {user ? (
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        label: `Logout (${user.email})`,
                        key: 1,
                        onClick: handleLogout,
                      },
                    ],
                  }}
                >
                  <Avatar
                    size="small"
                    src={user.photoURL}
                    alt={user.displayName || ""}
                  />
                </Dropdown>
              ) : (
                <Popover
                  trigger={["click"]}
                  content={
                    <StyledFirebaseAuth
                      uiConfig={{
                        signInFlow: "popup",
                        signInOptions: [
                          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        ],
                        callbacks: {
                          signInSuccessWithAuthResult: () => false,
                        },
                      }}
                      firebaseAuth={firebase.auth()}
                    />
                  }
                >
                  <Button size="small">Login</Button>
                </Popover>
              )}
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider>
        <ConfigProvider
          theme={{
            token: {},
          }}
        >
          <Head>
            <title>LiteForm | Build printable forms with ease</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
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
            <meta
              property="og:description"
              content="The future of digital forms"
            />

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
          <Navigation />
        </ConfigProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
