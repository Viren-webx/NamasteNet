

const socket = io("http://localhost:8000");

const form = document.getElementById("Send-container");
const messageInput = document.getElementById("message");
const messageContainer = document.getElementById("msgBox");
const imageInput = document.getElementById("image");

document.getElementById('ADDphoto').addEventListener('click', () => {
    document.getElementById('photoInput').click();
});



document.getElementById('photoInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const profilePhoto = e.target.result;
            document.getElementById('ProfilePhoto').style.backgroundImage = `url(${e.target.result})`;
            document.getElementById('ProfilePhoto').style.backgroundSize = 'cover';
            document.getElementById('ProfilePhoto').style.backgroundPosition = 'center';
            
            localStorage.setItem('profilePhoto', profilePhoto);
            document.getElementById('toggleProfilePhoto').src = profilePhoto; // Set profile photo in toggle button
        };

        reader.readAsDataURL(file);
    }
});

if (!localStorage.getItem('username') || !localStorage.getItem('password')) {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

document.getElementById('logOut').addEventListener('click', () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('profilePhoto');
    window.location.href = 'index.html';
});

if (!localStorage.getItem('username')) {
    window.location.href = 'index.html';
}

if (!localStorage.getItem('username') || !localStorage.getItem('password')) {
    window.location.href = 'index.html';
}

const name = localStorage.getItem('username');
document.getElementById('UserName').innerText = name; // Set the username in the sidebar
socket.emit("new-user-joined", name);


socket.on("user-joined", (name) => {
    appendMessage(`${name} joined the chat`, 'Join');
});

socket.on("receive", (data) => {
    if (data.type === 'text') {
        appendMessage(`${data.name}: ${data.message}`, 'received');
    } else if (data.type === 'image') {
        appendImage(data.name, data.message, 'receivedImg');
    }
});

socket.on("user-left", (name) => {
    appendMessage(`${name} left the chat`, 'leftChat');
});

window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = '';
});

history.pushState(null, null, window.location.href);
window.addEventListener('popstate', function () {
    history.pushState(null, null, window.location.href);
});




// Function to save messages to local storage
function saveMessage(message, type) {
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ message, type });
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Function to load messages from local storage
function loadMessages() {
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(msg => {
        if (msg.type === 'receivedImg' || msg.type === 'sentImg') {
            appendImage('You', msg.message, msg.type);
        } else {
            appendMessage(msg.message, msg.type);
        }
    });
}

// Load messages when the page loads
window.onload = () => {
    loadMessages();
    const profilePhoto = localStorage.getItem('profilePhoto');
    if (profilePhoto) {
        document.getElementById('ProfilePhoto').style.backgroundImage = `url(${profilePhoto})`;
        document.getElementById('ProfilePhoto').style.backgroundSize = 'cover';
        document.getElementById('ProfilePhoto').style.backgroundPosition = 'center';
        document.getElementById('toggleProfilePhoto').src = profilePhoto; // Set profile photo in toggle button
    }
};



form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message) {
        appendMessage(`YOU:-  ${message}`, 'sent');
        socket.emit("sent", { type: 'text', message });
        messageInput.value = "";
    }
    const image = imageInput.files[0];
    if (image) {
        const reader = new FileReader();
        reader.onload = () => {
            appendImage('You', reader.result, 'sentImg');
            socket.emit("sent", { type: 'image', message: reader.result });
        };
        reader.readAsDataURL(image);
        imageInput.value = "";
    }

});





function appendMessage(message, position) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
}

function appendImage(name, imageUrl, position) {
    const messageElement = document.createElement("div");
    messageElement.classList.add('message', position);
    const nameElement = document.createElement("div");
    nameElement.innerText = name;
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.style.maxWidth = "200px";
    messageElement.append(nameElement);
    messageElement.append(imageElement);
    messageContainer.append(messageElement);
}
// Toggle sidebar visibility
document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('SideBar1');
    sidebar.classList.toggle('show');
});

// Close sidebar
document.getElementById('closeSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('SideBar1');
    sidebar.classList.remove('show');
});