import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

// const isGithubActions = process.env.GITHUB_ACTIONS || false;
// let assetPrefix = "";
// let basePath = "";
// if (isGithubActions) {
//   // 去掉 `<owner>/`
//   const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, "");

//   assetPrefix = `/${repo}/`;
//   basePath = `/${repo}`;
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // assetPrefix: assetPrefix,
  // basePath: basePath,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'favicon.im'
      },
      {
        protocol: 'https',
        hostname: 'www.google.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
}

// export default nextConfig;

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)