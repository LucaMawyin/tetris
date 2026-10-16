"use client";

import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import { defaultBind } from "@/lib/keybinds";
import { Pause } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Default values
const MAX_LEVEL = 10;
let level = 1;
let dropSpeed = 1000;
let score = 0;
let lineCnt = 0;
let previousLineCnt = 0;
const width = 10;
let timerId;

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


export default function Play(){

    const router = useRouter();

    const [playerName, setPlayerName] = useState("");
    const [paused, setPaused] = useState(false);

    // Keybinds
    let binds = JSON.parse(
        localStorage.getItem("binds") ?? JSON.stringify(defaultBind)
    );
    let backgroundColour = localStorage.getItem("colour");

    // Position variables
    let currentPosition;
    let currentBlock;
    let currentRotation;
    let current;
    let nextBlock = Math.floor(Math.random()*shapes.length);
    let nextRotation = Math.floor(Math.random()*shapes[nextBlock].length);
    let nextPiece = shapes[nextBlock][nextRotation];

    // Block generation
    const spawn = () => {

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


    useEffect(() => {
        const name = localStorage.getItem("player");
        setPlayerName(name ?? "");
    }, []);    

    return (
        <div className="
            relative
            flex
            w-full
            justify-center
        ">
            {/* INFO MODAL */}
            <div className="
                absolute
                left-[20%]
                flex
                flex-col
                w-fit
                h-fit
                gap-2
                p-8
                bg-(--bg)
                rounded-2xl
            ">
                {paused && <h1>Paused</h1>}
                <h3>Score: <span id="score">0</span></h3>
                <h3>Level: <span id="level">1</span></h3>
                <h3>Lines Cleared: <span id="lines">0</span></h3>
                <div className="flex flex-row gap-4">
                    <Button>
                        <Pause size={18}/>
                    </Button>
                    <DeleteButton
                        actionName="Quit"
                        itemName="Game"
                        action={() => router.push("/")}
                    />
                </div>
            </div>

            {/* CENTERED GAME AREA */}
            <div className="flex items-start gap-5">
                <div className="grid">
                    {Array.from({ length: 200 }, (_, i) => (
                        <div 
                            key={i} 
                            className="rounded-sm"
                        />
                    ))}
                    {Array.from({ length: 10 }, (_, i) => (
                        <div
                            key={`bottom-${i}`}
                            className="taken"
                            id={i === 0 ? "bottom" : undefined}
                        />
                    ))}
                </div>

                {/* NEXT PIECE */}
                <div className="mini-grid" id="next-piece">
                    {Array.from({ length: 16 }, (_, i) => (
                        <div key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}