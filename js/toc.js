document.addEventListener('DOMContentLoaded', function() {
    const tocContainer = document.getElementById('toc-container');
    const tocTitle = document.getElementById('toc-title');
  
    if (tocTitle && tocContainer) {
      tocTitle.addEventListener('click', function() {
        tocContainer.classList.toggle('toc-collapsed');
      });
    }
  });