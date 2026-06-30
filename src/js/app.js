import '../css/base.css';
import '../css/layout.css';
import '../css/board.css';
import '../css/buttons.css';
import '../css/modal.css';
import '../css/responsive.css';

import {Game} from './core/Game.js';
import {Score} from './core/Score.js';
import {AI} from './core/AI.js';
import {BoardUI} from './ui/BoardUI.js';
import {ModalUI} from './ui/ModalUI.js';
import {ThemeUI} from './ui/ThemeUI.js';
import {GAME_STATUS,PLAYERS} from './utils/constants.js';

const app=document.querySelector('#app');
app.innerHTML=`
<main class="page">
    <section class="game-card">
        <p class="eyebrow">JavaScript Practice Project</p>
        <h1>TicTacToe Pro</h1>
        <div class="players">
            <div>
                <span>Игрок X</span>
                <strong>Player</strong>
            </div>
            <div>
                <span>Игрок O</span>
                <strong>Computer / Player 2</strong>
            </div>
        </div>
        <div class="start-screen" data-start-screen>
            <div class="start-panel">
                <h2>Выбери режим игры</h2>
                <div class="mode-grid">
                    <button class="mode-card is-active" data-mode-option="pve">
                        <span>🤖</span>
                        <strong>Игрок vs Компьютер</strong>
                        <small>Сыграй против ИИ</small>
                    </button>
                    <button class="mode-card" data-mode-option="pvp">
                        <span>👥</span>
                        <strong>Игрок vs Игрок</strong>
                        <small>Игра на двоих</small>
                    </button>
                </div>
                <div class="start-difficulty" data-start-difficulty>
                    <label for="difficulty">Сложность ИИ</label>
                    <select id="difficulty" data-difficulty>
                        <option value="easy">Легкий</option>
                        <option value="medium">Средний</option>
                        <option value="hard" selected>Сложный</option>
                    </select>
                </div>
                <button class="button" data-start-game>Начать игру</button>
            </div>
        </div>
        <p class="status" data-status>Ход игрока X</p>
        <div class="board" data-board></div>
        <div class="score">
            <div><span>X</span><strong data-score-x>0</strong></div>
            <div><span>Ничьи</span><strong data-score-draws>0</strong></div>
            <div><span>O</span><strong data-score-o>0</strong></div>
        </div>
        <div class="actions">
            <button class="button" data-new-game>Новая игра</button>
            <button class="button button-secondary" data-reset-score>Сбросить счет</button>
            <button class="button button-secondary" data-theme-toggle>Светлая тема</button>
        </div>
    </section>
</main>
`;

const game=new Game();
const score=new Score();
const boardUI=new BoardUI(document.querySelector('[data-board]'));

const modalContainer=document.createElement('div');
modalContainer.setAttribute('data-modal','');
document.body.append(modalContainer);

const modalUI=new ModalUI(modalContainer);
const statusElement=document.querySelector('[data-status]');
const newGameButton=document.querySelector('[data-new-game]');
const resetScoreButton=document.querySelector('[data-reset-score]');
const scoreXElement=document.querySelector('[data-score-x]');
const scoreOElement=document.querySelector('[data-score-o]');
const scoreDrawsElement=document.querySelector('[data-score-draws]');
const difficultySelect=document.querySelector('[data-difficulty]');
const themeButton=document.querySelector('[data-theme-toggle]');
const themeUI=new ThemeUI(themeButton);
const startScreen=document.querySelector('[data-start-screen]');
const startButton=document.querySelector('[data-start-game]');
const modeButtons=document.querySelectorAll('[data-mode-option]');
const startDifficulty=document.querySelector('[data-start-difficulty]');

let isResultSaved=false;
let isComputerThinking=false;
let gameMode='pve';

themeUI.init();

const updateStatus=()=>{
    if(game.status===GAME_STATUS.WIN){
        statusElement.textContent=`Победил игрок ${game.winner}`;
        return;
    }
    if(game.status===GAME_STATUS.DRAW){
        statusElement.textContent='Ничья';
        return;
    }
    if(isComputerThinking){
        statusElement.textContent='Компьютер думает...';
        return;
    }
    statusElement.textContent=`Ход игрока ${game.currentPlayer}`;
};

const updateScore=()=>{
    const currentScore=score.getScore();
    scoreXElement.textContent=currentScore.x;
    scoreOElement.textContent=currentScore.o;
    scoreDrawsElement.textContent=currentScore.draws;
};

const saveResultIfNeeded=()=>{
    if(isResultSaved)return;
    if(game.status===GAME_STATUS.WIN){
        score.addWin(game.winner);
        isResultSaved=true;
        modalUI.show({
            title:'🏆 Победа!',
            text:`Победил игрок ${game.winner}`
        });
    }
    if(game.status===GAME_STATUS.DRAW){
        score.addDraw();
        isResultSaved=true;
        modalUI.show({
            title:'🤝 Ничья!',
            text:'Победителя нет, попробуй еще раз'
        });
    }
};

const render=()=>{
    saveResultIfNeeded();
    boardUI.render(game.board,game.winningCombination);
    updateStatus();
    updateScore();
};

const makeComputerMove=()=>{
    if(gameMode!=='pve')return;
    if(game.status!==GAME_STATUS.PLAYING)return;
    if(game.currentPlayer!==PLAYERS.O)return;
    isComputerThinking=true;
    render();
    setTimeout(()=>{
        const move=AI.getMove(game.board,difficultySelect.value);
        if(move!==null){
            game.makeMove(move);
        }
        isComputerThinking=false;
        render();
    },500);
};

const restartGame=()=>{
    game.reset();
    isResultSaved=false;
    isComputerThinking=false;
    modalUI.hide();
    render();
};

boardUI.onCellClick((index)=>{
    if(isComputerThinking)return;
    if(gameMode==='pve'&&game.currentPlayer!==PLAYERS.X)return;
    const isMoveMade=game.makeMove(index);
    if(!isMoveMade)return;
    render();
    makeComputerMove();
});

newGameButton.addEventListener('click',restartGame);
resetScoreButton.addEventListener('click',()=>{
    score.reset();
    updateScore();
});

modalUI.onNewGame(restartGame);

startScreen.addEventListener('click',(event)=>{
    const modeButton=event.target.closest('[data-mode-option]');
    const startGameButton=event.target.closest('[data-start-game]');
    if(modeButton){
        gameMode=modeButton.dataset.modeOption;
        modeButtons.forEach((item)=>item.classList.remove('is-active'));
        modeButton.classList.add('is-active');
        startDifficulty.style.display=gameMode==='pve'?'block':'none';
    }
    if(startGameButton){
        startScreen.classList.add('is-hidden');
        restartGame();
    }
});
render();