# Graph Traversing Visualizer

A modern web application that visualizes different pathfinding algorithms in action. Built with React, TypeScript, and D3.js, this project demonstrates various graph traversal algorithms through an interactive and animated grid-based interface.

## Features

- Interactive grid visualization with randomly generated obstacles
- Multiple pathfinding algorithms (A\*, DFS, and more)
- Real-time algorithm visualization with customizable animation speed
- Modern UI built with shadcn/ui components
- Responsive design with smooth animations
- State management using Zustand

## Tech Stack

- React 19
- TypeScript
- Vite
- D3.js for visualization
- TailwindCSS for styling
- shadcn/ui for UI components
- Zustand for state management
- Firebase for deployment

## Prerequisites

- Node.js (v18 or higher)
- Yarn (v4.6.0 or higher)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/TechTutter/graph-traversing-visualizer.git
cd graph-traversing-visualizer
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
yarn run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # React components
├── lib/           # Utility functions and algorithms
├── styles/        # Global styles
├── types/         # TypeScript type definitions
└── store/         # Zustand store
```
