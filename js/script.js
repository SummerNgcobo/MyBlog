let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
  searchIcon.classList.remove('fa-times');
  searchForm.classList.remove('active');
}

let searchIcon = document.querySelector('#search-icon');
let searchForm = document.querySelector('.search-form');

searchIcon.onclick = () =>{
  searchIcon.classList.toggle('fa-times');
  searchForm.classList.toggle('active');
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');
}

window.onscroll = () =>{
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');
  searchIcon.classList.remove('fa-times');
  searchForm.classList.remove('active');
}

document.addEventListener("DOMContentLoaded", function () {
  const commentForm = document.getElementById("commentForm");
  const commentsContainer = document.getElementById("commentsContainer");

  // Load stored comments
  fetch('/comments')
    .then(response => response.json())
    .then(data => {
      data.forEach((comment, index) => addCommentToDOM(comment, index));
    });

  commentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get user input
      const username = document.getElementById("username").value;
      const commentText = document.getElementById("commentText").value;

      if (username && commentText) {
          const commentData = { username, commentText, date: new Date().toLocaleString() };

          // Post comment to server
          fetch('/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData),
          })
            .then(response => response.json())
            .then(data => {
              addCommentToDOM(data, data.length - 1);
            });

          // Clear input fields
          commentForm.reset();
      }
  });

  function addCommentToDOM(comment, index) {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      commentDiv.innerHTML = `
          <div class="comment-header">
              <strong>${comment.username}</strong> 
              <span class="date">${comment.date}</span>
              <button class="delete-btn" data-index="${index}" aria-label="Delete Comment">
                  🗑️
              </button>
          </div>
          <p>${comment.commentText}</p>
      `;
      commentsContainer.prepend(commentDiv); // Add new comments on top

      // Add event listener for delete button
      commentDiv.querySelector(".delete-btn").addEventListener("click", function () {
          deleteComment(index);
      });
  }

  function deleteComment(index) {
      // Delete comment from server
      fetch(`/comments/${index}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          // Re-render comments
          commentsContainer.innerHTML = "";
          data.forEach((comment, i) => addCommentToDOM(comment, i));
        });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const posts = document.querySelectorAll(".post");

  categoryButtons.forEach(button => {
      button.addEventListener("click", function () {
          const selectedCategory = this.getAttribute("data-category");

          posts.forEach(post => {
              const postCategory = post.getAttribute("data-category");

              if (selectedCategory === "all" || postCategory === selectedCategory) {
                  post.style.display = "block";
              } else {
                  post.style.display = "none";
              }
          });
      });
  });
});

document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', function() {
      let icon = this.querySelector('i');
      let count = this.querySelector('.like-count');
      let postId = this.closest('.post').getAttribute('data-category');

      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'liked'); // Change to solid heart
        count.textContent = parseInt(count.textContent) + 1;

        // Post like to server
        fetch('/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: postId }),
        });
      } else {
        icon.classList.remove('fas', 'liked');
        icon.classList.add('far'); // Revert to outlined heart
        count.textContent = parseInt(count.textContent) - 1;

        // Delete like from server
        fetch(`/likes/${postId}`, {
          method: 'DELETE',
        });
      }
    });
});

// Get likes
fetch('/likes')
  .then(response => response.json())
  .then(data => {
    // Display likes
    const likesElement = document.getElementById('likes');
    likesElement.textContent = `Likes: ${data.length}`;
  });