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
  const commentCount = document.getElementById("commentCount");

  commentForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const commentText = document.getElementById("commentText").value;

      if (username && commentText) {
          const commentData = { username, commentText, date: new Date().toLocaleString() };

          addCommentToDOM(commentData);
          updateCommentCount();

          commentForm.reset();
      }
  });

  function addCommentToDOM(comment) {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      commentDiv.innerHTML = `
          <div class="comment-header">
              <strong>${comment.username}</strong> 
              <span class="date">${comment.date}</span>
              <button class="delete-btn" aria-label="Delete Comment">
                  🗑️
              </button>
          </div>
          <p>${comment.commentText}</p>
      `;
      commentsContainer.prepend(commentDiv); 

      commentDiv.querySelector(".delete-btn").addEventListener("click", function () {
          commentsContainer.removeChild(commentDiv);
          updateCommentCount();
      });
  }
  function updateCommentCount() {
    commentCount.textContent = commentsContainer.children.length;
  }
});
const form = document.getElementById('commentForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('comments').add({
       name: form.username.value,
       comment: form.commentText.value
    });
    form.username.value = '';
    form.commentText.value = '';
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
      let currentLikes = parseInt(count.textContent);

      if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas', 'liked'); 
        count.textContent = currentLikes + 1;
      } else {
        icon.classList.remove('fas', 'liked');
        icon.classList.add('far'); 
        count.textContent = currentLikes - 1;
      }
      updateLikeCount();
    });
});
function updateLikeCount() {
  document.querySelectorAll('.like-btn').forEach(button => {
      let count = button.querySelector('.like-count');
      button.setAttribute('data-likes', count.textContent);
    });
  }