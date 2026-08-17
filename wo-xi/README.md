# Clearview News

一个中文实时新闻聚合站。它从 Google News RSS 聚合报道，展示原始来源与发布时间；前端与 CDN 缓存均按 30 分钟刷新。`vercel.json` 同时配置了两条定时任务，用于定期预热热点及绿色金融页面。

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 发布为网址

将目录推送到 GitHub 后导入 Vercel，或在登录 Vercel 的终端运行 `npx vercel --prod`。发布后 Vercel 会提供公开 HTTPS 地址。注意：Vercel Hobby 计划的 Cron 调度频率限制可能不支持每 30 分钟；若需严格执行，请选择支持该频率的计划或接入外部调度器。为保护预热接口，请在部署平台设置随机的 `CRON_SECRET` 环境变量；Vercel Cron 会自动携带它。

## 关于“无偏差”

没有新闻产品能承诺绝对无偏差。本项目采用可审计的做法：不做情绪化改写，保留来源和原文链接，公开排序准则，并让读者回到原文核验。生产环境建议增加不同地区与立场的独立新闻源、去重与来源多样性指标。
