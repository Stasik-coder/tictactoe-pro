import { PLAYERS, WINNING_COMBINATIONS } from '../utils/constants.js';

export class AI {
  static getMove(board, difficulty = 'hard') {
    if (difficulty === 'easy') {
      return this.getRandomMove(board);
    }

    if (difficulty === 'medium') {
      return Math.random() < 0.5
        ? this.getBestMove(board)
        : this.getRandomMove(board);
    }

    return this.getBestMove(board);
  }

  static getRandomMove(board) {
    const emptyCells = board
      .map((cell, index) => (cell === '' ? index : null))
      .filter((index) => index !== null);

    if (emptyCells.length === 0) return null;

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  static getBestMove(board) {
    const winningMove = this.findWinningMove(board, PLAYERS.O);
    if (winningMove !== null) return winningMove;

    const blockingMove = this.findWinningMove(board, PLAYERS.X);
    if (blockingMove !== null) return blockingMove;

    if (board[4] === '') return 4;

    const cornerMove = this.findFirstAvailableCell(board, [0, 2, 6, 8]);
    if (cornerMove !== null) return cornerMove;

    return this.findFirstAvailableCell(board, [1, 3, 5, 7]);
  }

  static findWinningMove(board, player) {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      const values = [board[a], board[b], board[c]];

      const playerCells = values.filter((value) => value === player).length;
      const emptyCells = values.filter((value) => value === '').length;

      if (playerCells === 2 && emptyCells === 1) {
        const emptyIndex = values.findIndex((value) => value === '');
        return combination[emptyIndex];
      }
    }

    return null;
  }

  static findFirstAvailableCell(board, indexes) {
    return indexes.find((index) => board[index] === '') ?? null;
  }
}