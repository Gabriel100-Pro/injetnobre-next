import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const basePath = isGithubPages && repositoryName ? `/${repositoryName}` : undefined;

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  trailingSlash: isGithubPages,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath ?? '',
  },
  images: {
    unoptimized: isGithubPages,
    localPatterns: [
      {
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
