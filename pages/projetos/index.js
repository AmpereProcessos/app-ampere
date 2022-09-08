import React, { useEffect } from "react";
import { useRouter } from "next/router";
const acessKey = "Projetos";
function Index({ credentials }) {
  const router = useRouter();
  if (credentials.nome == undefined) {
    router.push("/auth");
  } else if (!credentials.accessibleRoutes?.includes(acessKey)) {
    return <div>Acesso não permitido</div>;
  } else {
    return <div>Index</div>;
  }
}

export default Index;
