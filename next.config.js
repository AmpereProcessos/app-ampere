/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	swcMinify: true,
	module: {
		rules: [
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ["@svgr/webpack"],
			},
		],
	},
	images: {
		// domains: ['avatars.githubusercontent.com', 'firebasestorage.googleapis.com', 'sc-erp.s3.amazonaws.com', 'localhost'],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "sc-erp.s3.amazonaws.com",
			},
			{
				protocol: "https",
				hostname: "gkbkgoyxtxdvxfomwijd.supabase.co",
			},
			{
				protocol: "https",
				hostname: "fortunate-dotterel-211.convex.cloud",
			},
			{
				protocol: "http",
				hostname: "localhost",
			},
		],
	},
};

module.exports = nextConfig;
