"use client";
import Link from "next/link";
import React, { useEffect } from "react";

interface FacebookLoginResponse {
	authResponse?: {
		code: string;
		accessToken?: string;
		expiresIn?: number;
	};
	status?: string;
}

interface FacebookSDK {
	init: (params: {
		appId: string;
		autoLogAppEvents: boolean;
		xfbml: boolean;
		version: string;
	}) => void;
	login: (
		callback: (response: FacebookLoginResponse) => void,
		options: {
			config_id: string;
			response_type: string;
			override_default_response_type: boolean;
			extras: {
				setup: Record<string, unknown>;
			};
		},
	) => void;
}

declare global {
	interface Window {
		FB: FacebookSDK;
		fbAsyncInit: () => void;
	}
}

interface WhatsAppEmbeddedSignupData {
	phone_number_id?: string;
	waba_id?: string;
	business_id?: string;
	ad_account_ids?: string[];
	page_ids?: string[];
	dataset_ids?: string[];
	current_step?: string;
	error_message?: string;
	error_id?: string;
	session_id?: string;
	timestamp?: string;
}

interface MessageEventData {
	data: WhatsAppEmbeddedSignupData;
	type: string;
	event: string;
}

const WhatsAppConnectButton = () => {
	const [sdkLoaded, setSdkLoaded] = React.useState(false);

	useEffect(() => {
		// Check if SDK is already loaded
		if (window.FB) {
			setSdkLoaded(true);
			return;
		}

		// Load Facebook SDK
		const script = document.createElement("script");
		script.src = "https://connect.facebook.net/en_US/sdk.js";
		script.async = true;
		script.defer = true;
		script.crossOrigin = "anonymous";

		script.onerror = () => {
			console.error("[ERROR] Failed to load Facebook SDK");
		};

		document.body.appendChild(script);

		// SDK initialization
		window.fbAsyncInit = () => {
			const appId = process.env.NEXT_PUBLIC_META_APP_ID;
			if (!appId) {
				console.error("NEXT_PUBLIC_META_APP_ID is not defined");
				return;
			}

			try {
				window.FB.init({
					appId,
					autoLogAppEvents: false, // Disable auto logging to prevent fetch errors
					xfbml: true,
					version: "v21.0",
				});
				console.log("[INFO] Facebook SDK initialized successfully");
				setSdkLoaded(true);
			} catch (error) {
				console.error("[ERROR] Failed to initialize Facebook SDK:", error);
			}
		};

		// Session logging message event listener
		const handleMessage = (event: MessageEvent) => {
			if (!event.origin.endsWith("facebook.com")) return;

			try {
				const data: MessageEventData = JSON.parse(event.data);
				if (data.type === "WA_EMBEDDED_SIGNUP") {
					console.log("WhatsApp Embedded Signup message event:", data);

					// Send data to your server
					if (data.event === "FINISH" || data.event === "FINISH_ONLY_WABA" || data.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING") {
						// Success - save the WABA and phone number data
						fetch("/api/integracao/whatsapp/connect/save-metadata", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(data.data),
						}).catch((error) => {
							console.error("Error saving WhatsApp metadata:", error);
						});
					} else if (data.event === "CANCEL") {
						// User abandoned the flow
						console.log("User abandoned flow at step:", data.data.current_step);
					}
				}
			} catch (error) {
				// Handle non-JSON messages
				console.log("Message event (non-JSON):", event.data);
			}
		};

		window.addEventListener("message", handleMessage);

		return () => {
			window.removeEventListener("message", handleMessage);
			if (script.parentNode) {
				document.body.removeChild(script);
			}
		};
	}, []);

	// Response callback
	const fbLoginCallback = (response: FacebookLoginResponse) => {
		if (response.authResponse) {
			const code = response.authResponse.code;
			console.log("Exchangeable code received:", code);

			// Send code to your server to exchange for access token
			fetch("/api/integracao/whatsapp/connect/exchange-token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("Token exchange response:", data);
					if (data.success) {
						// Redirect to settings page or show success message
						window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/configuracoes?mode=whatsapp-connection`;
					} else {
						console.error("Token exchange failed:", data);
						alert("Falha ao conectar com WhatsApp. Por favor, tente novamente.");
					}
				})
				.catch((error) => {
					console.error("Error exchanging token:", error);
					alert("Erro ao processar conexão com WhatsApp.");
				});
		} else {
			console.log("Login response (no auth):", response);
		}
	};

	// Launch method
	const launchWhatsAppSignup = () => {
		try {
			if (!window.FB) {
				console.error("Facebook SDK not loaded yet");
				return;
			}

			const configId = process.env.NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID;
			if (!configId) {
				console.error("NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID is not defined");
				alert("Configuração do WhatsApp não encontrada. Entre em contato com o suporte.");
				return;
			}

			window.FB.login(fbLoginCallback, {
				config_id: configId,
				response_type: "code",
				override_default_response_type: true,
				extras: {
					setup: {},
					featureType: "whatsapp_business_app_onboarding", // set to 'whatsapp_business_app_onboarding'
					sessionInfoVersion: "3",
				},
			});
		} catch (error) {
			console.error("Error launching WhatsApp signup:", error);
			alert("Erro ao iniciar conexão com WhatsApp. Por favor, tente novamente.");
		}
	};

	return <Link href="/api/integracao/whatsapp/connect/generate">Conectar com WhatsApp</Link>;
	return (
		<button
			type="button"
			onClick={launchWhatsAppSignup}
			style={{
				backgroundColor: "#1877f2",
				border: 0,
				borderRadius: "4px",
				color: "#fff",
				cursor: "pointer",
				fontFamily: "Helvetica, Arial, sans-serif",
				fontSize: "16px",
				fontWeight: "bold",
				height: "40px",
				padding: "0 24px",
			}}
		>
			Conectar com WhatsApp
		</button>
	);
};

export default WhatsAppConnectButton;
