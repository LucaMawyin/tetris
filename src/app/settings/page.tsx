"use client";

import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import Tile from "@/components/Tile";
import { defaultBind } from "@/lib/keybinds";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const defaultColour = "#000000";

export default function Settings(){

    const router = useRouter();

    const [binds, setBinds] = useState(defaultBind);
    const [activeBind, setActiveBind] = useState<keyof typeof defaultBind | null>(null);
    const [boardColour, setBoardColour] = useState(defaultColour);

    useEffect(() => {
        const savedBinds = localStorage.getItem("binds");
        const savedColour = localStorage.getItem("boardColour");

        if (savedBinds) {
            setBinds({ ...defaultBind, ...JSON.parse(savedBinds) });
        }

        if (savedColour) {
            setBoardColour(savedColour);
        }
    }, []);

    const handleBindChange = (
        key: keyof typeof defaultBind,
        value: string
    ) => {
        const updated = { ...binds, [key]: value };

        setBinds(updated);
        localStorage.setItem("binds", JSON.stringify(updated));
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        key: keyof typeof defaultBind
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const value = e.key.toLowerCase();

        if (["control", "alt", "meta"].includes(value)) return;

        handleBindChange(key, value);
        setActiveBind(null);
        e.currentTarget.blur();
    };

    const formatKey = (key: string) => {
        const names: Record<string, string> = {
            arrowup: "↑",
            arrowdown: "↓",
            arrowleft: "←",
            arrowright: "→",
            " ": "Space",
            escape: "Esc",
        };

        return names[key] ?? key.toUpperCase();
    };

    return (
        <Tile className="
            [&_input]:cursor-pointer
            [&_input]:min-w-0
            [&_div]:flex
            [&_div]:flex-row
            [&_div]:items-center
            [&_div]:gap-4
        ">
            <div>
                <p>Move Left:</p>
                <input
                    id="left"
                    value={activeBind === "left" ? "Press a key..." : formatKey(binds.left)}
                    readOnly
                    onFocus={() => setActiveBind("left")}
                    onBlur={() => setActiveBind(null)}
                    onKeyDown={(e) => handleKeyDown(e, "left")}
                />
            </div>
            
            <div>
                <p>Move Right:</p>     
                <input
                    id="right"
                    value={activeBind === "right" ? "Press a key..." : formatKey(binds.right)}
                    readOnly
                    onFocus={() => setActiveBind("right")}
                    onBlur={() => setActiveBind(null)}
                    onKeyDown={(e) => handleKeyDown(e, "right")}
                />           
            </div>

            <div>
                <p>Soft Drop:</p>                
                <input 
                    id="down"
                    value={activeBind === "down" ? "Press a key..." : formatKey(binds.down)}
                    readOnly
                    onFocus={() => setActiveBind("down")}
                    onBlur={() => setActiveBind(null)}
                    onKeyDown={(e) => handleKeyDown(e, "down")}
                />
            </div>

            <div>
                <p>Hard Drop:</p>
                <input 
                    id="hard"
                    value={activeBind === "hard" ? "Press a key..." : formatKey(binds.hard)}
                    readOnly
                    onFocus={() => setActiveBind("hard")}
                    onBlur={() => setActiveBind(null)}
                    onKeyDown={(e) => handleKeyDown(e, "hard")}
                />
            </div>

            <div>
                <p>Rotate Clockwise:</p>  
                <input 
                    id="clockwise"
                    value={activeBind === "clockwise" ? "Press a key..." : formatKey(binds.clockwise)}
                    readOnly
                    onFocus={() => setActiveBind("clockwise")}
                    onBlur={() => setActiveBind(null)}
                    onKeyDown={(e) => handleKeyDown(e, "clockwise")}
                />
            </div>

            <div>
                <p>Rotate Counter Clockwise:</p>
                <input 
                    id="counterClockwise"
                    value={activeBind === "counterClockwise" ? "Press a key..." : formatKey(binds.counterClockwise)}
                    readOnly
                    onFocus={() => setActiveBind("counterClockwise")}
                    onBlur={() => setActiveBind(null)}
                    onKeyDown={(e) => handleKeyDown(e, "counterClockwise")}
                />
            </div>

            <div>
                <label htmlFor="backgroundColour">Board Colour:</label>
                <input
                    type="color"
                    id="backgroundColour"
                    value={boardColour}
                    onChange={(e) => {
                        const colour = e.target.value;
                        setBoardColour(colour);
                        localStorage.setItem("boardColour", colour);
                    }}
                    className="p-1!"
                />
            </div>


            <div className="flex w-full justify-between">
                <Button
                    onClick={() => router.push("/")}
                >
                    <House size={18}/>
                </Button>
                <DeleteButton
                    actionName="Reset"
                    itemName="Settings"
                    action={() => {
                        setBinds(defaultBind);
                        setActiveBind(null);
                        setBoardColour(defaultColour);

                        localStorage.removeItem("binds");
                        localStorage.removeItem("boardColour");
                    }}
                />
            </div>
        </Tile>
    );
}