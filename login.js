

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    window.location.href = 'ChatRoom.html';
});

 // Prevent navigating back to the login page
 history.pushState(null, null, window.location.href);
 window.addEventListener('popstate', function () {
     history.pushState(null, null, window.location.href);
 });