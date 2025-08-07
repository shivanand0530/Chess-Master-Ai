# Chess-Master-AI
A modern chess application with an intelligent AI opponent

## About
Chess-Master-AI is a sophisticated chess application built with React and TypeScript that allows you to play against a computer opponent with adjustable difficulty levels.

The primary focus of Chess-Master-AI is providing an engaging chess experience with a powerful AI decision-making engine. The application uses external libraries for the core functionality:
- Chess Board UI: Using the react-chessboard component
- Game Mechanics: Using the chess.js library

The AI uses the minimax algorithm, which is optimized by alpha-beta pruning to efficiently search through possible moves and select the best one.

The evaluation function uses piece-square tables adapted from Sunfish.py, and eliminates the need for nested loops by updating the sum based on each move instead of re-computing the sum of individual pieces at each leaf node.

A global sum is used to track the evaluation score after each move, which is used to display the 'advantage' bar in the UI.

## Features
- Adjustable AI difficulty levels (Beginner to Expert)
- Visual move hints
- Undo/redo functionality
- Position advantage indicator
- Performance statistics (positions evaluated, calculation time)
- Responsive design for various screen sizes

## How to Play
1. Clone this repository and install dependencies with `npm install`
2. Start the development server with `npm run dev`
3. Play as white by dragging a piece to your desired location. The AI plays as black by default.
4. The AI's search depth (which directly affects its playing strength) can be customized using the difficulty dropdown. Higher difficulty levels will improve the AI's accuracy, but it will take longer to decide on the next move.
5. You can toggle move hints, undo/redo moves, and start a new game using the control buttons.

## Technologies Used
- React
- TypeScript
- chess.js
- react-chessboard
- TailwindCSS
- Vite

## Project Structure
- `/src/components`: React components for the chess board and UI elements
- `/src/utils`: Utility functions including the chess AI implementation
- `/src/types`: TypeScript type definitions

## License
All rights reserved.
