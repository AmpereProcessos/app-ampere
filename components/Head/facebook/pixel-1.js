import React, { useEffect } from "react";
import * as fbq from "../../../utils/fpixel";
function FacebookPixel() {
  return (
    <>
      {/**Meta Pixel Code */}
      <meta
        name="facebook-domain-verification"
        content="0hufc7839y66urgaxa8ahifp1xpos2"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '816681253125999');
                fbq('track', 'PageView');`,
        }}
      />
      <script
        type="text/javascript"
        async
        src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/27c20af6-f2a5-4fb0-9a9b-3a64e69ebbfb-loader.js"
      ></script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=816681253125999&ev=PageView&noscript=1"
        />
      </noscript>
      {/**End Meta Pixel Code */}
    </>
  );
}
export default FacebookPixel;
