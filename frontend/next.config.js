/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_CAST_SERVICE_URL: process.env.CAST_SERVICE_URL,
  },
}

module.exports = nextConfig