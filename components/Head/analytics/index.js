import React from "react";

function AnalyticsScripts() {
  return (
    <>
      <script
        type="text/javascript"
        async
        src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/27c20af6-f2a5-4fb0-9a9b-3a64e69ebbfb-loader.js"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TVBGCSZT');`,
        }}
      />
    </>
  );
}

export default AnalyticsScripts;
