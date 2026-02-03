# Movie Recommender 

A modern, responsive movie recommendation web application built with **React** and **Vite**. This application allows users to select a movie they like and instantly receive a curated list of similar movies, complete with posters fetched dynamically from the TMDB API.

## 🚀 Features

-   **Searchable Movie Dropdown**: Easily find and select your favorite movies using a robust search interface.
-   **Instant Recommendations**: Get immediate movie suggestions based on your selection.
-   **Dynamic Poster Loading**: Automatically fetches and displays high-quality movie posters from The Movie Database (TMDB).
-   **Responsive Design**: A sleek, dark-themed UI that looks great on desktop and mobile devices.
-   **Fast Performance**: Powered by Vite for lightning-fast development and optimized production builds.

## 🛠️ Tech Stack

-   **Frontend Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: Vanilla CSS (Custom dark theme)
-   **Components**: [React-Select](https://react-select.com/) for the dropdown menu.
-   **Data/API**: 
    -   Local Dataset (`movies_data.json`) for recommendation logic.
    -   [TMDB API](https://www.themoviedb.org/documentation/api) for fetching movie posters.

## 📦 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher) or [Bun](https://bun.sh/)
-   npm, yarn, or bun package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AtulPahal/movie_recomender.git
    cd movie_recomender
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Bun:
    ```bash
    bun install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    bun run dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:5173` to view the app.

## 📂 Project Structure

```
movie_recomender/
├── public/              # Static assets
├── src/
│   ├── assets/          # Project assets (images, etc.)
│   ├── App.jsx          # Main application component & logic
│   ├── index.css        # Global styles
│   ├── main.jsx         # Entry point
│   └── movies_data.json # Data file containing movie list & similarity data
├── index.html           # HTML entry point
├── package.json         # Project metadata and dependencies
└── vite.config.js       # Vite configuration
```

## 🔧 building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate the optimized files in the `dist` directory.

