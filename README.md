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
