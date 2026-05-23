
document.addEventListener('DOMContentLoaded', () => {

    
    // Forcing user to go through the home screen
    if (!localStorage.getItem('visitedIndex') || localStorage.getItem('player') === null)
    {
        window.location.href = 'index.html';
        localStorage.setItem('visitedIndex', true);
    }
    else
    {
        localStorage.removeItem('visitedIndex');
    }

    // User needs to enter initials every time they play
    let name = localStorage.getItem('player');
    localStorage.removeItem('player');
    let highScores = JSON.parse(localStorage.getItem('highScores'));
    let highNames = JSON.parse(localStorage.getItem('highNames'));


    // HTML elements
    const grid = document.querySelector('.grid');
    const scoreDisp = document.querySelector('#score');
    const levelDisp = document.querySelector('#level');
    const lineDisp = document.querySelector('#lines');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const miniGrid = document.querySelector('.mini-grid');
    const nextSquares = Array.from(document.querySelectorAll('.mini-grid div'));
    let pauseBtn = document.getElementById('pauseBtn');
    const gameOver = document.getElementsByClassName('game-over')[0];
    const container = document.querySelectorAll('.container');
    let quitBtn = document.getElementById('quitBtn');

    // Default values
    const MAX_LEVEL = 10;
    let level = 1;
    let dropSpeed = 1000;
    let score = 0;
    let lineCnt = 0;
    let previousLineCnt = 0;
    const width = 10;
    let timerId;
    let paused = false;

    // Keybinds
    let binds = JSON.parse(localStorage.getItem("binds"));
    let backgroundColour = localStorage.getItem("colour");

    // Binding the d pad
    const dPadLeft = document.querySelector('.d-pad #left');
    dPadLeft.addEventListener('click', () => {
        const keystroke = new KeyboardEvent('keydown', {
            key:binds.left
        });

        keyInput(binds.left)
    });

    const dPadRight = document.querySelector('.d-pad #right');
    dPadRight.addEventListener('click', () => {
        const keystroke = new KeyboardEvent('keydown', {
            key:binds.right
        });

        keyInput(binds.right)
    });

    const dPadDown = document.querySelector('.d-pad #down');
    dPadDown.addEventListener('touchstart', () => {
        const keystroke = new KeyboardEvent('keydown', {
            key:binds.down
        });

        keyInput(binds.down);
    });

    dPadDown.addEventListener('touchend', () => {
        unSoftDrop();
    });

    const dPadUp = document.querySelector('.d-pad #up');
    dPadUp.addEventListener('click', () => {
        const keystroke = new KeyboardEvent('keydown', {
            key:binds.hard
        });

        keyInput(binds.hard);
    });

    const a = document.querySelector('.a-b #clockwise');
    a.addEventListener('click', () => {
        const keystroke = new KeyboardEvent('keydown', {
            key:binds.clockwise
        });

        keyInput(binds.clockwise);
    });

    const b = document.querySelector('.a-b #counterClockwise');
    b.addEventListener('click', () => {
        const keystroke = new KeyboardEvent('keydown', {
            key:binds.counterClockwise
        });

        keyInput(binds.counterClockwise);
    });


    // Setting each individual square to background colour
    // Otherwise colour seeps through corners
    squares.forEach(square => {
        if (square.className !== "taken") square.style.backgroundColor = backgroundColour;
    });

    // Creating each tetromino
    // https://docs.google.com/spreadsheets/d/12WR_rgHd6ENNGiIF0RBDOAiI4D1YlewqZecEhn96u74/edit?usp=sharing
    const shape_J = [
        [0,width, width+1, width+2],
        [1,2,width+1,(2*width)+1],
        [width, width+1, width+2, (2*width)+2],
        [1,width+1,(2*width)+1,(2*width)]
    ]

    const shape_L = [
        [width,width+1,width+2,2],
        [1,width+1,(2*width)+1,(2*width)+2],
        [width, width+1, width+2, (2*width)],
        [0,1,width+1,(2*width)+1]
    ]

    const shape_S = [
        [width+1,width+2,2*width,2*width+1],
        [0,width,width+1,(2*width)+1],
        [1,2,width,width+1],
        [1,width+1,width+2,(2*width)+2]    
    ]

    const shape_Z = [
        [width,width+1,2*width+1,2*width+2],
        [1,width,width+1,(2*width)],
        [0,1,width+1,width+2],
        [2,width+1,width+2,(2*width)+1]
    ]    

    const shape_T = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,(2*width)+1],
        [width,width+1,width+2,(2*width)+1],
        [1,width,width+1,(2*width)+1]
    ]

    const shape_O = [
        [width+1, width+2, (2*width)+1, (2*width)+2],
        [width+1, width+2, (2*width)+1, (2*width)+2],
        [width+1, width+2, (2*width)+1, (2*width)+2],
        [width+1, width+2, (2*width)+1, (2*width)+2]
    ]

    const shape_I = [
        [width, width+1, width+2, width+3],
        [2, width+2, (2*width)+2, (3*width)+2],
        [width*2, width*2+1, width*2+2, width*2+3],
        [1, width+1, (2*width)+1, (3*width)+1]
    ]

    // Array of tetrominoes
    const shapes = [shape_L, shape_J, shape_T, shape_S, shape_Z, shape_I, shape_O];
    const colours = ["#ffb700", "#0000ff", "#a000ff", "#00ff00", "#ff0000", "#00ffee", "#ffe900"];

    // Position variables
    let currentPosition;
    let currentBlock;
    let currentRotation;
    let current;
    let nextBlock = Math.floor(Math.random()*shapes.length);
    let nextRotation = Math.floor(Math.random()*shapes[nextBlock].length);
    let nextPiece = shapes[nextBlock][nextRotation];

    // Start game
    spawn();
    showNext();

    // Block generation
    function spawn(){

        // Default spawn of shape at center
        currentPosition = 3;

        // Setting current block to the next block       
        currentBlock = nextBlock;
        currentRotation = nextRotation;

        current = nextPiece;


        // Setting next block
        nextBlock = Math.floor(Math.random()*shapes.length);
        nextRotation = Math.floor(Math.random()*shapes[nextBlock].length);

        nextPiece = shapes[nextBlock][nextRotation];
    }

    // Show block
    function show() {

        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colours[currentBlock];
        });
    }

    // Show next block
    function showNext() {
    
        const nextPieceList = [
            [8,9,10,6],  // L
            [8,9,10,4], // J
            [4,5,6,9],  // T
            [5,6,8,9],  // S
            [4,5,9,10],  // Z
            [4,5,6,7],  // I
            [5,6,9,10]   // O
        ];
    
        // Clear mini grid
        nextSquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = backgroundColour;
        });
    
        // Get mini display block
        let miniGridPiece = nextPieceList[nextBlock];
    
        // Show next piece in next piece display
        miniGridPiece.forEach(index => {
            nextSquares[index].classList.add('tetromino');
            nextSquares[index].style.backgroundColor = colours[nextBlock];
        });
    }

    // Remove block
    function remove() {
        current.forEach(index => {
            squares[currentPosition + index].style.backgroundColor = backgroundColour;
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }


    // Moving down
    function down(){

        // If paused go back
        if (paused) return;

        // If not at bottom keep moving
        if (!checkBottom()){
            remove();
            currentPosition += width;
            if (softDrop) 
            {
                score++;
                scoreDisp.textContent = score;
            }
            show();
        }

        // If reached bottom spawn next block
        else
        {
            next();
        }
    }

    // Default drop speed
    timerId = setInterval(down, dropSpeed);

    // Check if block has reached bottom
    function checkBottom() {
        return current.some(index => 
            squares[currentPosition + index + width]?.classList.contains('taken')
        );
    }

    // Next block
    function next() {

        // Turning each untaken square to taken
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));

        spawn();
        showNext();

        updateDropSpeed();

        clearLine();
        show();
        lose();
         
    }

    // Moving left
    function moveLeft(){
        remove();

        // If any element is at edge then no more moving left
        const edge = current.some(index => (currentPosition + index) % width === 0);
        const collision = current.some(index => squares[currentPosition + index - 1]?.classList.contains('taken'));

        if (!edge && !collision){
            currentPosition -= 1;
        }

        show();
    }

    // Moving right
    function moveRight(){
        remove();

        // If any element is at edge then no more moving left
        const edge = current.some(index => (currentPosition + index) % width === 9)
        const collision = current.some(index => squares[currentPosition + index + 1]?.classList.contains('taken'));

        if (!edge && !collision){
            currentPosition += 1;
        }

        show();
    }

    // Soft drop
    let softDrop;

    // Resetting drop settings
    function unSoftDrop(){
        softDrop = false;

        updateDropSpeed();
    }

    // Rotate clockwise
    function rotateClockwise(){
        remove();

        const nextRotation = (currentRotation + 1) % 4;
        const nextBlock = shapes[currentBlock][nextRotation];

        // If rotation is not valid then no rotation
        if (!willCollide(nextBlock))
        {
            currentRotation = nextRotation;
            current = nextBlock;
        }

        show();
    }

    // Rotate counter clockwise
    function rotateCounterClockwise(){
        remove();

        const nextRotation = (currentRotation + 3) % 4;
        const nextBlock = shapes[currentBlock][nextRotation];

        // If rotation is not valid then no rotation
        if (!willCollide(nextBlock))
        {
            currentRotation = nextRotation;
            current = nextBlock;
        }

        show();
    }
    function willCollide(newBlock) {
        // Check if any of the new rotated block's positions are already taken
        if (newBlock.some(index => squares[currentPosition + index]?.classList.contains('taken')))
        {
            return true;
        }

        // Wrapping from right side to left
        if (
            newBlock.some(index => (currentPosition + index) % width === 0) &&
            current.some(index => (currentPosition + index) % width === width - 1)
        ) {
            return true;
        }

        // Wrapping from left side to right
        if (
            newBlock.some(index => (currentPosition + index) % width === width - 1) &&
            current.some(index => (currentPosition + index) % width === 0)
        ) {
            return true;
        }

        return false;
    }


    function keyInput(e)
    {
        // Bind escape key to pause
        if (e === "escape") pauseGame();

        // Only allow stuff to work during unpause time
        if (!paused)
        {
            switch (e)
            {

                // Moving left/right
                case (binds.left):
                    moveLeft();
                    break;
                case (binds.right):
                    moveRight();
                    break;

                // Soft dropping
                case(binds.down):

                    if (!softDrop){

                        softDrop = true;

                        clearInterval(timerId);
                        timerId = setInterval(down, dropSpeed/10);                    
                    }
                    break;

                // Rotating
                case (binds.clockwise):
                    rotateClockwise();
                    break;
                case (binds.counterClockwise):
                    rotateCounterClockwise();
                    break;

                case binds.hard:
                    clearInterval(timerId);
                    timerId = setInterval(down, 0);
            }            
        }
    }

    document.addEventListener("keydown", (e) => {
        keyInput(e.key.toLowerCase());
    });



    // Soft drop key was released
    document.addEventListener("keyup", (e) => {

        if (e.key.toLowerCase() === binds.down && !paused){
            unSoftDrop();
        }
    });


    // User pauses game
    pauseBtn.addEventListener('click', ()=>{
        pauseGame();
    });

    // User quits game
    quitBtn.addEventListener('click', ()=>{

        if (!paused) pauseGame();

        const confirmBox = document.querySelector(".quit-popup");
        confirmBox.showModal();

        document.querySelector('.quit-popup #yes').addEventListener('click', () => {
            window.location.href = "index.html";
        });

        document.querySelector('.quit-popup #no').addEventListener('click', () => {
            confirmBox.close();
        });
    
    });


    // Pause game
    function pauseGame(){

        // Changing pause button text
        pauseBtn.textContent = paused ? "Pause" : "Resume";

        const game = document.querySelector('#game');
        

        // Reset soft drop settings
        if (softDrop){
            unSoftDrop();
        }

        const mobileView = window.matchMedia("(max-width: 768px)").matches;

        // If game is paused then unpause
        if (paused)
        {
            game.style.display = "flex";
            document.querySelector('#info h1').style.display = "none";
            document.querySelector('.container').style.height = "fit-content";
            document.querySelector('.mobile-buttons').style.display = mobileView ? "flex" : "none";
            timerId = setInterval(down, dropSpeed);
            paused = false;
        }

        // If game is unpaused then pause
        else
        {

            game.style.display = "none";
            document.querySelector('#info h1').style.display = "inline";
            document.querySelector('.container').style.height = "75%";
            document.querySelector('.mobile-buttons').style.display = "none";
            clearInterval(timerId);
            timerId = null;
            paused = true;
        }
    }


    // User clears a line
    function clearLine(){

        let lines = 0;
        let linePoints = 0;
        let softDropPoints = 0;

        // Clear full lines and append to top
        for (let i = 0; i < 200; i += width)
        {
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];

            if (row.every(index => squares[index]?.classList.contains('taken')))
            {
                row.forEach(index => {
                    squares[index].style.backgroundColor = backgroundColour;
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');

                    lines++;
                });

                const line = squares.splice(i, width);
                squares = line.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }

        // Lines cleared
        lines /= 10;

        // Update line count
        previousLineCnt = lineCnt;
        lineCnt += lines;

        // Scoring system

        // Line dependent score
        if (lines === 1) 
        {
            linePoints = 40;
        }
        else if (lines === 2)
        {
            linePoints = 100;
        }
        else if (lines === 3) 
        {
            linePoints = 300;
        }
        else if (lines > 3) 
        {
            linePoints = 1200;
        }

        softDropPoints = (linePoints/10);

        // If user soft drops on easy level then -10%
        if (softDrop && level < MAX_LEVEL/2 && lines > 0)
        {
            score -= softDropPoints;
        }

        // If user soft drops on harder levels then +10% + (level*20)
        else if (softDrop && level >= MAX_LEVEL/2 && lines > 0)
        {
            score += softDropPoints + (level*20);
        }

        score += linePoints;

        scoreDisp.textContent = score;

        // Level up
        if (Math.floor(previousLineCnt / 10) < Math.floor(lineCnt / 10)) {
            level++;
            if (level < MAX_LEVEL)
            {

                let temp = softDrop;

                softDrop = false;
                updateDropSpeed();
                softDrop = temp;
            
            }
        }

        levelDisp.textContent = level;
        lineDisp.textContent = lineCnt;
    }

    // Update drop speed
    function updateDropSpeed() {

        if (!softDrop)
        {
            // Level is within max level range then just -100ms every time
            if (level <= MAX_LEVEL)
            {
                dropSpeed = 1000 - ((level-1) * 100);
                clearInterval(timerId);            
            }

            // Level is above max level range then -5ms every 3 levels
            else if (level > MAX_LEVEL && (level-MAX_LEVEL)%3===0)
            {
                dropSpeed = Math.max(100 - (((level-MAX_LEVEL)/3)*5), 50);
                clearInterval(timerId);
            }

            //update timer
            timerId = setInterval(down, dropSpeed);            
        }
    }

    // Player loses
    function lose()
    {
        if (current.some(index => squares[currentPosition + index]?.classList.contains('taken')))
        {
            pauseGame();
            clearInterval(timerId);

            document.querySelector('.game-over #score').textContent = score;
            document.querySelector('.game-over #lines').textContent = lineCnt;
            document.querySelector('.game-over #level').textContent = level;

            gameOver.style.display = "flex";
            
            Array.from(container).forEach((element) => {
                element.style.display = "none";
            });

            document.body.style.justifyContent = "center";

            saveScore();
        }
    }

    // Check is user beat any records
    function saveScore()
    {
        for (let i = 0; i < highScores.length; i++)
        {
            if (score > highScores[i])
            {
                highScores.splice(i, 0, score);
                highScores.pop();
                highNames.splice(i, 0, name.toUpperCase());
                highNames.pop();
                localStorage.setItem('highScores', JSON.stringify(highScores));
                localStorage.setItem('highNames', JSON.stringify(highNames));
                break;
            }
        }
    }
});