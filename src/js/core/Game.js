import { GAME_STATUS, PLAYERS, WINNING_COMBINATIONS } from '../utils/constants.js';

export class Game {
  constructor() {
    this.board = Array(9).fill('');
    this.currentPlayer = PLAYERS.X;
    this.status = GAME_STATUS.PLAYING;
    this.winner = null;
    this.winningCombination = [];
  }

  makeMove(index) {
    if (this.board[index] || this.status !== GAME_STATUS.PLAYING) return false;

    this.board[index] = this.currentPlayer;
    this.checkGameState();

    if (this.status === GAME_STATUS.PLAYING) {
      this.switchPlayer();
    }

    return true;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
  }

  checkGameState() {
    const winCombination = WINNING_COMBINATIONS.find((combination) => {
      const [a, b, c] = combination;
      return (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      );
    });

    if (winCombination) {
      this.status = GAME_STATUS.WIN;
      this.winner = this.board[winCombination[0]];
      this.winningCombination = winCombination;
      return;
    }

    if (this.board.every(Boolean)) {
      this.status = GAME_STATUS.DRAW;
    }
  }

  reset() {
    this.board = Array(9).fill('');
    this.currentPlayer = PLAYERS.X;
    this.status = GAME_STATUS.PLAYING;
    this.winner = null;
    this.winningCombination = [];
  }
}