import Document, { DocumentContext } from "next/document";
import { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  // TODO: The Tailwind template needs those classes
  render() {
    return (
      <Html className="h-full">
        <Head />
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
