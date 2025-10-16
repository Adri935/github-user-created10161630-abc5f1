// JavaScript for GitHub User Creation Date Viewer

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-user-r8s2');
  const usernameInput = document.getElementById('github-username');
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  const createdAtSpan = document.getElementById('github-created-at');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    if (!username) {
      showError('Please enter a GitHub username');
      return;
    }
    
    hideResult();
    hideError();
    
    try {
      const userData = await fetchGitHubUser(username);
      const createdDate = new Date(userData.created_at);
      const formattedDate = createdDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      createdAtSpan.textContent = formattedDate;
      showResult();
    } catch (error) {
      showError(error.message);
    }
  });
  
  async function fetchGitHubUser(username) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      } else if (response.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later or provide a token.');
      } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }
    
    return await response.json();
  }
  
  function showResult() {
    resultDiv.classList.remove('d-none');
  }
  
  function hideResult() {
    resultDiv.classList.add('d-none');
  }
  
  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
  }
  
  function hideError() {
    errorDiv.classList.add('d-none');
  }
});