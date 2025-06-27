document.addEventListener('DOMContentLoaded', function() {
  const allPostsDataElement = document.getElementById('all-posts-data');
  const filteredArticlesContainer = document.getElementById('filtered-articles-container');
  let allPosts = [];

  if (allPostsDataElement && allPostsDataElement.dataset.posts) {
    try {
      allPosts = JSON.parse(allPostsDataElement.dataset.posts);
    } catch (e) {
      console.error('Error parsing posts data:', e);
    }
  }

  const tagCards = document.querySelectorAll('.tag-card');

  function renderArticles(articles) {
    if (articles.length === 0) {
      filteredArticlesContainer.innerHTML = '<p>暂无相关文章。</p>';
      return;
    }

    let html = '<ul class="filtered-article-list">';
    articles.forEach(article => {
      html += `
        <li class="filtered-article-list-item">
          <span class="filtered-article-date">${article.date}</span>
          <a href="${article.path}" class="filtered-article-title">${article.title}</a>
        </li>
      `;
    });
    html += '</ul>';
    filteredArticlesContainer.innerHTML = html;
  }

  tagCards.forEach(card => {
    card.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link behavior
      const tagName = this.dataset.tagName;

      const filteredPosts = allPosts.filter(post => {
        return post.tags && post.tags.includes(tagName);
      });

      renderArticles(filteredPosts);
    });
  });

  // Optional: Initial rendering of all articles or a default tag's articles
  // renderArticles(allPosts);
}); 