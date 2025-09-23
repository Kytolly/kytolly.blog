/**
 * highlight.js
 * 代码块功能主入口，负责：
 * 1. 语法高亮初始化
 * 2. 代码块头部（语言、复制、主题切换）生成
 * 3. 主题切换逻辑
 */
(function() {
    // 动态加载 MathJax 脚本
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
  
    // 可选：自定义 MathJax 配置
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
      }
    };
  
    document.head.appendChild(script);
  })();