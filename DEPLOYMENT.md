# 「知命」部署全流程文档

> 从本地开发到全球上线的完整操作记录

---

## 一、 前置环境

| 工具 | 版本 | 用途 |
|------|------|------|
| Node.js | 18+ | 运行 Next.js |
| Git | 2.52+ | 版本控制 |
| GitHub CLI (`gh`) | 2.x | 命令行操作 GitHub |
| npm | 10+ | 包管理器 |

---

## 二、 本地项目准备

### 1. 配置 `.gitignore`

确保以下文件不会被上传到 GitHub：

```text
node_modules
.next
.env.local
.env*.local
!.env.example
```

### 2. 初始化 Git 仓库并提交

```bash
# 初始化 Git 仓库
git init

# 暂存全部文件
git add .

# 首次提交
git commit -m "Initial commit: 知命玄学 Web App"
```

---

## 三、 推送代码到 GitHub

### 1. 安装 GitHub CLI

```bash
# Windows (管理员终端)
winget install --id GitHub.cli
```

### 2. 登录 GitHub

```bash
gh auth login --hostname github.com --git-protocol https --web
```

执行后会出现：
```
! First copy your one-time code: XXXX-XXXX
Press Enter to open github.com/login/device in your browser...
```

按 Enter 后在浏览器中输入验证码并授权即可。

### 3. 创建远程仓库并推送

```bash
# 一键创建 + 推送（推荐）
gh repo create new-chinese-fate --public --source=. --remote=origin --push \
  --description "知命 - 新中式禅意命理全栈 Web App"
```

如果上述命令推送失败（网络原因），手动分步操作：

```bash
# 配置 gh 作为 Git 凭据助手（关键！解决认证问题）
git config --global credential.helper "!gh auth git-credential"

# 设置远程仓库
git remote add origin https://github.com/你的用户名/new-chinese-fate.git

# 推送
git branch -M main
git push -u origin main
```

### 4. 常见网络问题处理

```bash
# 如果之前配了代理但代理没开，先清除
git config --global --unset http.proxy
git config --global --unset https.proxy

# 如果需要走代理（如 Clash 默认端口 7890）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

---

## 四、 部署到 Vercel

### 方式一：浏览器部署（推荐）

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com/)
   - 选择 **"Continue with GitHub"** 登录

2. **导入项目**
   - 点击 **"Add New..." → "Project"**
   - 在仓库列表中找到 `new-chinese-fate`，点击 **Import**

3. **配置框架与环境变量**
   - **Application Preset** 会自动检测为 `Next.js` ✅
   - 展开 **Environment Variables**，添加以下两个变量：

   | Key | Value |
   |-----|-------|
   | `SILICON_FLOW_API_KEY` | 您的硅基流动 API 密钥 |
   | `DEEPSEEK_API_KEY` | 您的 DeepSeek API 密钥 |

4. **点击 Deploy**
   - 等待约 1-2 分钟构建完成
   - 成功后显示 **"Congratulations!"** 页面
   - 获得永久公网链接：`https://new-chinese-fate.vercel.app`

### 方式二：命令行部署（备选）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 一键部署
vercel --prod
```

---

## 五、 后续维护

### 更新代码后重新部署

```bash
# 修改代码后
git add .
git commit -m "fix: 修复了xxx问题"
git push

# Vercel 会自动检测 GitHub 推送并触发重新部署（零操作！）
```

### 修改环境变量

1. 访问 [Vercel 环境变量设置](https://vercel.com/falses00s-projects/new-chinese-fate/settings/environment-variables)
2. 点击变量旁的 `...` → **Edit** → 修改值 → **Save**
3. 回到 Deployments 页面，点击最新部署的 `...` → **Redeploy**

### 绑定自定义域名

1. 在 Vercel 项目设置中点击 **Domains**
2. 输入您购买的域名（如 `www.zhiming.com`）
3. 按提示在域名注册商处添加 DNS 解析记录

---

## 六、 本次部署结果

| 项目 | 地址 |
|------|------|
| **线上网站** | [https://new-chinese-fate.vercel.app](https://new-chinese-fate.vercel.app) |
| **GitHub 仓库** | [https://github.com/falses00/new-chinese-fate](https://github.com/falses00/new-chinese-fate) |
| **Vercel 管理面板** | [https://vercel.com/falses00s-projects/new-chinese-fate](https://vercel.com/falses00s-projects/new-chinese-fate) |
