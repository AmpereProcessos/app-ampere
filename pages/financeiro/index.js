import React, { useEffect } from "react";
import { useRouter } from "next/router";
import AcessDenied from "../../components/Accessdenied";
const acessKey = "Financeiro";
function Index({ credentials }) {
  const router = useRouter();
  if (credentials.nome == undefined) {
    router.push("/auth");
  } else if (!credentials.accessibleRoutes?.includes(acessKey)) {
    return <AcessDenied />;
  } else {
    return <div>Index</div>;
  }
}

export default Index;
