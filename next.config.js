/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
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
				protocol: "http",
				hostname: "localhost",
			},
		],
	},
};

module.exports = nextConfig;
