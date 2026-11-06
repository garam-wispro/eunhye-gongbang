import { defineConfig } from 'vite'
// GitHub Pages 프로젝트 주소(/eunhye-gongbang/)에서 동작하도록 base 지정
export default defineConfig({ base: process.env.GITHUB_ACTIONS ? '/eunhye-gongbang/' : '/' })
