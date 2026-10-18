import type { MetadataRoute } from "next"

import { env } from "@/shared/config/env"

const SITE_URL = env.siteUrl

const ROUTES = ["", "/register", "/dashboard", "/markets", "/trade", "/ai"]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }))
}
