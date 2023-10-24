import Document, { Head, Html, Main, NextScript } from 'next/document'
import daisyuiThemes from 'styles/daisyui-themes.json'

const themes = Object.keys(daisyuiThemes) || ['']
export const defaultTheme = themes[0]

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html data-theme={defaultTheme}>
        <Head />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&family=Roboto+Mono:wght@700&display=swap"
          rel="stylesheet"
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
