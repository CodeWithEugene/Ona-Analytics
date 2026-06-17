/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@aws-sdk/rds-signer"],
}

module.exports = nextConfig
