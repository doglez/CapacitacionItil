/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};
