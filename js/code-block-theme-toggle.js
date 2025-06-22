/**
 * code-block-theme-toggle.js
 * 负责为代码块添加昼夜主题切换按钮和切换逻辑。
 */

window.addThemeToggleButton = function(actionsContainer, codeBlock, themeToggleConfig) {
  if (!themeToggleConfig || !themeToggleConfig.enable) return;

  const lightButton = document.createElement('button');
  lightButton.className = 'theme-toggle-btn light';
  const lightIcon = document.createElement('img');
  lightIcon.src = '/' + themeToggleConfig.to_light_button;
  lightButton.appendChild(lightIcon);

  const darkButton = document.createElement('button');
  darkButton.className = 'theme-toggle-btn dark';
  const darkIcon = document.createElement('img');
  darkIcon.src = '/' + themeToggleConfig.to_dark_button;
  darkButton.appendChild(darkIcon);

  // Initial state: assume light theme is default
  darkButton.style.display = 'inline-block';
  lightButton.style.display = 'none';

  actionsContainer.appendChild(lightButton);
  actionsContainer.appendChild(darkButton);

  darkButton.addEventListener('click', () => {
    const figure = darkButton.closest('figure.highlight');
    if (figure) {
      figure.classList.remove('theme-light');
      figure.classList.add('theme-dark');
    }
    darkButton.style.display = 'none';
    lightButton.style.display = 'inline-block';
  });

  lightButton.addEventListener('click', () => {
    const figure = lightButton.closest('figure.highlight');
    if (figure) {
      figure.classList.remove('theme-dark');
      figure.classList.add('theme-light');
    }
    lightButton.style.display = 'none';
    darkButton.style.display = 'inline-block';
  });
}; 