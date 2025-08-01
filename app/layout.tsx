import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "CRM Ampère",
	description: "Bem vindo ao CRM Ampère !",
};
export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
	session,
}: {
	children: React.ReactNode;
	session: any;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
