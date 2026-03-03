# 新中式命理全栈 Web App (知命)

本项目是一个基于 Next.js 14 (App Router) 构建的新中式风格玄学算命 Web 应用。项目整合了「生辰八字流年批断」、「AI 掌纹天机灵析」及「周天星座运势衍算」三大核心功能，后端深度互通硅基流动最新的 Qwen 大模型系列。

## 🌟 核心特性

- **极致新中式美学**：使用 `Ma Shan Zheng` 与 `Noto Serif SC` 字体组合，搭配定制水墨禅意色板与 CSS 关键帧动画。
- **全栈隔离架构**：API Keys 严格保留在服务端环境，前端完全解耦大模型通讯逻辑。
- **生辰八字推演**：对接 `Qwen/Qwen2.5-14B-Instruct` 深度分析八字与五行。
- **AI 掌纹识别**：前端 Canvas 压缩图片，后端通过 `Qwen/Qwen-VL-Plus` 视觉大模型返回手相解读。
- **周天星座运势**：支持日/周/月/年流运预测。
- **结果留存分享**：利用 `html2canvas` 实现新中式排版图表的无损一键保存。

## 🛠️ 技术栈

- 框架: React 18 + Next.js 14
- 语言: TypeScript 5
- 样式: Tailwind CSS 3
- 图标: `lucide-react`
- 工具库: Axios, Dayjs, react-cropper, html2canvas

## 🚀 本地开发指南

### 1. 安装依赖

确保运行环境拥有 Node.js 18+，随后在根目录安装依赖：

\`\`\`bash
npm install
\`\`\`

### 2. 配置环境变量

复制环境示例文件并命名为 `.env.local`：

\`\`\`bash
cp .env.example .env.local
\`\`\`

请在 `.env.local` 中填入你的硅基流动 API 密钥（目前已在配置文件中硬编码预留）。

\`\`\`env
SILICON_FLOW_API_KEY=your_key_here
SILICON_FLOW_BASE_URL=https://api.siliconflow.cn/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. 本地启动服务

\`\`\`bash
npm run dev
\`\`\`
服务即会在 \`http://localhost:3000\` 启动。推荐在最新版 Chrome/Edge/Safari 测试，支持完整的响应式自适应布局。

## 📦 生产环境部署 (Vercel)

本项目完全使用 Vercel 的 Serverless Functions 机制编写 API 路由：

1. 将本代码仓库提交至 GitHub。
2. 登录 [Vercel](https://vercel.com)，新建 Project 并导入刚才仓库。
3. 在环境变量（Environment Variables）设置阶段，填入 \`SILICON_FLOW_API_KEY\`。
4. 点击 **Deploy**，片刻后即可在线拥有一个符合生产级安全规范的新中式玄学 Web 站。

## 📌 注意事项

- **前端图片处理**：为了降低大模型服务负载与网络压力，图片上传前使用 Canvas 实现宽高等比例微距缩放和体积压缩（固定在 2MB 以内），保证极速传输。
- **异常重试机制**：受限于大语言模型生成的不可预测性，本项目在 Backend API 请求侧封装了 \`withRetry\` 轮询方法，如遇空回复或 JSON 截断现象，将自动发起至多 3 次的重拨。
