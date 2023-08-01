// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@vueuse/nuxt",
    "@vee-validate/nuxt",
    "nuxt-proxy",
  ],
  proxy: {
    options: {
      target: "http://localhost:55321",
      changeOrigin: true,
      pathFilter: ["/rest/**", "/auth/**", "/storage/**"],
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: { types: [".kadena/pactjs-generated"] },
    },
  },
});
