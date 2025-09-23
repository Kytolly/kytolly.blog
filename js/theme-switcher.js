document.addEventListener('DOMContentLoaded', () => {
  const themeSwitchItems = document.querySelectorAll('.theme-switch-item');
  const body = document.body;

  // Function to set the theme
  window.setTheme = (theme) => {
    body.classList.remove('light-mode', 'dark-mode');
    body.classList.add(theme + '-mode');
    localStorage.setItem('theme', theme);
    updateActiveSwitch(theme);
    if (window.reloadGiscusTheme) window.reloadGiscusTheme(theme);

    // Update all code blocks to match the global theme
    document.querySelectorAll('figure.highlight').forEach(codeBlock => {
      // Always apply the global theme to the code block
      codeBlock.classList.remove('theme-light', 'theme-dark');
      codeBlock.classList.add('theme-' + theme);

      // Update the visibility of the individual theme toggle buttons
      const lightButton = codeBlock.querySelector('.theme-toggle-btn.light');
      const darkButton = codeBlock.querySelector('.theme-toggle-btn.dark');

      if (lightButton && darkButton) {
        if (theme === 'light') {
          lightButton.style.display = 'none';
          darkButton.style.display = 'inline-block';
        } else if (theme === 'dark') {
          darkButton.style.display = 'none';
          lightButton.style.display = 'inline-block';
        }
      }
    });
  };

  // Function to update the active state of the switch buttons
  const updateActiveSwitch = (activeTheme) => {
    themeSwitchItems.forEach(item => {
      item.classList.remove('active');
      if (item.classList.contains(activeTheme + '-mode')) {
        item.classList.add('active');
      }
    });
  };

  // Function to update Giscus theme
  const updateGiscusTheme = (theme) => {
    const tryPostMessage = () => {
      const giscusFrame = document.querySelector('iframe.giscus-frame');
      if (giscusFrame) {
        const themeMap = {
          light: 'light',
          dark: 'dark',
        };
        giscusFrame.contentWindow.postMessage({
          giscus: { setTheme: themeMap[theme] || 'light' }
        }, 'https://giscus.app');
        return true;
      }
      return false;
    };
    // 如果 iframe 没加载，自动重试
    if (!tryPostMessage()) {
      let retry = 0;
      const timer = setInterval(() => {
        if (tryPostMessage() || ++retry > 20) clearInterval(timer);
      }, 300);
    }
  };

  // Load saved theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
    updateGiscusTheme(savedTheme); // 页面初次加载时同步一次
  } else {
    setTheme('light'); // Default to light theme
    updateGiscusTheme('light');
  }

  // Add event listeners to theme switch items
  themeSwitchItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('light-mode')) {
        setTheme('light');
      } else if (item.classList.contains('dark-mode')) {
        setTheme('dark');
      }
    });
  });
}); 