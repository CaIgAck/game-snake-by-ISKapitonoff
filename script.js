/*
    1. Научиться в рандомном месте 
    генерировать голову - готово
    2. Научить голову ходить вверх - готово
    3. Научить голову ходить вправо - готово
    4. Научить голову ходить влево - готово
    5. Научить голову ходить вниз - готово
    6. Если голова достигла границ, то game over - ?
    7. Если голова воткнулась в тело, то game over - ?
    8. Написать генерацию яблок
    9. Написать генерацию хвоста
    10. Написать движение хвоста
*/

let lastAppleCords = null
let appleCoords = null
let snakeHead = null

const snakeTail = [];
const rows = document.querySelectorAll('.row');
const cols = rows[0].querySelectorAll('.col');
const baseSpeed = 500
let speed = 500

const commands = {
    'down': 'down',
    'up': 'up',
    'left': 'left',
    'rigth': 'rigth'
}
let currentCommand = commands['up'];


function initGame() {
    if (snakeHead) return

    // Добавляем голову
    generateSnake();
    addSnakeToField();

    //Добавляем яблоко
    initApple();

    // Добавляем контролы
    initControls();

    engine()
}


function engine() {

    const intervalId = setInterval(() => {
        if (snakeTail.length) {
            moveSnakeTail()
        }


        switch (currentCommand) {
            case commands['down']:
                moveDown()
                break;
            case commands['up']:
                moveUp()
                break;
            case commands['left']:
                moveLeft()
                break;
            case commands['rigth']:
                moveRight()
                break;
        }



        if (snakeTail.includes(snakeHead)) {
            clearInterval(intervalId)
        }

        if (snakeHead === appleCoords) {
            addNewSnakeTailCell()

            lastAppleCords = appleCoords
            removeAppleFromField();

            initApple();

            const speedCoefficient = 0.5
            const snakeTailBaseLength = snakeTail.length < 3 ? 2 : snakeTail.length
            speed = baseSpeed / (speedCoefficient * snakeTailBaseLength)

            clearInterval(intervalId)
            engine()
        }

    }, speed)
}

function moveSnakeTail() {
    removeSnakeTailCell();
    addSnakeTailCell();
}

function removeSnakeTailCell() {
    const lastSnakeTailCell = snakeTail.pop();

    let [coordX, coordY] = lastSnakeTailCell.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)
    row.querySelector(`[data-col='${coordY}']`).classList.remove('snake-tail')
}

function addSnakeTailCell() {
    snakeTail.unshift(snakeHead)

    const [snakeHeadCoordX, snakeHeadCoordY] = snakeHead.split('-')
    const newRow = document.querySelector(`[data-row='${snakeHeadCoordX}']`)
    newRow.querySelector(`[data-col='${snakeHeadCoordY}']`).classList.add('snake-tail')
}

function addNewSnakeTailCell() {
    let [snakeHeadCoordX, snakeHeadCoordY] = snakeTail?.at(-1)?.split('-') || snakeHead.split('-');

    switch (currentCommand) {
        case commands['down']:
            snakeHeadCoordX -= 1
            break;
        case commands['up']:
            snakeHeadCoordX = Number(snakeHeadCoordX)
            snakeHeadCoordX += 1
            break;
        case commands['left']:
            snakeHeadCoordY = Number(snakeHeadCoordY)
            snakeHeadCoordY += 1
            break;
        case commands['rigth']:
            snakeHeadCoordY -= 1
            break;
    }
    const newSnakeTailCoords = `${snakeHeadCoordX}-${snakeHeadCoordY}`

    snakeTail.push(newSnakeTailCoords)

    const newRow = document.querySelector(`[data-row='${snakeHeadCoordX}']`)
    newRow.querySelector(`[data-col='${snakeHeadCoordY}']`).classList.add('snake-tail')
}

function moveUp() {
    let [coordX, coordY] = snakeHead.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)
    row.querySelector(`[data-col='${coordY}']`).classList.remove('snake')

    coordX -= 1
    if (coordX >= 0) {
        const newRow = document.querySelector(`[data-row='${coordX}']`)
        newRow.querySelector(`[data-col='${coordY}']`).classList.add('snake')
        snakeHead = `${coordX}-${coordY}`
    }
};

function moveDown() {
    let [coordX, coordY] = snakeHead.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)
    row.querySelector(`[data-col='${coordY}']`).classList.remove('snake')

    coordX = Number(coordX)
    coordX += 1

    if (coordX <= rows.length) {
        const newRow = document.querySelector(`[data-row='${coordX}']`)
        newRow.querySelector(`[data-col='${coordY}']`).classList.add('snake')
        snakeHead = `${coordX}-${coordY}`
    }
};

function moveLeft() {
    let [coordX, coordY] = snakeHead.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)

    const tempCoordY = coordY
    coordY -= 1

    if (coordY >= 0) {
        row.querySelector(`[data-col='${tempCoordY}']`).classList.remove('snake')
        row.querySelector(`[data-col='${coordY}']`).classList.add('snake')
        snakeHead = `${coordX}-${coordY}`
    }
};

function moveRight() {
    let [coordX, coordY] = snakeHead.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)

    const tempCoordY = coordY

    coordY = Number(coordY)
    coordY += 1

    if (coordX <= rows.length) {
        row.querySelector(`[data-col='${tempCoordY}']`).classList.remove('snake')
        row.querySelector(`[data-col='${coordY}']`).classList.add('snake')
        snakeHead = `${coordX}-${coordY}`
    }
};



function initControls() {
    document.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "KeyS":
            case "ArrowDown":
                currentCommand = commands['down']
                break;
            case "KeyW":
            case "ArrowUp":
                currentCommand = commands['up']
                break;
            case "KeyA":
            case "ArrowLeft":
                currentCommand = commands['left']
                break;
            case "KeyD":
            case "ArrowRight":
                currentCommand = commands['rigth']
                break;
        }
    });
}

function initApple() {
    generateApple();
    addAppleToField()
}

function generateApple() {
    const coordX = Math.floor(Math.random() * 10);
    const coordY = Math.floor(Math.random() * 10);
    const appleCoordsFormated = `${coordX}-${coordY}`

    if (appleCoordsFormated === snakeHead || snakeTail.includes(appleCoordsFormated)) {
        generateApple()
    }
    else {
        appleCoords = `${coordX}-${coordY}`
    }
}

function addAppleToField() {
    const [coordX, coordY] = appleCoords.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)

    row.querySelector(`[data-col='${coordY}']`).classList.add('apple')
}

function removeAppleFromField() {
    if (!lastAppleCords) return

    const [coordX, coordY] = lastAppleCords.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)

    row.querySelector(`[data-col='${coordY}']`).classList.remove('apple')
    lastAppleCords = null
}

function generateSnake() {
    const coordX = Math.floor(Math.random() * 10);
    const coordY = Math.floor(Math.random() * 10);

    snakeHead = `${coordX}-${coordY}`
}

function addSnakeToField() {
    const [coordX, coordY] = snakeHead.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)

    row.querySelector(`[data-col='${coordY}']`).classList.add('snake')
}