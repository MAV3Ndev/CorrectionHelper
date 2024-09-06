import process from 'node:process'
import pkg from './package.json'

const viteElectronBuildConfig = {
    build: {
        minify: process.env.NODE_ENV === 'production',
    },
    resolve: {
        alias: {
            '~': __dirname,
        },
    },
}
export default defineNuxtConfig({
  ssr: false,

  router: {
      options: {
          hashMode: true,
      }
  },

  modules: [
      'nuxt-electron',
      '@nuxtjs/tailwindcss',
      '@primevue/nuxt-module',
      (options, nuxt) => {
          if (!nuxt.options.dev) {
              nuxt.options.nitro.runtimeConfig ??= {}
              nuxt.options.nitro.runtimeConfig.app ??= {}
              nuxt.options.nitro.runtimeConfig.app.baseURL = './'
          }
      }
      ],

  css: ['primeicons/primeicons.css', '~/assets/css/base.css'],

  electron: {
      disableDefaultOptions: true,
      build: [
          {
              // Main-Process entry file of the Electron App.
              entry: 'electron/main.ts',
              vite: viteElectronBuildConfig,
          },
          {
              entry: 'electron/preload.ts',
              onstart(args) {
                  args.reload();
              },
              vite: viteElectronBuildConfig,
          }
      ],
      disableDefaultOptions: true
  },

  primevue: {
      options: {
          unstyled: true
      },
      importPT: {as: 'Aura', from: '~/presets/aura/'}     //import and apply preset
  },

  tailwindcss: {
      config: {
          content: [
              "./presets/**/*.{js,vue,ts}",
              // other paths
          ],
          plugins: [require('tailwindcss-primeui')],
      },
  },

  compatibilityDate: '2024-09-06',
})