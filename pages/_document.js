import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,200;6..12,300;6..12,400;6..12,500;6..12,600;6..12,700;6..12,800;6..12,1000&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/primeflex@latest/primeflex.css"/>   
       
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
