// Discussion Forum JavaScript

let selectedPostId = null;
let filteredPosts = [...forumPosts];

// Initialize Discussion Forum
function initializeDiscussionForum() {
  renderPosts();
  setupCategoryCards();
  setupFilters();
  setupSearch();
  setupModals();
  setupPostForm();
}

// Render Posts
function renderPosts(postsToRender = filteredPosts) {
  const postsList = document.getElementById("posts-list");

  if (postsToRender.length === 0) {
    postsList.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-comments"></i>
                <h3>No posts found</h3>
                <p>Be the first to start a discussion or adjust your search criteria.</p>
                <button class="btn btn-primary" onclick="openNewPostModal()">
                    <i class="fas fa-plus"></i>
                    Create Post
                </button>
            </div>
        `;
    return;
  }

  postsList.innerHTML = postsToRender
    .map(
      (post) => `
        <div class="post-item" onclick="openPostDetails('${post.id}')">
            <div class="post-votes">
                <button class="vote-btn upvote ${
                  post.userVote === "up" ? "voted" : ""
                }" onclick="event.stopPropagation(); votePost('${
        post.id
      }', 'up')">
                    <i class="fas fa-chevron-up"></i>
                </button>
                <span class="vote-count">${post.upvotes - post.downvotes}</span>
                <button class="vote-btn downvote ${
                  post.userVote === "down" ? "voted" : ""
                }" onclick="event.stopPropagation(); votePost('${
        post.id
      }', 'down')">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="post-content">
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span class="post-category ${
                          post.category
                        }">${formatCategory(post.category)}</span>
                        <span class="post-author">by ${post.author}</span>
                        <span class="post-time">${getTimeAgo(
                          post.timestamp
                        )}</span>
                    </div>
                </div>
                <p class="post-excerpt">${post.content.substring(0, 150)}${
        post.content.length > 150 ? "..." : ""
      }</p>
                <div class="post-stats">
                    <span class="replies-count">
                        <i class="fas fa-reply"></i>
                        ${post.replies.length} replies
                    </span>
                    <span class="views-count">
                        <i class="fas fa-eye"></i>
                        ${post.views || 0} views
                    </span>
                    ${
                      post.tags
                        ? `
                        <div class="post-tags">
                            ${post.tags
                              .map((tag) => `<span class="tag">${tag}</span>`)
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Setup Category Cards
function setupCategoryCards() {
  const categoryCards = document.querySelectorAll(".category-card");

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.getAttribute("data-category");
      filterPostsByCategory(category);
    });
  });
}

// Setup Filters
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      applyFilter(filter);
    });
  });
}

// Setup Search
function setupSearch() {
  const searchInput = document.getElementById("posts-search");
  let searchTimeout;

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      searchPosts(searchTerm);
    }, 300);
  });
}

// Setup Modals
function setupModals() {
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".modal .close");

  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.closest(".modal").style.display = "none";
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  document
    .getElementById("new-post-btn")
    .addEventListener("click", openNewPostModal);
  document.getElementById("cancel-post").addEventListener("click", () => {
    document.getElementById("new-post-modal").style.display = "none";
  });
}

// Setup Post Form
function setupPostForm() {
  const newPostForm = document.getElementById("new-post-form");
  const replyForm = document.getElementById("reply-form");

  newPostForm.addEventListener("submit", handleNewPost);
  replyForm.addEventListener("submit", handleReply);
}

// Filter Posts by Category
function filterPostsByCategory(category) {
  filteredPosts = forumPosts.filter((post) => post.category === category);
  renderPosts(filteredPosts);

  // Update active filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector('.filter-btn[data-filter="all"]')
    .classList.add("active");
}

// Apply Filter
function applyFilter(filter) {
  switch (filter) {
    case "popular":
      filteredPosts = [...forumPosts].sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      );
      break;
    case "recent":
      filteredPosts = [...forumPosts].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      break;
    case "unanswered":
      filteredPosts = forumPosts.filter((post) => post.replies.length === 0);
      break;
    default:
      filteredPosts = [...forumPosts];
  }

  renderPosts(filteredPosts);
}

// Search Posts
function searchPosts(searchTerm) {
  if (!searchTerm) {
    filteredPosts = [...forumPosts];
  } else {
    filteredPosts = forumPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm) ||
        (post.tags &&
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  }

  renderPosts(filteredPosts);
}

// Open New Post Modal
function openNewPostModal() {
  document.getElementById("new-post-modal").style.display = "block";
}

// Open Post Details
function openPostDetails(postId) {
  const post = forumPosts.find((p) => p.id === postId);
  if (!post) return;

  selectedPostId = postId;

  // Increment view count
  if (!post.views) post.views = 0;
  post.views++;
  saveToLocalStorage("forumPosts", forumPosts);

  document.getElementById("post-details-title").textContent = post.title;

  const postDetailsContent = document.getElementById("post-details-content");
  postDetailsContent.innerHTML = `
        <div class="post-details">
            <div class="post-header">
                <div class="post-meta">
                    <span class="post-category ${
                      post.category
                    }">${formatCategory(post.category)}</span>
                    <span class="post-author">by ${post.author}</span>
                    <span class="post-time">${getTimeAgo(post.timestamp)}</span>
                </div>
                <div class="post-votes">
                    <button class="vote-btn upvote ${
                      post.userVote === "up" ? "voted" : ""
                    }" onclick="votePost('${post.id}', 'up')">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <span class="vote-count">${
                      post.upvotes - post.downvotes
                    }</span>
                    <button class="vote-btn downvote ${
                      post.userVote === "down" ? "voted" : ""
                    }" onclick="votePost('${post.id}', 'down')">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
            <div class="post-body">
                <p>${post.content}</p>
                ${
                  post.tags
                    ? `
                    <div class="post-tags">
                        ${post.tags
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        </div>
    `;

  renderReplies(post.replies);
  document.getElementById("post-details-modal").style.display = "block";
}

// Render Replies
function renderReplies(replies) {
  const repliesList = document.getElementById("replies-list");

  if (replies.length === 0) {
    repliesList.innerHTML = `
            <div class="no-replies">
                <p>No replies yet. Be the first to respond!</p>
            </div>
        `;
    return;
  }

  repliesList.innerHTML = replies
    .map(
      (reply) => `
        <div class="reply-item">
            <div class="reply-votes">
                <button class="vote-btn upvote ${
                  reply.userVote === "up" ? "voted" : ""
                }" onclick="voteReply('${reply.id}', 'up')">
                    <i class="fas fa-chevron-up"></i>
                </button>
                <span class="vote-count">${
                  reply.upvotes - reply.downvotes
                }</span>
                <button class="vote-btn downvote ${
                  reply.userVote === "down" ? "voted" : ""
                }" onclick="voteReply('${reply.id}', 'down')">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="reply-content">
                <div class="reply-header">
                    <span class="reply-author">${reply.author}</span>
                    <span class="reply-time">${getTimeAgo(
                      reply.timestamp
                    )}</span>
                </div>
                <p class="reply-text">${reply.content}</p>
            </div>
        </div>
    `
    )
    .join("");
}

// Handle New Post
function handleNewPost(e) {
  e.preventDefault();

  const tags = document
    .getElementById("post-tags")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  const newPost = {
    id: generateId(),
    title: document.getElementById("post-title").value,
    content: document.getElementById("post-content").value,
    category: document.getElementById("post-category").value,
    author: "Current User", // In a real app, this would be the logged-in user
    timestamp: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    replies: [],
    views: 0,
    tags: tags.length > 0 ? tags : null,
  };

  forumPosts.push(newPost);
  saveToLocalStorage("forumPosts", forumPosts);

  filteredPosts = [...forumPosts];
  renderPosts();

  document.getElementById("new-post-modal").style.display = "none";
  document.getElementById("new-post-form").reset();

  showNotification("Post created successfully!", "success");
}

// Handle Reply
function handleReply(e) {
  e.preventDefault();

  const post = forumPosts.find((p) => p.id === selectedPostId);
  if (!post) return;

  const newReply = {
    id: generateId(),
    content: document.getElementById("reply-content").value,
    author: "Current User", // In a real app, this would be the logged-in user
    timestamp: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
  };

  post.replies.push(newReply);
  saveToLocalStorage("forumPosts", forumPosts);

  renderReplies(post.replies);
  document.getElementById("reply-form").reset();

  showNotification("Reply posted successfully!", "success");
}

// Vote Post
function votePost(postId, voteType) {
  const post = forumPosts.find((p) => p.id === postId);
  if (!post) return;

  // Remove previous vote if exists
  if (post.userVote === "up") post.upvotes--;
  if (post.userVote === "down") post.downvotes--;

  // Apply new vote
  if (post.userVote === voteType) {
    // Remove vote if clicking same button
    post.userVote = null;
  } else {
    post.userVote = voteType;
    if (voteType === "up") post.upvotes++;
    if (voteType === "down") post.downvotes++;
  }

  saveToLocalStorage("forumPosts", forumPosts);
  renderPosts();

  // Update post details if open
  if (selectedPostId === postId) {
    openPostDetails(postId);
  }
}

// Vote Reply
function voteReply(replyId, voteType) {
  const post = forumPosts.find((p) => p.id === selectedPostId);
  if (!post) return;

  const reply = post.replies.find((r) => r.id === replyId);
  if (!reply) return;

  // Remove previous vote if exists
  if (reply.userVote === "up") reply.upvotes--;
  if (reply.userVote === "down") reply.downvotes--;

  // Apply new vote
  if (reply.userVote === voteType) {
    // Remove vote if clicking same button
    reply.userVote = null;
  } else {
    reply.userVote = voteType;
    if (voteType === "up") reply.upvotes++;
    if (voteType === "down") reply.downvotes++;
  }

  saveToLocalStorage("forumPosts", forumPosts);
  renderReplies(post.replies);
}

// Utility Functions
function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return time.toLocaleDateString();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeDiscussionForum();
});

// Add forum-specific styles
const forumStyles = document.createElement("style");
forumStyles.textContent = `
    .forum-categories {
        padding: var(--spacing-8) 0;
        background-color: var(--gray-100);
    }
    
    .categories-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-8);
    }
    
    .categories-header h2 {
        margin: 0;
        color: var(--dark-color);
    }
    
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-6);
    }
    
    .category-card {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
    }
    
    .category-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg);
    }
    
    .category-icon {
        width: 60px;
        height: 60px;
        border-radius: var(--border-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white-color);
        font-size: var(--font-size-xl);
        flex-shrink: 0;
    }
    
    .category-icon.transport { background-color: #2196F3; }
    .category-icon.housing { background-color: #4CAF50; }
    .category-icon.energy { background-color: #FF9800; }
    .category-icon.water { background-color: #00BCD4; }
    
    .category-info h3 {
        margin: 0 0 var(--spacing-2) 0;
        color: var(--dark-color);
    }
    
    .category-info p {
        margin: 0 0 var(--spacing-3) 0;
        color: var(--gray-600);
        font-size: var(--font-size-sm);
        line-height: 1.4;
    }
    
    .category-stats {
        display: flex;
        gap: var(--spacing-4);
        font-size: var(--font-size-xs);
        color: var(--gray-500);
    }
    
    .post-count {
        font-weight: 600;
    }
    
    .forum-posts {
        padding: var(--spacing-12) 0;
    }
    
    .posts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-8);
        gap: var(--spacing-4);
    }
    
    .posts-filters {
        display: flex;
        gap: var(--spacing-2);
    }
    
    .filter-btn {
        background-color: var(--gray-100);
        border: none;
        padding: var(--spacing-2) var(--spacing-4);
        border-radius: var(--border-radius);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--gray-700);
    }
    
    .filter-btn.active,
    .filter-btn:hover {
        background-color: var(--primary-color);
        color: var(--white-color);
    }
    
    .posts-search {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .posts-search input {
        padding: var(--spacing-3) var(--spacing-10) var(--spacing-3) var(--spacing-4);
        border: 1px solid var(--gray-300);
        border-radius: var(--border-radius);
        min-width: 300px;
    }
    
    .posts-search i {
        position: absolute;
        right: var(--spacing-4);
        color: var(--gray-500);
    }
    
    .posts-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
    }
    
    .post-item {
        background-color: var(--white-color);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-6);
        box-shadow: var(--shadow);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        gap: var(--spacing-4);
    }
    
    .post-item:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
    }
    
    .post-votes {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-1);
        flex-shrink: 0;
    }
    
    .vote-btn {
        background: none;
        border: 1px solid var(--gray-300);
        width: 32px;
        height: 32px;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gray-600);
    }
    
    .vote-btn:hover {
        background-color: var(--gray-100);
    }
    
    .vote-btn.voted.upvote {
        background-color: var(--success-color);
        color: var(--white-color);
        border-color: var(--success-color);
    }
    
    .vote-btn.voted.downvote {
        background-color: var(--error-color);
        color: var(--white-color);
        border-color: var(--error-color);
    }
    
    .vote-count {
        font-weight: 700;
        color: var(--dark-color);
        font-size: var(--font-size-sm);
    }
    
    .post-content {
        flex: 1;
    }
    
    .post-header {
        margin-bottom: var(--spacing-3);
    }
    
    .post-title {
        margin: 0 0 var(--spacing-2) 0;
        color: var(--dark-color);
        font-size: var(--font-size-lg);
        line-height: 1.3;
    }
    
    .post-meta {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .post-category {
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
        font-weight: 600;
        font-size: var(--font-size-xs);
        text-transform: uppercase;
        color: var(--white-color);
    }
    
    .post-category.transport { background-color: #2196F3; }
    .post-category.housing { background-color: #4CAF50; }
    .post-category.energy { background-color: #FF9800; }
    .post-category.water { background-color: #00BCD4; }
    
    .post-excerpt {
        color: var(--gray-700);
        line-height: 1.6;
        margin-bottom: var(--spacing-4);
    }
    
    .post-stats {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        font-size: var(--font-size-sm);
        color: var(--gray-600);
    }
    
    .post-stats i {
        margin-right: var(--spacing-1);
    }
    
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-2);
    }
    
    .tag {
        background-color: var(--gray-100);
        color: var(--gray-700);
        padding: var(--spacing-1) var(--spacing-2);
        border-radius: var(--border-radius);
        font-size: var(--font-size-xs);
        font-weight: 500;
    }
    
    .no-posts {
        text-align: center;
        padding: var(--spacing-16);
        color: var(--gray-600);
    }
    
    .no-posts i {
        font-size: 4rem;
        color: var(--gray-400);
        margin-bottom: var(--spacing-4);
    }
    
    .no-posts h3 {
        font-size: var(--font-size-2xl);
        margin-bottom: var(--spacing-3);
        color: var(--gray-700);
    }
    
    .modal-content.large {
        max-width: 800px;
    }
    
    .post-details {
        margin-bottom: var(--spacing-8);
        padding-bottom: var(--spacing-6);
        border-bottom: 1px solid var(--gray-200);
    }
    
    .post-details .post-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-4);
    }
    
    .post-body p {
        line-height: 1.7;
        color: var(--gray-800);
        margin-bottom: var(--spacing-4);
    }
    
    .replies-section h3 {
        margin-bottom: var(--spacing-6);
        color: var(--dark-color);
    }
    
    .reply-item {
        background-color: var(--gray-50);
        border-radius: var(--border-radius);
        padding: var(--spacing-4);
        margin-bottom: var(--spacing-4);
        display: flex;
        gap: var(--spacing-3);
    }
    
    .reply-votes {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-1);
        flex-shrink: 0;
    }
    
    .reply-votes .vote-btn {
        width: 24px;
        height: 24px;
    }
    
    .reply-content {
        flex: 1;
    }
    
    .reply-header {
        display: flex;
        gap: var(--spacing-3);
        margin-bottom: var(--spacing-2);
        font-size: var(--font-size-sm);
    }
    
    .reply-author {
        font-weight: 600;
        color: var(--dark-color);
    }
    
    .reply-time {
        color: var(--gray-600);
    }
    
    .reply-text {
        color: var(--gray-800);
        line-height: 1.6;
        margin: 0;
    }
    
    .no-replies {
        text-align: center;
        padding: var(--spacing-8);
        color: var(--gray-600);
    }
    
    .reply-form {
        margin-top: var(--spacing-8);
        padding-top: var(--spacing-6);
        border-top: 1px solid var(--gray-200);
    }
    
    .reply-form h4 {
        margin-bottom: var(--spacing-4);
        color: var(--dark-color);
    }
    
    @media (max-width: 768px) {
        .posts-header {
            flex-direction: column;
            align-items: stretch;
        }
        
        .posts-filters {
            flex-wrap: wrap;
        }
        
        .posts-search input {
            min-width: auto;
            width: 100%;
        }
        
        .post-item {
            flex-direction: column;
        }
        
        .post-votes {
            flex-direction: row;
            justify-content: center;
        }
        
        .post-details .post-header {
            flex-direction: column;
            gap: var(--spacing-4);
        }
        
        .categories-grid {
            grid-template-columns: 1fr;
        }
        
        .category-card {
            flex-direction: column;
            text-align: center;
        }
    }
`;

document.head.appendChild(forumStyles);
