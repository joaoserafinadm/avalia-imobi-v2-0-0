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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1417191295830741');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1417191295830741&ev=PageView&noscript=1"
          />
        </noscript>
                {/* <script src="https://sdk.mercadopago.com/js/v2"></script>
                <script src="https://www.mercadopago.com/v2/security.js"  output="deviceId"></script> */}
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
