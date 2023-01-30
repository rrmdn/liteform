import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import Head from "next/head";

export default function App({ Component, pageProps }) {
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
        <meta property="og:image" content="/images/build-printable-form.png" />
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
        <meta name="twitter:image" content="/images/build-printable-form.png" />

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
    </ConfigProvider>
  );
}
