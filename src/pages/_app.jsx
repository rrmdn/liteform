import "antd/dist/reset.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>LiteForm | Build printable forms with ease</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="The future of digital forms" />
        <meta name="author" content="Rizki Romadhoni" />
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
    </>
  );
}
