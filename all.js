const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const units = 20;
const rows = canvas.height / units;
const columns = canvas.width / units;
const upBtn = document.querySelector('.up');
const downBtn = document.querySelector('.down');
const rightBtn = document.querySelector('.right');
const leftBtn = document.querySelector('.left');
let snake = [];
// 物件的工作室，儲存身體的x,y座標
function createSnake() {
    snake[0] = {
        x: 80,
        y: 0,
    };
    snake[1] = {
        x: 60,
        y: 0
    };
    snake[2] = {
        x: 40,
        y: 0
    };
    snake[3] = {
        x: 20,
        y: 0
    };
}
// 初始設定
createSnake();
class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * columns) * units;
        this.y = Math.floor(Math.random() * rows) * units;
    }
    drawFruit() {
        ctx.beginPath();
        // ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = "#ef7aff";
        // ctx.fill();
        ctx.fillRect(this.x, this.y, units, units)
    }
    pickALocation() {
        let overlapping = false;
        let new_x;
        let new_y;
        function checkOverlap(new_x, new_y) {
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x == new_x && snake[i].y == new_y) {
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                }
            }
        }
        do {
            new_x = Math.floor(Math.random() * columns) * units;
            new_y = Math.floor(Math.random() * rows) * units;
            checkOverlap(new_x, new_y);
        } while (overlapping);
        this.x = new_x;
        this.y = new_y;
    }
}
let myFruit = new Fruit();

window.addEventListener("keydown", changeDirection);
let direction = "Right";
function changeDirection(e) {
    if (e.key == "ArrowLeft" && direction != "Right") {
        direction = "Left"
        arrowBtnEffect(leftBtn);
    } else if (e.key == "ArrowDown" && direction != "Up") {
        direction = "Down";
        arrowBtnEffect(downBtn);
    } else if (e.key == "ArrowRight" && direction != "Left") {
        direction = "Right"
        arrowBtnEffect(rightBtn);
    } else if (e.key == "ArrowUp" && direction != "Down") {
        direction = "Up"
        arrowBtnEffect(upBtn);
    }
    // 每次上下左右鍵之後,在下一幀被畫出來之前
    // 不接受任何keydown事件
    // 可防止連續按鍵導致蛇自殺
    window.removeEventListener("keydown", changeDirection);
}
upBtn.addEventListener("click", () => {
    if (direction != "Down") {
        direction = "Up"
        arrowBtnEffect(upBtn);
    }
});
downBtn.addEventListener("click", () => {
    if (direction != "Up") {
        direction = "Down"
        arrowBtnEffect(downBtn);
    }
});
leftBtn.addEventListener("click", () => {
    if (direction != "Right") {
        direction = "Left"
        arrowBtnEffect(leftBtn);
    }
});
rightBtn.addEventListener("click", () => {
    if (direction != "Left") {
        direction = "Right"
        arrowBtnEffect(rightBtn);
    }
});
function arrowBtnEffect(target) {
    target.classList.remove("boxshadow");
    setTimeout(function () {
        target.classList.add("boxshadow");
    }, 100);
}
let hightestScore;
loadHeightScore();
let score = 0;
document.getElementById("myScore").innerHTML = `遊戲分數：<span>${score * 10}</span>`;
document.getElementById("myScore2").innerHTML = `最高分數：<span class="currentlyHight">${hightestScore * 10}</span>`;
function draw() {
    // 每次畫圖前,確認蛇有沒有碰到自己
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            clearInterval(myGame);
            alert("Game Over")
            return;
        }
    }
    ctx.fillStyle = "#343434";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    myFruit.drawFruit();
    for (let i = 0; i < snake.length; i++) {
        if (i == 0) {
            ctx.fillStyle = "cornflowerblue";
        } else {
            ctx.fillStyle = "white";
        }
        // ctx.strokeStyle = "white"

        if (snake[i].x >= canvas.width) {
            snake[i].x = 0;
        }
        if (snake[i].y >= canvas.height) {
            snake[i].y = 0;
        }
        if (snake[i].x < 0) {
            snake[i].x = canvas.width - units;
        }
        if (snake[i].y < 0) {
            snake[i].y = canvas.height - units;
        }
        ctx.fillRect(snake[i].x, snake[i].y, units, units)
        ctx.strokeRect(snake[i].x, snake[i].y, units, units)
    }
    // 以目前的方向決定蛇的下一幀數 要放在哪個座標
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (direction == "Left") {
        snakeX = snakeX - units;
    } else if (direction == "Up") {
        snakeY -= units;
    } else if (direction == "Right") {
        snakeX += units;
    } else if (direction == "Down") {
        snakeY += units
    }
    let newHead = {
        x: snakeX,
        y: snakeY
    }
    // 確認蛇是否有吃到果實
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
        myFruit.pickALocation();
        score++;
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = `遊戲分數：<span class="scoreAdd">${score * 10}</span>`;
        document.getElementById("myScore2").innerHTML = `最高分數：<span class="currentlyHight">${hightestScore * 10}</span>`;
    } else {
        snake.pop();//去掉後面的方塊
    }
    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection);
}
let myGame = setInterval(draw, 100);

function loadHeightScore() {
    if (localStorage.getItem("hightestScore") == null) {
        hightestScore = 0;
    } else {
        hightestScore = Number(localStorage.getItem("hightestScore"));
    }
}

function setHighestScore(score) {
    if (score > hightestScore) {
        localStorage.setItem("hightestScore", score);
        hightestScore = score;
    }
}
