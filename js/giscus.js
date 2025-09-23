function loadGiscus(theme) {
    const container = document.getElementById('giscus_thread');
    if (!container || !window.THEME_CONFIG.giscus) return;
    container.innerHTML = ''; // 清空原有内容
    const cfg = window.THEME_CONFIG.giscus;
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', cfg.repo);
    script.setAttribute('data-repo-id', cfg.repo_id);
    script.setAttribute('data-category', cfg.category);
    script.setAttribute('data-category-id', cfg.category_id);
    script.setAttribute('data-mapping', cfg.mapping);
    script.setAttribute('data-strict', cfg.strict);
    script.setAttribute('data-reactions-enabled', cfg.reactions_enabled);
    script.setAttribute('data-emit-metadata', cfg.emit_metadata);
    script.setAttribute('data-input-position', cfg.input_position);
    script.setAttribute('data-theme', theme === 'dark' ? 'transparent_dark' : theme);
    script.setAttribute('data-lang', cfg.lang);
    script.setAttribute('data-loading', cfg.loading);
    script.crossOrigin = 'anonymous';
    script.async = true;
    container.appendChild(script);
  }
  
  // 页面初次加载
  const theme = localStorage.getItem('theme') || 'light';
  loadGiscus(theme);
  
  // 主题切换时调用
  window.reloadGiscusTheme = function(newTheme) {
    loadGiscus(newTheme);
  };