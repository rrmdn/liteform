import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    const cache = createCache();

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <StyleProvider cache={cache}>
              <App {...props} />
            </StyleProvider>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const styleText = extractStyle(cache);
    return {
      ...initialProps,
      styles: (
        <React.Fragment>
          {initialProps.styles}
          <style dangerouslySetInnerHTML={{ __html: styleText }} />
        </React.Fragment>
      ),
    };
  }
  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
