let lastAppleCords = null
let appleCoords = null
let snakeHead = null
let speed = 500

const snakeTail = [];
const rows = document.querySelectorAll('.row');
const cols = rows[0].querySelectorAll('.col');
const baseSpeed = 500

const commands = {
    'down': 'down',
    'up': 'up',
    'left': 'left',
    'rigth': 'rigth'
}
let currentCommand = commands['up'];


function initGame() {
    if (snakeHead) return

    generateSnake();
    addSnakeToField();

    initApple();

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
                moveByX(true)
                break;
            case commands['up']:
                moveByX()
                break;
            case commands['left']:
                moveByY()
                break;
            case commands['rigth']:
                moveByY(true)
                break;
        }

        if (snakeTail.includes(snakeHead)) {
            clearInterval(intervalId)
        }

        if (snakeHead === appleCoords) {

            lastAppleCords = appleCoords
            removeAppleFromField();
            initApple();

            addNewSnakeTailCell()

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

    mutationEntity({ coords: lastSnakeTailCell, className: 'snake-tail', actionName: 'remove' })
}

function addSnakeTailCell() {
    snakeTail.unshift(snakeHead)

    mutationEntity({ coords: snakeHead, className: 'snake-tail', actionName: 'add' })
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
    const newSnakeTailCoords = coordsFormatted({ x: snakeHeadCoordX, y: snakeHeadCoordY })
    snakeTail.push(newSnakeTailCoords)
    mutationEntity({ coords: newSnakeTailCoords, className: 'snake-tail', actionName: 'add' })
}

function moveByX(isMoveDown = false) {
    let [coordX, coordY] = snakeHead.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)
    row.querySelector(`[data-col='${coordY}']`).classList.remove('snake')

    if (isMoveDown) {
        coordX = Number(coordX)
        coordX += 1
    } else {
        coordX -= 1
    }

    if (coordX < rows.length && coordX >= 0) {
        const newRow = document.querySelector(`[data-row='${coordX}']`)
        newRow.querySelector(`[data-col='${coordY}']`).classList.add('snake')
        snakeHead = coordsFormatted({ x: coordX, y: coordY })
    }
}

function moveByY(isMoveRight = false) {
    let [coordX, coordY] = snakeHead.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)
    const tempCoordY = coordY

    if (isMoveRight) {
        coordY = Number(coordY)
        coordY += 1
    } else {
        coordY -= 1
    }

    if (coordY < row.children.length && coordY >= 0) {
        row.querySelector(`[data-col='${tempCoordY}']`).classList.remove('snake')
        row.querySelector(`[data-col='${coordY}']`).classList.add('snake')
        snakeHead = coordsFormatted({ x: coordX, y: coordY })
    }
}

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
    const [coordX, coordY] = coordsGenerate()
    const appleCoordsFormated = coordsFormatted({ x: coordX, y: coordY })

    if (appleCoordsFormated === snakeHead || snakeTail.includes(appleCoordsFormated)) {
        generateApple()
    } else {
        appleCoords = coordsFormatted({ x: coordX, y: coordY })
    }
}

function addAppleToField() {
    mutationEntity({ coords: appleCoords, className: 'apple', actionName: 'add' })
}

function removeAppleFromField() {
    if (!lastAppleCords) return

    mutationEntity({ coords: lastAppleCords, className: 'apple', actionName: 'remove' })
    lastAppleCords = null
}

function generateSnake() {
    const [coordX, coordY] = coordsGenerate()

    snakeHead = coordsFormatted({ x: coordX, y: coordY })
}

function addSnakeToField() {
    mutationEntity({ coords: snakeHead, className: 'snake', actionName: 'add' })
}

function coordsFormatted({ x, y }) {
    return `${x}-${y}`
}

function coordsGenerate() {
    const coordX = Math.floor(Math.random() * 10);
    const coordY = Math.floor(Math.random() * 10);
    return [coordX, coordY]
}

function mutationEntity({ coords, className, actionName }) {
    const [coordX, coordY] = coords.split('-')
    const row = document.querySelector(`[data-row='${coordX}']`)

    if (actionName === 'add') {
        row.querySelector(`[data-col='${coordY}']`).classList.add(className)
    } else {
        row.querySelector(`[data-col='${coordY}']`).classList.remove(className)
    }
}