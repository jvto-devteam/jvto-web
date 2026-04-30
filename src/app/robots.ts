import type { MetadataRoute } from 'next'

const SITE_URL = 'https://javavolcano-touroperator.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers — allow everything
      { userAgent: '*', allow: '/' },

      // Anthropic
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },

      // Google AI (Vertex, Gemini grounding)
      { userAgent: 'Google-CloudVertexBot', allow: '/' },

      // Mistral
      { userAgent: 'MistralAI-User', allow: '/' },

      // xAI / Grok
      { userAgent: 'xAI-Bot', allow: '/' },

      // Apple (Siri, Safari AI features, Apple Intelligence)
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}