document.addEventListener('DOMContentLoaded', function () {
    // 只在文章页生效
    if (!document.querySelector('.post')) return;
  
    // 只处理 h2-h6
    const headings = document.querySelectorAll('.post h2, .post h3, .post h4, .post h5, .post h6');
    const nums = [0, 0, 0, 0, 0]; // 对应 h2-h6
  
    headings.forEach(heading => {
      const level = parseInt(heading.tagName[1]) - 2; // h2->0, h3->1, ...
      if (level < 0) return; // 跳过 h1
  
      // 当前级别+1，低级别归零
      nums[level]++;
      for (let i = level + 1; i < nums.length; i++) nums[i] = 0;
  
      // 生成编号字符串
      const numbering = nums.slice(0, level + 1).join('.');
  
      // 插入编号
      heading.innerHTML = `<span class="heading-number">${numbering} </span>` + heading.innerHTML;
    });
  });