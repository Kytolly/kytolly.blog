/**
 * code-block.js
 * 代码块增强功能的主入口和协调器。
 * 负责初始化 highlight.js，并集成头部、复制和主题切换功能。
 */

// 确保 highlight.js 库已初始化
// 如果 highlight.js 是通过 CDN 或其他方式全局加载的，这一行通常在DOMContentLoaded之前执行。
// 但为了确保，这里保留一下。
if (typeof hljs !== 'undefined') {
  hljs.highlightAll();
}

document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('figure.highlight');
  const bodyDataset = document.body.dataset;

  // 从 body 的 data-属性中获取配置
  const copyButtonConfig = bodyDataset.codeBlockCopyButton;
  const themeToggleEnable = bodyDataset.codeBlockThemeToggleEnable === 'true';
  const themeToggleConfig = {
    enable: themeToggleEnable,
    to_light_button: bodyDataset.codeBlockThemeToggleToLightButton,
    to_dark_button: bodyDataset.codeBlockThemeToggleToDarkButton,
  };

  codeBlocks.forEach(codeBlock => {
    // 防止重复创建头部
    if (codeBlock.querySelector('.code-block-header')) return;

    // 添加 .hljs 类以防止三线表样式冲突
    const table = codeBlock.querySelector('table');
    if (table) {
      table.classList.add('hljs');
    }

    // 获取语言名称
    const lang = Array.from(codeBlock.classList).find(cls => cls !== 'highlight') || 'code';

    // 创建代码块头部
    const { header, actionsContainer } = createCodeBlockHeader(lang);
    codeBlock.prepend(header);

    // 添加复制按钮
    if (copyButtonConfig) { // 检查配置是否存在
      addCopyButton(actionsContainer, codeBlock, copyButtonConfig);
    }

    // 添加主题切换按钮
    if (themeToggleConfig.enable) { // 检查配置和启用状态
      addThemeToggleButton(actionsContainer, codeBlock, themeToggleConfig);
      // 默认设置为浅色主题，与CSS变量的默认值保持一致
      codeBlock.classList.add('theme-light');
    }
  });
}); 