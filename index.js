// Game constants and variables
let blockSize = 25; // General block size for grid
let snakeBodyWidth = 15; // Width of snake body (thicker than the tail)
let total_row = 17;
let total_col = 17;

let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let speedX = 0;
let speedY = 0;

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;

let obstacles = [];
let foodEaten = 0; // Track number of food items eaten
let score = 0; // Score for the player

// Preload the apple image
let appleImage = document.getElementById('apple');

// Game Initialization
window.onload = function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    placeFood(); // Place food at random position
    generateObstacles(5); // Generate 5 longer obstacles

    document.addEventListener("keyup", changeDirection); // Listen for movement keys

    setInterval(update, 1000 / 2); // Update the game state 5 times per second
};

// Updating the Game State
function drawGrass() {
    let grassColor1 = "#6B8E23"; // Darker green
    let grassColor2 = "#8FBC8F"; // Lighter green

    for (let row = 0; row < total_row; row++) {
        for (let col = 0; col < total_col; col++) {
            context.fillStyle = (row + col) % 2 == 0 ? grassColor1 : grassColor2;
            context.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        }
    }
}

function update() {
    if (gameOver) {
        return;
    }

    drawGrass(); // Draw the grass background

    // Draw the apple food using the preloaded image
    context.drawImage(appleImage, foodX, foodY, blockSize, blockSize);

    // Check if the snake eats the food
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        foodEaten++; // Increase the food eaten counter
        score += 10; // Increase score by 10 for each food eaten
        placeFood(); // Place new food at a random position

        // Every 10 pieces of food eaten, change obstacle positions
        if (foodEaten % 10 === 0) {
            changeObstaclePositions();
        }
    }

    // Move the snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Update snake position
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    // Draw the snake body as lines
    context.strokeStyle = "green"; // Snake body line color
    context.lineWidth = snakeBodyWidth; // Snake body line width

    for (let i = 0; i < snakeBody.length - 1; i++) {
        context.beginPath();
        context.moveTo(snakeBody[i][0] + blockSize / 2, snakeBody[i][1] + blockSize / 2); // Start at the segment position
        context.lineTo(snakeBody[i + 1][0] + blockSize / 2, snakeBody[i + 1][1] + blockSize / 2); // Draw line to the next segment
        context.stroke();
    }

    // Draw the tail as a sharp, thin line with brown color
    if (snakeBody.length > 1) {
        context.strokeStyle = "brown"; // Tail line color
        context.lineWidth = snakeBodyWidth / 2; // Tail is thinner
        let tailStart = snakeBody[snakeBody.length - 1];
        let tailEnd = snakeBody[snakeBody.length - 2];
        
        context.beginPath();
        context.moveTo(tailStart[0] + blockSize / 2, tailStart[1] + blockSize / 2);
        context.lineTo(tailEnd[0] + blockSize / 2, tailEnd[1] + blockSize / 2);
        context.stroke();
    }

    // Draw the head (with eyes) as a circle
    context.fillStyle = "darkgreen"; // Snake head color
    context.beginPath();
    context.arc(snakeX + blockSize / 2, snakeY + blockSize / 2, blockSize / 2, 0, 2 * Math.PI); // Circular head
    context.fill();

    // Draw eyes
    context.fillStyle = "black";
    let eyeOffsetX = speedX !== 0 ? (speedX > 0 ? 8 : -8) : 0;
    let eyeOffsetY = speedY !== 0 ? (speedY > 0 ? 8 : -8) : 0;
    context.beginPath();
    context.arc(snakeX + blockSize / 2 + eyeOffsetX, snakeY + blockSize / 2 + eyeOffsetY, 3, 0, 2 * Math.PI); // First eye
    context.arc(snakeX + blockSize / 2 - eyeOffsetX, snakeY + blockSize / 2 + eyeOffsetY, 3, 0, 2 * Math.PI); // Second eye
    context.fill();

    // Draw obstacles (now as long rectangles)
    context.fillStyle = "gray";
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        context.fillRect(obstacle[0], obstacle[1], blockSize * 2, blockSize); // Making obstacle 2 blocks long
    }

    // Check for collisions with obstacles
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        if (snakeX >= obstacle[0] && snakeX < obstacle[0] + blockSize * 2 && snakeY >= obstacle[1] && snakeY < obstacle[1] + blockSize) {
            gameOver = true;
            alert("Game Over: You hit an obstacle!");
        }
    }

    // Check for collisions with the walls
    if (snakeX < 0 || snakeX >= total_col * blockSize || snakeY < 0 || snakeY >= total_row * blockSize) {
        gameOver = true;
        alert("Game Over: You hit the wall!");
    }

    // Check if the snake collides with itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
            alert("Game Over: You hit yourself!");
        }
    }

    // Draw the score on the board
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 30); // Display score at top left
}

// Handling Keyboard Input
function changeDirection(e) {
    if (e.code == "ArrowUp" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    } else if (e.code == "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    } else if (e.code == "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    } else if (e.code == "ArrowRight" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }
}

// Placing the Food
function placeFood() {
    foodX = Math.floor(Math.random() * total_col) * blockSize;
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}

// Generating Obstacles
function generateObstacles(num) {
    obstacles = [];
    for (let i = 0; i < num; i++) {
        let x = Math.floor(Math.random() * total_col) * blockSize;
        let y = Math.floor(Math.random() * total_row) * blockSize;
        obstacles.push([x, y]);
    }
}

// Changing Obstacle Positions
function changeObstaclePositions() {
    generateObstacles(5);
}
