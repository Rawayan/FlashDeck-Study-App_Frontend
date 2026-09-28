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


cd flashdeck-frontend


Install dependencies:


npm install


Create `.env` from `.env.example`:


VITE_API_URL=http://127.0.0.1:8000/api


Make sure the FlashDeck Django backend is running.

Start the development server:


npm run dev


The frontend will normally be available at:

http://localhost:5173/


## Build

Create a production build:


npm run build


## Backend

The backend is maintained in a separate repository:

"flashdeck-backend"


The frontend communicates with the Django REST API through the configured `VITE_API_URL`.

## Main Pages

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


## Authentication

JWT access and refresh tokens are stored locally by the frontend.

Protected pages require an authenticated user.

## Project Structure

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

