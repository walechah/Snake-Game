// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let gameOver = false;
let pause = false;
let hiscoreval = 0;

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    if (!pause) gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

function resetGame() {
    snakeArr = [{ x: 13, y: 15 }];
    inputDir = { x: 0, y: 0 };
    score = 0;
    gameOver = false;
    food = { x: 6, y: 7 };
    pause = false;
    musicSound.play();
    updateScore();
}

function gameEngine() {
    if (gameOver) return;

    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        gameOver = true;

        Swal.fire({
            title: 'Game Over!',
            text: 'You collided!',
            icon: 'error',
            confirmButtonText: 'Play Again'
        }).then(() => resetGame());
        return;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            document.getElementById('hiscoreBox').innerHTML = "HiScore: " + hiscoreval;
        }
        document.getElementById('scoreBox').innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    const board = document.getElementById('board');
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function updateScore() {
    document.getElementById('scoreBox').innerHTML = "Score: " + score;
    document.getElementById('hiscoreBox').innerHTML = "HiScore: " + hiscoreval;
}

// Main logic starts here
document.addEventListener('DOMContentLoaded', () => {
    musicSound.play();
    let hiscore = localStorage.getItem("hiscore");
    if (hiscore === null) {
        hiscoreval = 0;
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
    } else {
        hiscoreval = JSON.parse(hiscore);
        document.getElementById('hiscoreBox').innerHTML = "HiScore: " + hiscoreval;
    }

    window.requestAnimationFrame(main);
    window.addEventListener('keydown', e => {
        if (gameOver) {
            resetGame();
            return;
        }

        if (e.key === ' ') {
            pause = !pause;
            if (!pause) {
                musicSound.play();
            } else {
                musicSound.pause();
            }
            return;
        }

        moveSound.play();
        switch (e.key) {
            case "ArrowUp":
                if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
                break;
            case "ArrowDown":
                if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
                if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
                break;
            case "ArrowRight":
                if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
                break;
        }
    });
});
