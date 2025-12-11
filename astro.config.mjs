// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: 'https://a11y.ing/',
  trailingSlash: 'always',
  redirects: {
    "/koodia-suomesta": {
      status: 302,
      destination: "/fi/"
    },
    "/drupalcamp": {
      status: 302,
      destination: "/"
    },
    "/en/fundamentals/the-basics/who-accessibility-is-for" : {
      status: 302,
      destination: "/en/fundamentals/the-basics/who-is-accessibility-for"
    }
  },
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        fi: 'fi'
      }
    }
  }), tailwind(), react(), icon()],
});

