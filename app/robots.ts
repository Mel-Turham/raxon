import type { MetadataRoute } from "next"

import { env } from "@/shared/config/env"

const SITE_URL = env.siteUrl

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
