// Initialize Firebase Realtime Database API endpoint
const databaseUrl = 'https://ilostmyiphone-b9e61-default-rtdb.firebaseio.com/guestbook.json';

const tailwindCSS = `

ul, ol {
  list-style-type: none;
}

a {
  text-decoration: none;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}
.container {
  list-style: none;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ccddff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.submit-button:hover {
  background-color: #2563eb;
}
.message {
  list-style: none;
  color: #333;
  font-weight: bold;
}
.username {
  list-style: none;
  color: #6b7280;
}
.date {
  color: #6b7280;
}
.time {
  color: #6b7280;
}
.form-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 400px;
  padding: 20px;
  background-color: #f7eecb;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999; /* Ensure the form stays on top */
}
.form-input {
  border: 1px solid #d1d5db;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  width: calc(100% - 20px);
  margin-bottom: 16px;
  box-sizing: border-box;
}
.form-submit {
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  border-radius: 4px;
  width: calc(100% - 20px);
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
}
.form-submit:hover {
  background-color: #2563eb;
}
`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST') {
    // Handle form submission
    const formData = await request.formData();
    const message = formData.get('message');
    const username = formData.get('username') || 'Anonymous';
    await submitEntry(message, username);
    return new Response('Entry submitted successfully!', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Retrieve guestbook data from Firebase
  const guestbookData = await fetchGuestbookData();

  // Construct the response HTML
  const responseHTML = generateHTML(guestbookData);

  // Return the response
  return new Response(responseHTML, {
    headers: { 'Content-Type': 'text/html' },
  });
}

async function fetchGuestbookData() {
 
  const response = await fetch(databaseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch guestbook data');
  }
  return await response.json();
}

async function submitEntry(message, username) {
  // Submit new entry to Firebase Realtime Database
  const response = await fetch(databaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      username: username,
      date: new Date().toISOString().slice(0, 10),
      time: getCurrentTime(),
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit entry');
  }
}
function generateHTML(guestbookData) {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <script async defer src="https://buttons.github.io/buttons.js"></script>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Guestbook</title>
      <style>
      ${tailwindCSS}

      ul, ol {
        list-style-type: none;
      }

      a {
        text-decoration: none;
      }

      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      .container {
        list-style: none;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ccddff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .submit-button:hover {
        background-color: #2563eb;
      }
      .message {
        color: #333;
        font-weight: bold;
      }
      .username {
        color: #6b7280;
      }
      .date {
        color: #6b7280;
      }
      .time {
        color: #6b7280;
      }
      .form-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        max-width: 400px;
        padding: 20px;
        background-color: #f7eecb;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 999; /* Ensure the form stays on top */
      }
      .form-input {
        border: 1px solid #d1d5db;
        padding: 10px;
        font-size: 16px;
        border-radius: 4px;
        width: calc(100% - 20px);
        margin-bottom: 16px;
        box-sizing: border-box;
      }
      .form-submit {
        background-color: #f7eecb;
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        padding: 10px;
        border-radius: 4px;
        width: calc(100% - 20px);
        cursor: pointer;
        transition: background-color 0.3s ease;
        box-sizing: border-box;
      }
      .form-submit:hover {
        background-color: #2563eb;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="guestbook-list">
          <ul class="space-y-6">`;

  for (const key in guestbookData) {
    const guestbookEntry = guestbookData[key];
    const messageColor = getRandomColor();
    const usernameColor = getRandomColor();

    html += `
    <li class="border border-gray-300 p-4 rounded-lg">
      <p>${guestbookEntry.message}</p>
      <p class="text-green-800">${guestbookEntry.username}</p>
      <p class="text-gray-600">${guestbookEntry.date} ${guestbookEntry.time}</p>
    </li>`;
  
  }

  html += `
          </ul>
        </div>
        <form method="post" class="mt-2 mb-4 form-container" onsubmit="submitForm(event)">
        <h2>
        <a class="github-button" href="https://github.com/sudo-self/realtime-worker" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-icon="octicon-star" data-size="large" aria-label="Star sudo-self/realtime-worker on GitHub">Star</a>&nbsp;Realtime Messenger</h2>
        <h4>
        <img src="https://api.iconify.design/simple-icons:cloudflareworkers.svg?color=%23000000" alt="Cloudflare Workers Icon">
        <a href="https://fire.jessejesse.workers.dev">powered by cloudflare workers</a>
      </h4>
          <input type="text" id="message" name="message" required placeholder="Message" class="form-input w-full mb-2">
          <input type="text" id="username" name="username" placeholder="Username (optional)" class="form-input w-full mb-2">
          <button type="submit" class="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full">Submit</button>
        </form>
      </div>
      <script>
        function submitForm(event) {
          event.preventDefault();
          fetch(event.target.action, {
            method: 'POST',
            body: new FormData(event.target),
          })
          .then(response => {
            if (response.ok) {
              window.location.reload();
            } else {
              console.error('Failed to submit form');
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      </script>
    </body>
    </html>`;

  return html;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * 6); 
    color += letters[randomIndex];
  }
  return color;
}

function getCurrentTime() {
  const date = new Date();
  const hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  return hours + ":" + minutes;
}
