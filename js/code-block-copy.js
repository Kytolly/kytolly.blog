/**
 * code-block-copy.js
 * 负责为代码块添加复制按钮和复制功能。
 */

window.addCopyButton = function(actionsContainer, codeBlock, copyButtonConfig) {
  const container = document.createElement('div');
  container.className = 'copy-btn-container';

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-btn';

  let originalContent;

  if (copyButtonConfig && copyButtonConfig !== 'undefined') {
    const icon = document.createElement('img');
    icon.src = '/' + copyButtonConfig;
    copyButton.appendChild(icon);
    originalContent = icon.outerHTML;
  } else {
    copyButton.innerText = 'copy';
    originalContent = 'copy';
  }

  container.appendChild(copyButton);
  actionsContainer.appendChild(container);

  copyButton.addEventListener('click', () => {
    const codeToCopy = codeBlock.querySelector('.code').innerText;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      copyButton.innerText = 'copied!';
      setTimeout(() => {
        copyButton.innerHTML = originalContent;
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  });
}; 