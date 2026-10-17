"use client";

import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Tile from "@/components/Tile";
import { defaultBind } from "@/lib/keybinds";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, LogOut, Pause, PlayIcon, RotateCcw, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Default values
const MAX_LEVEL = 10;
const width = 10;

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

const nextPieceList = [
    [8,9,10,6],  // L
    [8,9,10,4], // J
    [4,5,6,9],  // T
    [5,6,8,9],  // S
    [4,5,9,10],  // Z
    [4,5,6,7],  // I
    [5,6,9,10]   // O
];

// Array of tetrominoes
const shapes = [shape_L, shape_J, shape_T, shape_S, shape_Z, shape_I, shape_O];
const colours = ["#ffb700", "#0000ff", "#a000ff", "#00ff00", "#ff0000", "#00ffee", "#ffe900"];

type Piece = {
    block: number;
    rotation: number;
    squares: number[];
};

type HighScore = {
    name: string;
    score: number;
};

function createRandomPiece(): Piece {
    const block = Math.floor(Math.random() * shapes.length);
    const rotation = Math.floor(
        Math.random() * shapes[block].length
    );

    return {
        block,
        rotation,
        squares: shapes[block][rotation],
    };
}


export default function Play(){

    const router = useRouter();

    const [playerName, setPlayerName] = useState("");
    const [paused, setPaused] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [score, setScore] = useState(0);
    const [lineCnt, setLineCnt] = useState(0);
    const [level, setLevel] = useState(0);
    const [isHighScore, setIsHighScore] = useState(false);

    const isGamePaused = paused || modalOpen;
    const [backgroundColour, setBackgroundColour] = useState("");
    const [binds, setBinds] = useState(defaultBind);

    const [dropSpeed, setDropSpeed] = useState(1000);
    const [gameOver, setGameOver] = useState(false);

    // Position variables
    const [current, setCurrent] = useState<number[]>([]);
    const [currentPosition, setCurrentPosition] = useState(4);
    const [currentBlock, setCurrentBlock] = useState(0);

    const [currentRotation, setCurrentRotation] = useState(0);
    const [lockedSquares, setLockedSquares] = useState<Set<number>>(new Set());
    const [softDrop, setSoftDrop] = useState(false);


    const [nextPieces, setNextPieces] = useState<Piece[]>([]);
    useEffect(() => {
        setNextPieces(
            Array.from({ length: 3 }, createRandomPiece)
        );
    }, []);

    const currentSquares = new Set(
        current.map(index => currentPosition + index)
    );

    const scoreSaved = useRef(false);

    useEffect(() => {
        if (!gameOver || scoreSaved.current) return;

        scoreSaved.current = true;

        const name = localStorage.getItem("player")?.trim() || "Anonymous";

        let highScores: HighScore[] = [];

        try {
            const saved = localStorage.getItem("highScores");
            const parsed: unknown = saved ? JSON.parse(saved) : [];

            if (Array.isArray(parsed)) {
                highScores = parsed.filter(
                    (entry): entry is HighScore =>
                        entry !== null &&
                        typeof entry === "object" &&
                        typeof entry.name === "string" &&
                        typeof entry.score === "number" &&
                        Number.isFinite(entry.score)
                );
            }
        } catch {
            highScores = [];
        }

        highScores.sort((a, b) => b.score - a.score);

        const qualifies =
            highScores.length < 10 ||
            score > highScores[9].score;

        if (qualifies) {
            highScores.push({ name, score });

            highScores.sort((a, b) => b.score - a.score);
            highScores = highScores.slice(0, 10);

            localStorage.setItem(
                "highScores",
                JSON.stringify(highScores)
            );

            setIsHighScore(true);
        }
    }, [gameOver, score]);


    // Block generation
    function spawn() {
        const spawnPosition = 3;
        const piece = nextPieces[0];

        if (!piece) return;

        // Check whether the new piece overlaps locked squares
        if (
            piece.squares.some(index =>
                lockedSquares.has(spawnPosition + index)
            )
        ) {
            setGameOver(true);
            return;
        }

        setCurrentPosition(spawnPosition);
        setCurrentBlock(piece.block);
        setCurrentRotation(piece.rotation);
        setCurrent(piece.squares);

        // Remove the spawned piece and add a new piece to the queue
        setNextPieces([
            ...nextPieces.slice(1),
            createRandomPiece(),
        ]);
    }

    // Collision detection
    function willCollide(
        newBlock: number[],
        position: number = currentPosition
    ): boolean {
        // Check if any new block positions are already occupied
        if (
            newBlock.some(index =>
                lockedSquares.has(position + index)
            )
        ) {
            return true;
        }

        // Wrapping from right side to left
        if (
            newBlock.some(index => (position + index) % width === 0) &&
            current.some(index => (currentPosition + index) % width === width - 1)
        ) {
            return true;
        }

        // Wrapping from left side to right
        if (
            newBlock.some(index => (position + index) % width === width - 1) &&
            current.some(index => (currentPosition + index) % width === 0)
        ) {
            return true;
        }

        return false;
    }

    // Left and right movements
    function moveLeft() {
        const atLeftEdge = current.some(
            index => (currentPosition + index) % width === 0
        );

        if (atLeftEdge || willCollide(current, currentPosition - 1)) {
            return;
        }

        setCurrentPosition(position => position - 1);
    }

    function moveRight() {
        const atRightEdge = current.some(
            index => (currentPosition + index) % width === width - 1
        );

        if (atRightEdge || willCollide(current, currentPosition + 1)) {
            return;
        }

        setCurrentPosition(position => position + 1);
    }

    // Rotation movements
    function rotateClockwise() {
        const rotation = (currentRotation + 1) % 4;
        const nextPiece = shapes[currentBlock][rotation];

        if (!willCollide(nextPiece, currentPosition)) {
            setCurrentRotation(rotation);
            setCurrent(nextPiece);
        }
    }

    function rotateCounterClockwise() {
        const rotation = (currentRotation + 3) % 4;
        const nextPiece = shapes[currentBlock][rotation];

        if (!willCollide(nextPiece, currentPosition)) {
            setCurrentRotation(rotation);
            setCurrent(nextPiece);
        }
    }

    // Dropping logic
    function startSoftDrop() {
        setSoftDrop(true);
    }

    function unSoftDrop() {
        setSoftDrop(false);
    }

    // Drop one row
    function dropOneRow() {
        const nextPosition = currentPosition + width;

        const blocked = current.some(index => {
            const nextIndex = nextPosition + index;

            return (
                nextIndex >= 200 ||
                lockedSquares.has(nextIndex)
            );
        });

        if (blocked) {
            const updatedSquares = new Set(lockedSquares);

            current.forEach(index => {
                updatedSquares.add(currentPosition + index);
            });

            const clearedSquares = clearLine(updatedSquares);

            setLockedSquares(clearedSquares);
            spawn();
            return;
        }


        setCurrentPosition(nextPosition);
    }

    function hardDrop() {
        let position = currentPosition;

        while (
            !current.some(index => {
                const nextIndex = position + index + width;

                return (
                    nextIndex >= 200 ||
                    lockedSquares.has(nextIndex)
                );
            })
        ) {
            position += width;
        }

        const updatedSquares = new Set(lockedSquares);

        current.forEach(index => {
            updatedSquares.add(position + index);
        });

        const clearedSquares = clearLine(updatedSquares);

        setLockedSquares(clearedSquares);
        spawn();
    }

    // Clear line & update level + score 
    function clearLine(occupiedSquares: Set<number>): Set<number> {
        let lines = 0;
        const nextSquares = new Set(occupiedSquares);

        // Clear full rows, starting from the bottom
        for (let row = 19; row >= 0; row--) {
            const rowIndices = Array.from(
                { length: width },
                (_, col) => row * width + col
            );

            if (rowIndices.every(index => nextSquares.has(index))) {
                // Remove the completed row and shift rows above it down
                const shiftedSquares = new Set<number>();

                nextSquares.forEach(index => {
                    const squareRow = Math.floor(index / width);

                    // Remove the completed row
                    if (squareRow === row) return;

                    // Shift rows above the cleared row down
                    if (squareRow < row) {
                        shiftedSquares.add(index + width);
                    } else {
                        shiftedSquares.add(index);
                    }
                });

                nextSquares.clear();
                shiftedSquares.forEach(index => nextSquares.add(index));

                lines++;

                // Recheck this row because another row may have shifted into it
                row++;
            }
        }

        if (lines === 0) {
            return nextSquares;
        }

        // Update line count
        const newLineCnt = lineCnt + lines;
        setLineCnt(newLineCnt);

        // Calculate line-dependent points
        let linePoints = 0;

        if (lines === 1) {
            linePoints = 40;
        } else if (lines === 2) {
            linePoints = 100;
        } else if (lines === 3) {
            linePoints = 300;
        } else if (lines >= 4) {
            linePoints = 1200;
        }

        // Apply soft-drop scoring
        let points = linePoints;
        const softDropPoints = linePoints / 10;

        if (softDrop && level < MAX_LEVEL / 2) {
            points -= softDropPoints;
        } else if (softDrop && level >= MAX_LEVEL / 2) {
            points += softDropPoints + level * 20;
        }

        setScore(prev => prev + points);

        // Level up every 10 lines
        if (
            Math.floor(lineCnt / 10) <
            Math.floor(newLineCnt / 10)
        ) {
            setLevel(prev => Math.min(prev + 1, MAX_LEVEL - 1));
        }

        return nextSquares;
    }

    // Player loses
    function lose(
        piece: number[],
        position: number,
        occupied: Set<number>
    ): boolean {
        const hasLost = piece.some(index =>
            occupied.has(position + index)
        );

        if (hasLost) {
            setGameOver(true);
        }

        return hasLost;
    }

    useEffect(() => {

        // Player name
        const name = localStorage.getItem("player");
        setPlayerName(name ?? "");

        // Keybinds
        const savedBinds = localStorage.getItem("binds");

        if (savedBinds) {
            setBinds({ ...defaultBind, ...JSON.parse(savedBinds) });
        }
        setBackgroundColour(localStorage.getItem("boardColour") ?? "#000000");

        // Spawn the first piece
        const blockIndex = Math.floor(Math.random() * shapes.length);
        const rotation = Math.floor(Math.random() * shapes[blockIndex].length);

        setCurrentBlock(blockIndex);
        setCurrentRotation(rotation);
        setCurrent(shapes[blockIndex][rotation]);
        setCurrentPosition(3);
    }, []);

    // Key inputs
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const key = e.key.toLowerCase();

            if (key === "escape") {
                setPaused(value => !value);
                return;
            }

            if (paused) return;

            switch (key) {
                case binds.left.toLowerCase():
                    moveLeft();
                    break;

                case binds.right.toLowerCase():
                    moveRight();
                    break;

                case binds.down.toLowerCase():
                    if (!softDrop) {
                        startSoftDrop();
                    }
                    break;

                case binds.clockwise.toLowerCase():
                    rotateClockwise();
                    break;

                case binds.counterClockwise.toLowerCase():
                    rotateCounterClockwise();
                    break;

                case binds.hard.toLowerCase():
                    hardDrop();
                    break;
            }
        }

        function handleKeyUp(e: KeyboardEvent) {
            if (
                e.key.toLowerCase() === binds.down.toLowerCase() &&
                !paused
            ) {
                unSoftDrop();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [
        binds, 
        paused, 
        softDrop, 
        current, 
        currentPosition, 
        currentBlock, 
        currentRotation, 
        lockedSquares
    ]);
    
    // Automatically drop current piece 
    useEffect(() => {
        if (isGamePaused || gameOver || current.length === 0) return;

        const timerId = window.setInterval(
            dropOneRow,
            softDrop ? dropSpeed / 10 : dropSpeed
        );

        return () => window.clearInterval(timerId);
    }, [
        isGamePaused,
        gameOver,
        softDrop,
        dropSpeed,
        current,
        currentPosition,
        lockedSquares
    ]);

    // Update drop speed on level change
    useEffect(() => {
        let speed: number;

        if (level <= MAX_LEVEL) {
            speed = 1000 - ((level - 1) * 100);
        } else {
            const extraLevels = Math.floor(
                (level - MAX_LEVEL) / 3
            );

            speed = Math.max(100 - extraLevels * 5, 50);
        }

        setDropSpeed(speed);
    }, [level]);

    return (
        <div className="
            relative
            flex
            w-full
            justify-center
        ">
            {/* INFO MODAL */}
            {(paused || gameOver) && (
                <div className={`
                    self-center
                    flex
                    flex-col
                    w-fit
                    h-fit
                    gap-2
                    p-8
                    bg-(--bg)
                    rounded-2xl
                `}>
                    {(paused && !gameOver)&& <h1>Paused</h1>}
                    {gameOver && (
                        <>
                            <h1>Game Over</h1>

                            {isHighScore && (
                                <div className="rounded-lg bg-green-500/20 p-3 text-center">
                                    <h2 className="font-bold text-green-700">
                                        New High Score!
                                    </h2>
                                    <p>You made the top 10 leaderboard!</p>
                                </div>
                            )}
                        </>
                    )}
                    <div>Score: {score}</div>
                    <div>Level: {level}</div>
                    <div>Lines Cleared: {lineCnt}</div>
                    <div className="flex flex-row gap-4 justify-between">
                        {!gameOver && (
                            <>
                                <Button onClick={() => setPaused(value => !value)}>
                                    {paused ?  <PlayIcon size={18}/> : <Pause size={18}/>}
                                </Button>     

                                <DeleteButton
                                    actionName="Quit"
                                    itemName="Game"
                                    action={() => router.push("/")}
                                    onModalChange={(isOpen) => {
                                        setModalOpen(isOpen);

                                        if (isOpen) {
                                            setPaused(true);
                                        }
                                    }}
                                />
                            </>
                    
                        )}

                        {gameOver && (
                            <>
                                <Button onClick={() => window.location.reload()}>
                                    <RotateCcw size={18} />
                                </Button>        

                                <Button variant="red" onClick={() => router.push("/")}>
                                    <LogOut size={18}/>    
                                </Button>                
                            </>

                        )}

                    </div>
                </div>                
            )}


            {/* CENTERED GAME AREA */}
            {!(paused || gameOver) && (
                <Tile className="
                    flex
                    flex-col
                    items-stretch
                    justify-center
                    w-screen
                    sm:w-fit
                    h-fit!
                    gap-4
                    p-4
                    bg-(--bg)
                ">
                    <div className="flex flex-row gap-4 justify-center">
                        <div
                            style={{ backgroundColor: backgroundColour }}
                            className="w-[min(70vw,320px)] sm:w-[min(60vw,360px)] rounded-sm"
                        >
                            <div className="game-grid w-full">
                                {Array.from({ length: 200 }, (_, i) => {
                                    const isCurrent = currentSquares.has(i);
                                    const isLocked = lockedSquares.has(i);

                                    return (
                                        <div
                                            key={i}
                                            className={`rounded-sm ${
                                                isCurrent || isLocked ? "tetromino" : ""
                                            }`}
                                            style={{
                                                backgroundColor: isCurrent
                                                    ? colours[currentBlock]
                                                    : isLocked
                                                        ? "#808080"
                                                        : backgroundColour,
                                            }}
                                        />
                                    );
                                })}


                            </div>                        
                        </div>     

                        {/* NEXT PIECE */}
                        <div className="flex flex-col gap-2 self-stretch">
                            
                            <span className="text-sm font-medium">Next</span>


                            {nextPieces.map((piece, index) => {
                                const previewSquares = new Set(
                                    nextPieceList[piece.block]
                                );

                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-1"
                                    >

                                        <div
                                            className="mini-grid w-[min(17.5vw,80px)] sm:w-[min(15vw,96px)] rounded-sm"
                                            style={{ backgroundColor: backgroundColour }}
                                        >
                                            {Array.from({ length: 16 }, (_, i) => {
                                                const isNext = previewSquares.has(i);

                                                return (
                                                    <div
                                                        key={i}
                                                        className={`rounded-sm ${
                                                            isNext ? "tetromino" : ""
                                                        }`}
                                                        style={{
                                                            backgroundColor: isNext
                                                                ? colours[piece.block]
                                                                : backgroundColour,
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex flex-col w-full">
                                <span>Score: {score}</span>
                                <span>Level: {level}</span>
                                <span>Lines: {lineCnt}</span>
                            </div>    

                            <Button 
                                className="mt-auto w-full"
                                onClick={() => setPaused(value => !value)}
                            >
                                {paused ?  <PlayIcon size={18}/> : <Pause size={18}/>}
                            </Button>     
                        </div>    
                    </div>


                    
               

                        {/* MOBILE BUTTONS */}
                        <div className="
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-3
                            px-1
                            py-3
                            md:hidden
                        ">

                            {/* D-PAD */}
                            <div className="grid w-fit grid-cols-3 justify-items-center">
                                <div />
                                <Button
                                    onClick={hardDrop}
                                    x={2}
                                    y={2}
                                    borderRadius="lg"
                                >
                                    <ArrowUp size={16}/>
                                </Button>
                                <div />

                                <Button
                                    onClick={moveLeft}
                                    x={2}
                                    y={2}
                                    borderRadius="lg"
                                >
                                    <ArrowLeft size={16}/>
                                </Button>
                                <div />


                                <Button
                                    onClick={moveRight}
                                    x={2}
                                    y={2}
                                    borderRadius="lg"
                                >
                                    <ArrowRight size={16}/>
                                </Button>

                                <div />
                                <Button
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        startSoftDrop();
                                    }}
                                    onPointerUp={unSoftDrop}
                                    onPointerLeave={unSoftDrop}
                                    onContextMenu={(e) => e.preventDefault()}
                                    x={2}
                                    y={2}
                                    borderRadius="lg"
                                >
                                    <ArrowDown size={16} />
                                </Button>
                                <div />
                            </div>

                            {/* ROTATION BUTTONS */}
                            <div className="grid w-fit grid-cols-2">
                                <div />

                                <Button
                                    onClick={rotateClockwise}
                                    x={2}
                                    y={2}
                                    borderRadius="lg"
                                >
                                    <RotateCw size={16} />
                                </Button>

                                <Button
                                    onClick={rotateCounterClockwise}
                                    x={2}
                                    y={2}
                                    borderRadius="lg"
                                >
                                    <RotateCcw size={16} />
                                </Button>

                                <div />
                            </div>

                        </div>
                </Tile>                
            )}

        </div>
    );
}