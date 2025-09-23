// 动态设置背景图片脚本
var bgConf = window.THEME_CONFIG.background;
if (bgConf && bgConf.enable === 'true') {
  var url = '';
  if (bgConf.image && bgConf.image.mode === 'pointed') {
    url = '/' + (bgConf.folder ? bgConf.folder.replace(/\/$/, '') + '/' : '') + (bgConf.image.name || 'background.jpg');
  } else if (bgConf.image && bgConf.image.mode === 'random') {
    var count = parseInt(bgConf.image.count, 10) || 1;
    if (count > 0) {
      var idx = Math.floor(Math.random() * count) + 1;
      url = '/' + (bgConf.folder ? bgConf.folder.replace(/\/$/, '') + '/' : '') + idx + '.png';
    }
  }
  if (url) {
    var style = document.createElement('style');
    style.innerHTML = `
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background-image: url('${url}');
  background-position: ${bgConf.position || 'center'};
  background-size: ${bgConf.size || 'cover'};
  background-repeat: ${bgConf.repeat || 'no-repeat'};
  opacity: ${bgConf.opacity || '0.5'};
  pointer-events: none;
  transition: opacity 0.3s;
}
`;
    document.head.appendChild(style);
  }
}

// Header 滚动透明效果
(function() {
  console.log('background.js: Header scroll effect script loaded.');
  var header = document.querySelector('.header');
  if (!header) {
    console.log('background.js: Header element not found.');
    return;
  }
  console.log('background.js: Header element found.', header);

  var applyHeaderScrollClass = function() {
    var isDarkMode = document.body.classList.contains('dark-mode');
    console.log('background.js: Scroll event or class change. isDarkMode:', isDarkMode, 'scrollY:', window.scrollY);
    if (isDarkMode) {
      if (window.scrollY > 0) {
        if (!header.classList.contains('header-scrolled')) {
          header.classList.add('header-scrolled');
          console.log('background.js: Added header-scrolled class.');
        }
      } else {
        if (header.classList.contains('header-scrolled')) {
          header.classList.remove('header-scrolled');
          console.log('background.js: Removed header-scrolled class.');
        }
      }
    } else {
      // 在亮色模式下，移除该类，Header 保持其默认（透明）或由其他 CSS 控制的背景
      if (header.classList.contains('header-scrolled')) {
        header.classList.remove('header-scrolled');
        console.log('background.js: Removed header-scrolled class (light mode).');
      }
    }
  };

  // 页面加载时执行一次
  applyHeaderScrollClass();

  // 监听滚动事件
  window.addEventListener('scroll', applyHeaderScrollClass);
  console.log('background.js: Scroll event listener added.');

  // 监听主题模式切换（通过body的class变化）
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        console.log('background.js: Body class changed. Re-applying header transparency.');
        applyHeaderScrollClass();
      }
    });
  });
  observer.observe(document.body, { attributes: true });
  console.log('background.js: MutationObserver added for body class changes.');
})();
