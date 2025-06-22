/**
 * image-handler.js
 * 自动居中图片，并为图片添加带编号的图注（如 "图1 xxx"）
 * 配置通过 <body data-image-center="true" data-image-caption="true"> 注入
 */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const center = body.dataset.imageCenter === 'true';
  const caption = body.dataset.imageCaption === 'true';

  if (!center && !caption) return;

  let imageCounter = 0;
  const content = document.querySelector('.post-content');
  if (!content) return;

  const images = content.querySelectorAll('img');

  images.forEach(img => {
    const parent = img.parentNode;

    // 只处理被单独包裹在 <p> 标签里的图片
    if (parent.tagName === 'P' && parent.children.length === 1) {
      if (caption && img.alt) {
        imageCounter++;
        const figure = document.createElement('figure');
        figure.classList.add('image-figure');

        const figcaption = document.createElement('figcaption');
        figcaption.innerText = `图 ${imageCounter} ${img.alt}`;

        // 移动图片到新 figure
        figure.appendChild(img);
        figure.appendChild(figcaption);

        // 替换原 <p> 标签
        parent.parentNode.replaceChild(figure, parent);

      } else if (center) {
        // 没有图注时，仅居中
        parent.style.textAlign = 'center';
      }
    }
  });
});