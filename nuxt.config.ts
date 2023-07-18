// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
  ],
  runtimeConfig: {
    public: {
      WALLET_CONNECT_PROJECT_ID: "",
    },
  },
  colorMode: {
    preference: "cupcake", // default theme
    dataValue: "theme", // activate data-theme in <html> tag
  },

  routeRules: {
    "connect-wallet": { ssr: false },
  },
});
