// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "@nuxtjs/supabase"],
  colorMode: {
    preference: "cupcake", // default theme
    dataValue: "theme", // activate data-theme in <html> tag
  },
});
