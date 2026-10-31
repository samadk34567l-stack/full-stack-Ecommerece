# Berry Dashboard

A modern admin dashboard built with **React**, **Vite**, and **Material UI (MUI)**, inspired by the Berry admin template. It includes charts, routing, and notification support out of the box.

## Tech Stack

- **React 18**
- **Vite 5**
- **Material UI (MUI) 5** — components & icons
- **React Router DOM 6** — routing
- **Recharts** — data visualization/charts
- **Notistack** — snackbar notifications
- **Emotion** — styling

## Project Structure

```
admin-dashboard-main/
├── src/
│   ├── components/   # Reusable UI components
│   ├── data/         # Static/mock data
│   ├── layout/        # Layout components (sidebar, header, etc.)
│   ├── pages/         # Page-level components/routes
│   ├── App.jsx        # Root app component
│   ├── main.jsx       # Application entry point
│   └── theme.js        # MUI theme configuration
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Scripts

| Command           | Description                          |
|-------------------|---------------------------------------|
| `npm run dev`     | Start development server              |
| `npm run build`   | Build app for production              |
| `npm run preview` | Preview production build locally      |

## License

This project is private and not licensed for public distribution.
