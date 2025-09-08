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

