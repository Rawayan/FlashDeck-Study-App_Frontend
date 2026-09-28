# FlashDeck Frontend

FlashDeck is a spaced-repetition study application built with React and Vite.

## Features

* User registration and login
* JWT authentication
* Protected routes
* Dashboard with study statistics
* Deck management
* Card management
* Search and filtering
* Pagination
* Spaced-repetition study screen
* Review with Got it / Missed actions
* Box 1–5 progress display
* Delete confirmation modal
* Responsive design

## Technologies

* React
* Vite
* React Router
* Axios
* CSS

## Setup

Clone the repository and enter the project folder:

```bash id="a9r5f2"
cd flashdeck-frontend
```

Install dependencies:

```bash id="1q8w6e"
npm install
```

Create `.env` from `.env.example`:

```env id="v7c0t4"
VITE_API_URL=http://127.0.0.1:8000/api
```

Make sure the FlashDeck Django backend is running.

Start the development server:

```bash id="j5tq0n"
npm run dev
```

The frontend will normally be available at:

```text id="e4k3q1"
http://localhost:5173/
```

## Build

Create a production build:

```bash id="w1r6hc"
npm run build
```

## Backend

The backend is maintained in a separate repository:

```text id="flashdeck-backend"
```

The frontend communicates with the Django REST API through the configured `VITE_API_URL`.

## Main Pages

```text id="q5d2fz"
/login
/register
/
/decks
/decks/new
/decks/:id
/decks/:id/edit
/decks/:id/cards/new
/cards/:id/edit
/decks/:id/study
```

## Authentication

JWT access and refresh tokens are stored locally by the frontend.

Protected pages require an authenticated user.

## Project Structure

```text id="u3n7ka"
src/
├── api/
│   ├── auth.js
│   ├── cards.js
│   ├── client.js
│   └── decks.js
├── auth/
│   └── AuthContext.jsx
├── components/
├── pages/
├── App.jsx
├── main.jsx
└── index.css
```
