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
    },
    "/fi/perusteet/vammaisuuden-tyypit/nakovammaisuus" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/nakemiseen-liittyvat-rajoitteet"
    },
    "/fi/perusteet/vammaisuuden-tyypit/kuulohairiot" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/kuulemiseen-liittyvat-rajoitteet"
    },
    "/fi/perusteet/vammaisuuden-tyypit/puhevammaisuus" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/puheeseen-liittyvat-rajoitteet"
    },
    "/fi/perusteet/vammaisuuden-tyypit/liikkuvuus-joustavuus-ja-ruumiinrakenteeseen-liittyvat-vammat" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/liikkumiseen-ja-fyysiseen-toimintakykyyn-liittyvat-rajoitteet"
    },
    "/fi/perusteet/vammaisuuden-tyypit/kognitiiviset-hairiot" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/kognitiiviset-ja-oppimiseen-liittyvat-rajoitteet"
    },
    "/fi/perusteet/vammaisuuden-tyypit/psykologiset-psyykkiset-vammat" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/mielenterveyteen-liittyvat-rajoittee"
    },
    "/fi/perusteet/vammaisuuden-tyypit/kohtausvammaisuus" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/valoherkkyys-ja-kohtaukset"
    },
    "/fi/perusteet/vammaisuuden-tyypit/monivammaisuus-yhdistelmavammaisuus" : {
      status: 302,
      destination: "/fi/perusteet/vammaisuuden-tyypit/monivammaisuus-ja-yhdistelmat"
    },
    "/en/fundamentals/theoretical-models-of-disability/economical-model" : {
      status: 302,
      destination: "/en/fundamentals/theoretical-models-of-disability/economic-model"
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

