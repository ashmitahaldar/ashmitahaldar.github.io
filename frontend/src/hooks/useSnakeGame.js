import { useState, useEffect } from 'react';

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState(null);

  // Snake game loop
  useEffect(() => {
    if (!gameState || gameState.gameOver) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        if (!prev || prev.gameOver) return prev;

        const { snake, food, direction, score } = prev;
        const head = snake[0];
        let newHead;

        // Calculate new head position
        switch (direction) {
          case 'UP': newHead = { x: head.x, y: head.y - 1 }; break;
          case 'DOWN': newHead = { x: head.x, y: head.y + 1 }; break;
          case 'LEFT': newHead = { x: head.x - 1, y: head.y }; break;
          case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break;
          default: return prev;
        }

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= 20 || newHead.y < 0 || newHead.y >= 12) {
          return { ...prev, gameOver: true };
        }

        // Check self collision
        if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          return { ...prev, gameOver: true };
        }

        const newSnake = [newHead, ...snake];
        let newFood = food;
        let newScore = score;

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          newScore += 10;
          newFood = {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 12)
          };
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore
        };
      });
    }, 150);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  const startGame = () => {
    setGameState({
      snake: [{ x: 10, y: 6 }, { x: 9, y: 6 }, { x: 8, y: 6 }],
      food: { x: 15, y: 6 },
      direction: 'RIGHT',
      score: 0,
      gameOver: false
    });
  };

  const changeDirection = (newDirection) => {
    setGameState(prev => {
      if (!prev) return prev;
      // Prevent 180-degree turns
      const opposites = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
      if (opposites[newDirection] === prev.direction) return prev;
      return { ...prev, direction: newDirection };
    });
  };

  const endGame = () => {
    setGameState(null);
  };

  const renderGame = () => {
    if (!gameState) return null;

    const grid = Array(12).fill(null).map(() => Array(20).fill(' '));
    
    // Place snake
    gameState.snake.forEach((segment, i) => {
      if (segment.x >= 0 && segment.x < 20 && segment.y >= 0 && segment.y < 12) {
        grid[segment.y][segment.x] = i === 0 ? '◉' : '●';
      }
    });

    // Place food
    if (gameState.food.x >= 0 && gameState.food.x < 20 && gameState.food.y >= 0 && gameState.food.y < 12) {
      grid[gameState.food.y][gameState.food.x] = '✦';
    }

    const gameDisplay = [
      '┌────────────────────────────────────────┐',
      ...grid.map(row => '│' + row.join('') + '│'),
      '└────────────────────────────────────────┘',
      `Score: ${gameState.score}${gameState.gameOver ? ' - GAME OVER! Press ESC to exit' : ' - Use WASD/Arrow keys'}`,
    ].join('\n');

    return gameDisplay;
  };

  return {
    gameState,
    startGame,
    changeDirection,
    endGame,
    renderGame
  };
};
