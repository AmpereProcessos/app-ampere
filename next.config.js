/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/common',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
])

module.exports = withTM({
  reactStrictMode: true,
  env: {
    DISTANCE_API: process.env.DISTANCE_API,
  },
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
        use: ['@svgr/webpack'],
      },
    ],
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'firebasestorage.googleapis.com', 'sc-erp.s3.amazonaws.com', 'localhost'],
  },
})
