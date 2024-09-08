import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [AutoSidebar({
      ignoreList: ["assets", "temp"],
      collapsed: true,
    })],
  },
  title: "Morii",
  description: "Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Interview', link: '/Interview/ComputerBasics/Network' },
      { text: 'Backend', link: '/Backend/index' },
      { text: 'Linux', link: '/Linux/Linux' },
      { text: 'Deploy', link: '/Deploy/CICD'}
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    outline: [2,3],
    outlineTitle: '大纲',
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Moriic' }
    ]
  }
})
