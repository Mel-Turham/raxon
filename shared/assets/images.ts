import aiAssistant from "./images/ai-raxon.png"
import aiDark from "./images/showcase/ai-dark.jpg"
import aiLight from "./images/showcase/ai-light.jpg"
import dashboardDark from "./images/showcase/dashboard-dark.jpg"
import dashboardLight from "./images/showcase/dashboard-light.jpg"
import tradeDark from "./images/showcase/trade-dark.jpg"
import tradeLight from "./images/showcase/trade-light.jpg"

export const aiAssistantImage = aiAssistant

export const showcaseImages = {
  dashboard: { light: dashboardLight, dark: dashboardDark },
  trade: { light: tradeLight, dark: tradeDark },
  ai: { light: aiLight, dark: aiDark },
} as const
