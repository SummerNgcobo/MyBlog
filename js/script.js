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

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAogXmBAn_3TxQNQSx0REVOwx9osQfXdrM',
  authDomain: 'summer-s-blog-368c9.firebaseapp.com',
  projectId: 'summer-s-blog-368c9',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Get references to the form and comments container
const commentForm = document.getElementById('commentForm');
const commentsContainer = document.getElementById('commentsContainer');

// Add event listener to the form
commentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const commentText = document.getElementById('commentText').value;

  if (username && commentText) {
    // Add comment to Firestore
    db.collection('comments').add({
      username,
      commentText,
      date: new Date().toLocaleString(),
      likes: 0,
    })
    .then(() => {
      console.log('Comment added successfully');
      commentForm.reset();
    })
    .catch((error) => {
      console.error('Error adding comment:', error);
    });
  }
});

// Get comments from Firestore and display them
db.collection('comments').orderBy('date', 'desc').onSnapshot((querySnapshot) => {
  commentsContainer.innerHTML = '';
  querySnapshot.forEach((doc) => {
    const commentData = doc.data();
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');

    commentDiv.innerHTML = `
      <div class="comment-header">
        <strong>${commentData.username}</strong> 
        <span class="date">${commentData.date}</span>
        <button class="delete-btn" aria-label="Delete Comment">
          🗑️
        </button>
        <button class="like-btn" aria-label="Like Comment">
          <i class="far fa-thumbs-up"></i>
          <span class="like-count">${commentData.likes}</span>
        </button>
      </div>
      <p>${commentData.commentText}</p>
    `;

    commentsContainer.appendChild(commentDiv);

    // Add event listener to the delete button
    commentDiv.querySelector('.delete-btn').addEventListener('click', () => {
      db.collection('comments').doc(doc.id).delete()
      .then(() => {
        console.log('Comment deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
    });

    // Add event listener to the like button
    commentDiv.querySelector('.like-btn').addEventListener('click', () => {
      const likeCount = commentData.likes + 1;
      db.collection('comments').doc(doc.id).update({
        likes: likeCount,
      })
      .then(() => {
        console.log('Comment liked successfully');
        commentDiv.querySelector('.like-count').textContent = likeCount;
      })
      .catch((error) => {
        console.error('Error liking comment:', error);
      });
    });
  });
});