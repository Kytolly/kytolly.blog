# kytolly.blog
Here is Kytolly's blog, recording his notes(main) or other eaasys during his undergraduate and postgraduate program.
> theme: [Shiroi](https://github.com/Kytolly/shiroi), adapted by [hexo-theme-typo](https://github.com/rankangkang/hexo-theme-typo).

## 文章图片

每篇文章的图片放在 `source/assets/<文章 Markdown 文件名>/`，例如：

```text
source/_posts/Transformer.md
source/assets/Transformer/architecture.jpg
```

Markdown 使用站点根路径，保持本地预览和仓库副本可用：

```markdown
![Transformer architecture](/assets/Transformer/architecture.jpg)
```

配置好未提交到 Git 的 `.env` 后，执行 `npm run assets:sync` 将所有已发布文章的独立资源增量同步到腾讯云 COS；使用 `node tools/sync-cos-assets.js --post Transformer` 可只同步一篇文章。同步不会删除 COS 中已有对象。

执行 `deploy.bat` 时会自动运行 `npm run assets:publish`：先把资源上传到 COS，上传全部成功后再直接改写 `source/_posts` 中的 Markdown 图片地址，然后才会生成和部署网站。改写会保留 `source/assets/<文章名>/` 中的本地资源副本。

推送到 `main` 后，GitHub Actions 会先上传资源；只有上传成功，才会把文章中的本地图片地址改写为腾讯云完整链接，并以带有 `[cos-sync]` 标记的提交写回仓库。该标记用于阻止自动提交再次触发相同同步任务。

仓库需要配置 `TENCENT_SECRET_ID` 和 `TENCENT_SECRET_KEY` 两个 Actions Secrets。也可以在 Actions 页面手动运行工作流：默认 `dry_run` 只预览；关闭后才会上传、改写并提交。
