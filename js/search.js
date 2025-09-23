document.addEventListener('DOMContentLoaded', () => {
  const searchTrigger = document.querySelector('.header-search-container.search-trigger');
  const searchPopOverlay = document.querySelector('.search-pop-overlay');
  const popupSearchInput = document.querySelector('.popup.search-popup .search-input');
  const popupBtnClose = document.querySelector('.popup-btn-close');
  const searchResultContainer = document.querySelector('.search-result-container');

  // console.log('searchTrigger:', searchTrigger); // Debug log
  // console.log('searchPopOverlay:', searchPopOverlay); // Debug log

  if (!searchTrigger || !searchPopOverlay || !searchResultContainer) return;

  let searchData = [];
  let isSearchDataLoaded = false;

  // Simplified i18n for hits, as global CONFIG might not be present
  const i18n_hits_template = '找到 ${hits} 条结果';

  // Function to load search data
  function loadSearchData() {
    if (isSearchDataLoaded) return;

    // Display spinner while loading
    searchResultContainer.innerHTML = '<div class="search-result-icon"><i class="fa fa-spinner fa-pulse fa-5x"></i></div>';

    fetch('/search.xml')
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        const entries = data.querySelectorAll('entry');
        searchData = Array.from(entries).map((entry, index) => ({
          title: entry.querySelector('title').textContent,
          content: entry.querySelector('content').textContent,
          url: entry.querySelector('url').textContent,
          id: index // Add a unique ID for sorting
        }));
        isSearchDataLoaded = true;
        // If popup is already active and input has query, perform search immediately
        if (searchPopOverlay.classList.contains('active') && popupSearchInput.value.length > 0) {
          performSearch(popupSearchInput.value);
        } else if (popupSearchInput.value.length === 0) {
            // If data loaded and input is empty, show initial search icon
            searchResultContainer.innerHTML = '<div class="search-result-icon"><i class="fa fa-search fa-5x"></i></div>';
        }
      })
      .catch(error => {
        console.error('Error fetching search.xml:', error);
        searchResultContainer.innerHTML = '<div class="search-result-icon"><p>加载搜索数据失败。</p></div>'; // Show error message
      });
  }

  // Function to open search popup
  function openSearchPopup() {
    // console.log('openSearchPopup called'); // Debug log
    searchPopOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    document.body.classList.add('search-active'); // Add class to body
    popupSearchInput.focus();
    loadSearchData(); // Load data when popup opens
  }

  // Function to close search popup
  function closeSearchPopup() {
    searchPopOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
    document.body.classList.remove('search-active'); // Remove class from body
    searchResultContainer.innerHTML = ''; // Clear results
    popupSearchInput.value = ''; // Clear input
  }

  // Function to perform search and display results
  function performSearch(query) {
    const keywords = query.split(/[-\s]+/); // Moved here to ensure it's always defined

    if (query.length === 0) {
      searchResultContainer.innerHTML = '<div class="search-result-icon"><i class="fa fa-search fa-5x"></i></div>';
      return;
    }

    if (!isSearchDataLoaded) {
      searchResultContainer.innerHTML = '<div class="search-result-icon"><i class="fa fa-spinner fa-pulse fa-5x"></i></div>';
      return; // Data not loaded yet, show spinner
    }

    const filteredResults = searchData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
      const contentMatch = item.content.toLowerCase().includes(query.toLowerCase());
      return titleMatch || contentMatch;
    });

    // Calculate includedCount and hitCount for sorting
    filteredResults.forEach(item => {
      let includedCount = 0;
      let hitCount = 0;
      const lowerCaseTitle = item.title.toLowerCase();
      const lowerCaseContent = item.content.toLowerCase();

      keywords.forEach(keyword => {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&'), 'gi');
        let titleHits = (lowerCaseTitle.match(regex) || []).length;
        let contentHits = (lowerCaseContent.match(regex) || []).length;

        if (titleHits > 0 || contentHits > 0) {
          includedCount++;
        }
        hitCount += titleHits + contentHits;
      });
      item.includedCount = includedCount;
      item.hitCount = hitCount;
    });

    // Sort results as in local-search.js
    filteredResults.sort((left, right) => {
      if (left.includedCount !== right.includedCount) {
        return right.includedCount - left.includedCount;
      } else if (left.hitCount !== right.hitCount) {
        return right.hitCount - left.hitCount;
      }
      return right.id - left.id;
    });

    // Function to highlight keywords in text
    function highlightKeywords(text, keywords) {
        let highlightedText = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            highlightedText = highlightedText.replace(regex, '<mark class="search-keyword">$&</mark>');
        });
        return highlightedText;
    }

    if (filteredResults.length > 0) {
      const stats = i18n_hits_template.replace('${hits}', filteredResults.length);

      const resultsHtml = filteredResults.map(item => {
        const highlightedTitle = highlightKeywords(item.title, keywords);
        let previewContent = item.content;

        // Find first occurrence of a keyword and get a snippet around it
        let snippet = '';
        const firstKeywordIndex = keywords.reduce((minIdx, keyword) => {
            const idx = item.content.toLowerCase().indexOf(keyword.toLowerCase());
            return (idx !== -1 && (minIdx === -1 || idx < minIdx)) ? idx : minIdx;
        }, -1);

        if (firstKeywordIndex !== -1) {
            const start = Math.max(0, firstKeywordIndex - 50); // 50 chars before
            const end = Math.min(item.content.length, firstKeywordIndex + query.length + 100); // 100 chars after
            snippet = item.content.substring(start, end);
            if (start > 0) snippet = '...' + snippet;
            if (end < item.content.length) snippet = snippet + '...';
        } else {
            snippet = item.content.substring(0, 150) + '...'; // Fallback to first 150 chars
        }
        const highlightedSnippet = highlightKeywords(snippet, keywords);

        return `<li><a href="${item.url}" class="search-result-item"><h3>${highlightedTitle}</h3><p>${highlightedSnippet}</p></a></li>`;
      }).join('');

      searchResultContainer.innerHTML = `<div class="search-stats">${stats}</div>
        <hr>
        <ul class="search-result-list">${resultsHtml}</ul>`;
    } else {
      searchResultContainer.innerHTML = '<div class="search-result-icon"><i class="far fa-frown fa-5x"></i></div>';
    }
  }

  // Event Listeners
  searchTrigger.addEventListener('click', openSearchPopup);
  popupBtnClose.addEventListener('click', closeSearchPopup);

  popupSearchInput.addEventListener('input', function() {
    performSearch(this.value);
  });

  // Close search popup when clicking outside the popup content
  searchPopOverlay.addEventListener('click', (event) => {
    if (event.target === searchPopOverlay) {
      closeSearchPopup();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') { // Ctrl+K or Cmd+K
      event.preventDefault();
      openSearchPopup();
    }
    if (event.key === 'Escape' && searchPopOverlay.classList.contains('active')) {
      closeSearchPopup();
    }
  });
}); 