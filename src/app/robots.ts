import type { MetadataRoute } from 'next'

const SITE_URL = 'https://javavolcano-touroperator.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers — allow public pages, block internals
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },

      // OpenAI
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },

      // Common Crawl (trains many LLMs)
      { userAgent: 'CCBot', allow: '/' },

      // Anthropic
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'Claude-User', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },

      // Perplexity AI
      { userAgent: 'PerplexityBot', allow: '/' },

      // You.com
      { userAgent: 'YouBot', allow: '/' },

      // Google AI (Extended training, Vertex, Gemini grounding)
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Google-CloudVertexBot', allow: '/' },

      // Standard search engines
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Slurp', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },

      // Data/knowledge graph crawlers
      { userAgent: 'Diffbot', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'Omgilibot', allow: '/' },
      { userAgent: 'FacebookBot', allow: '/' },

      // Cohere AI
      { userAgent: 'cohere-ai', allow: '/' },

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
