// docs/.vitepress/config.mjs
import { defineConfig } from "file:///E:/vitepress/node_modules/.pnpm/vitepress@1.0.1_@algolia+client-search@4.22.1_search-insights@2.13.0_typescript@5.4.3/node_modules/vitepress/dist/node/index.js";
import AutoSidebar from "file:///E:/vitepress/node_modules/.pnpm/vite-plugin-vitepress-auto-sidebar@1.6.3_eslint@8.57.0_typescript@5.4.3_vite@5.2.4_vitepress@1.0.1/node_modules/vite-plugin-vitepress-auto-sidebar/dist/index.mjs";
var config_default = defineConfig({
  vite: {
    plugins: [AutoSidebar({
      ignoreList: ["assets"]
    })]
  },
  title: "Morii",
  description: "Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Interview", link: "/Interview/ComputerBasics/Network" },
      { text: "Backend", link: "/Backend/index" }
    ],
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" }
        ]
      }
    ],
    outline: [2, 3],
    outlineTitle: "\u5927\u7EB2",
    search: {
      provider: "local"
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/Moriic" }
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx2aXRlcHJlc3NcXFxcZG9jc1xcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFx2aXRlcHJlc3NcXFxcZG9jc1xcXFwudml0ZXByZXNzXFxcXGNvbmZpZy5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3ZpdGVwcmVzcy9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm1qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVwcmVzcydcbmltcG9ydCBBdXRvU2lkZWJhciBmcm9tICd2aXRlLXBsdWdpbi12aXRlcHJlc3MtYXV0by1zaWRlYmFyJztcblxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgdml0ZToge1xuICAgIHBsdWdpbnM6IFtBdXRvU2lkZWJhcih7XG4gICAgICBpZ25vcmVMaXN0OiBbXCJhc3NldHNcIl1cbiAgICB9KV0sXG4gIH0sXG4gIHRpdGxlOiBcIk1vcmlpXCIsXG4gIGRlc2NyaXB0aW9uOiBcIkJsb2dcIixcbiAgdGhlbWVDb25maWc6IHtcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXG4gICAgbmF2OiBbXG4gICAgICB7IHRleHQ6ICdIb21lJywgbGluazogJy8nIH0sXG4gICAgICB7IHRleHQ6ICdJbnRlcnZpZXcnLCBsaW5rOiAnL0ludGVydmlldy9Db21wdXRlckJhc2ljcy9OZXR3b3JrJyB9LFxuICAgICAgeyB0ZXh0OiAnQmFja2VuZCcsIGxpbms6ICcvQmFja2VuZC9pbmRleCcgfVxuICAgIF0sXG4gICAgc2lkZWJhcjogW1xuICAgICAge1xuICAgICAgICB0ZXh0OiAnRXhhbXBsZXMnLFxuICAgICAgICBpdGVtczogW1xuICAgICAgICAgIHsgdGV4dDogJ01hcmtkb3duIEV4YW1wbGVzJywgbGluazogJy9tYXJrZG93bi1leGFtcGxlcycgfSxcbiAgICAgICAgICB7IHRleHQ6ICdSdW50aW1lIEFQSSBFeGFtcGxlcycsIGxpbms6ICcvYXBpLWV4YW1wbGVzJyB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdLFxuICAgIG91dGxpbmU6IFsyLDNdLFxuICAgIG91dGxpbmVUaXRsZTogJ1x1NTkyN1x1N0VCMicsXG4gICAgc2VhcmNoOiB7XG4gICAgICBwcm92aWRlcjogJ2xvY2FsJ1xuICAgIH0sXG4gICAgc29jaWFsTGlua3M6IFtcbiAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vTW9yaWljJyB9XG4gICAgXVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUSxTQUFTLG9CQUFvQjtBQUNuUyxPQUFPLGlCQUFpQjtBQUd4QixJQUFPLGlCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsSUFDSixTQUFTLENBQUMsWUFBWTtBQUFBLE1BQ3BCLFlBQVksQ0FBQyxRQUFRO0FBQUEsSUFDdkIsQ0FBQyxDQUFDO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLEVBQ1AsYUFBYTtBQUFBLEVBQ2IsYUFBYTtBQUFBO0FBQUEsSUFFWCxLQUFLO0FBQUEsTUFDSCxFQUFFLE1BQU0sUUFBUSxNQUFNLElBQUk7QUFBQSxNQUMxQixFQUFFLE1BQU0sYUFBYSxNQUFNLG9DQUFvQztBQUFBLE1BQy9ELEVBQUUsTUFBTSxXQUFXLE1BQU0saUJBQWlCO0FBQUEsSUFDNUM7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDTCxFQUFFLE1BQU0scUJBQXFCLE1BQU0scUJBQXFCO0FBQUEsVUFDeEQsRUFBRSxNQUFNLHdCQUF3QixNQUFNLGdCQUFnQjtBQUFBLFFBQ3hEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxHQUFFLENBQUM7QUFBQSxJQUNiLGNBQWM7QUFBQSxJQUNkLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxhQUFhO0FBQUEsTUFDWCxFQUFFLE1BQU0sVUFBVSxNQUFNLDRCQUE0QjtBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
