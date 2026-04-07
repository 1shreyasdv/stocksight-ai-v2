/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // important for Vercel
  images: {
    domains: ['stocksight-ai-v2-api.onrender.com'], // allow backend image URLs if any
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
}

module.exports = nextConfig
