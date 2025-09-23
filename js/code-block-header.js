/**
 * code-block-header.js
 * 负责创建代码块的头部元素，包含语言名称和操作容器。
 */

window.createCodeBlockHeader = function(langName) {
  const header = document.createElement('div');
  header.className = 'code-block-header';

  const langSpan = document.createElement('span');
  langSpan.className = 'code-lang-name';
  langSpan.innerText = langName;
  header.appendChild(langSpan);

  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'code-block-actions';
  header.appendChild(actionsContainer);

  return { header, actionsContainer };
}; 