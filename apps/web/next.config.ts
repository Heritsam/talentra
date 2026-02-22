import "@talentra/env/web";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  reactCompiler: true,
};

export default nextConfig;

initOpenNextCloudflareForDev();
