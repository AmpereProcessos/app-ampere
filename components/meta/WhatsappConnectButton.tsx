// components/WhatsAppConnectButton.js

import Script from "next/script";
import React, { useEffect } from "react";

const WhatsAppConnectButton = () => {
	// Inicializa o SDK do Facebook assim que ele for carregado
	const handleSdkLoad = () => {
		window.fbAsyncInit = () => {
			FB.init({
				appId: process.env.NEXT_PUBLIC_META_APP_ID,
				cookie: true,
				xfbml: true,
				version: "v19.0",
			});
			FB.AppEvents.logPageView();
		};
	};

	// Função chamada pelo clique no botão
	const launchWhatsAppSignup = () => {
		// Verifica se o SDK do FB está carregado
		if (!window.FB) {
			alert("O SDK do Facebook ainda não carregou. Tente novamente em um instante.");
			return;
		}

		window.FB.login(
			(response) => {
				if (response.authResponse?.code) {
					// O usuário autorizou! Agora envie o código para seu backend.
					console.log("Código de autorização recebido:", response.authResponse.code);

					// Chame sua API route para trocar o código por um token de acesso
					fetch("/api/integracao/whatsapp/connect", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ code: response.authResponse.code }),
					})
						.then((res) => res.json())
						.then((data) => {
							if (data.success) {
								alert("Conexão com WhatsApp realizada com sucesso!");
								// Você pode redirecionar o usuário ou atualizar a UI aqui
							} else {
								alert(`Erro: ${data.error}`);
							}
						})
						.catch((error) => {
							console.error("Erro ao conectar com o backend:", error);
							alert("Ocorreu um erro inesperado.");
						});
				} else {
					console.log("O usuário cancelou o login ou não autorizou completamente.");
				}
			},
			{
				// Este é o ID de configuração do Embedded Signup
				config_id: process.env.META_EMBEDDED_SIGNUP_CONFIG_ID,
				// O 'code' é o tipo de resposta que precisamos para o fluxo de servidor
				response_type: "code",
				// Você pode adicionar um estado para segurança (CSRF)
				// state: 'seu_estado_unico_aqui'
			},
		);
	};
	console.log("[INFO] [WHATSAPP_CONNECT_BUTTON] Params", {
		appId: process.env.NEXT_PUBLIC_META_APP_ID,
		embeddedSignupConfigId: process.env.META_EMBEDDED_SIGNUP_CONFIG_ID,
	});
	return (
		<>
			<Script src="https://connect.facebook.net/en_US/sdk.js" onLoad={handleSdkLoad} strategy="lazyOnload" />
			<button type="button" onClick={launchWhatsAppSignup} style={{ padding: "10px 20px", fontSize: "16px" }}>
				Conectar com WhatsApp
			</button>
		</>
	);
};

export default WhatsAppConnectButton;
