"use client";

import Button from "@/components/Button";
import Tile from "@/components/Tile";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const content = [
    [
        "Move left or right to change where the blocks are falling",
        "NOTE: Blocks can also be rotated (clockwise or counter clockwise)",
    ],
    [
        "Use the down key (binded with settings) to soft drop",
    ],
    [
        "Refer to the preceding image for mobile controls",
    ],
    [
        "Points depend on level and lines cleared. The more the better",
        "NOTE: Blocks fall faster at higher levels",
    ],
    [
        "Keybinds and board colour can be modified in settings",
    ],
    [
        "Good luck and have fun :)"
    ],

]

export default function HowToPlay(){

    const [step, setStep] = useState(0);
    const router = useRouter();

    return (
        <Tile>    
            <h1>How to Play</h1>
            <img src={`/images/how-to-play-${step + 1}.png`}/>
            <div className="flex flex-col gap-2 text-lg">
                {content[step].map((text, i) => (
                    <p key={i}>{text}</p>
                ))}
            </div>
            <div className="flex flex-row justify-between">
                <Button
                    borderRadius="lg"
                    onClick={() => {
                        if (step === 0) {
                            router.push("/");
                            return;
                        };
                        setStep(step - 1);
                    }}
                >
                    {step === 0 ? (
                        <House size={18}/>
                    ) : (
                        <ArrowLeft size={18}/>
                    )}
                </Button>
                <Button
                    borderRadius="lg"
                    onClick={() => {
                        if (step === content.length - 1){
                            router.push("/");
                            return;
                        };
                        setStep(step + 1);
                    }}
                >
                    {step === content.length - 1 ? (
                        <House size={18}/>
                    ) : (
                        <ArrowRight size={18}/>
                    )}
                </Button>
            </div>
        </Tile>
    );
}