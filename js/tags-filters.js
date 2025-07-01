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
      const tagName = this.dataset.tagName;

      const filteredPosts = allPosts.filter(post => {
        return post.tags && post.tags.includes(tagName);
      });

      renderArticles(filteredPosts);
    });
  });

  // Optional: Initial rendering of all articles or a default tag's articles
  // renderArticles(allPosts);

  // Function to extract tag from URL
  function getTagFromUrl() {
    const pathParts = window.location.pathname.split('/').filter(part => part !== '');
    // Assuming URL format like /tags/tagName/ or /tag/tagName/
    const tagsIndex = pathParts.indexOf('tags') !== -1 ? pathParts.indexOf('tags') : pathParts.indexOf('tag');
    if (tagsIndex !== -1 && tagsIndex + 1 < pathParts.length) {
      return decodeURIComponent(pathParts[tagsIndex + 1]);
    }
    return null;
  }

  // Initial filtering based on URL tag
  const initialTag = getTagFromUrl();
  if (initialTag) {
    const filteredPosts = allPosts.filter(post => {
      return post.tags && post.tags.includes(initialTag);
    });
    renderArticles(filteredPosts);

    // Highlight the active tag card
    tagCards.forEach(card => {
      if (card.dataset.tagName === initialTag) {
        card.classList.add('tag-card-active');
      } else {
        card.classList.remove('tag-card-active');
      }
    });
  } else {
    // If no tag in URL, render all articles initially or a default view
    // renderArticles(allPosts); // Uncomment this if you want to show all posts initially when no tag is selected
  }
}); 