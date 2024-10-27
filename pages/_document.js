import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {



    return (
        <Html lang="pt-BR">
            <Head>
                <link rel='manifest' href='/manifest.json' />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
                <meta name="theme-color" content="#5a5a5a" />
                <script src="https://sdk.mercadopago.com/js/v2"></script>
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}