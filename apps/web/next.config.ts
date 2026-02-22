import "@talentra/env/web";
import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;

initOpenNextCloudflareForDev();
