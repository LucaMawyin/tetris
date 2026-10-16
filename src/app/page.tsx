"use client";

import Button from "@/components/Button";
import { useNotifications } from "@/components/NotificationProvider";
import Tile from "@/components/Tile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

    const [playerName, setPlayerName] = useState<string>("");

    const { notify } = useNotifications();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(playerName);

        if (!playerName) {
            notify("Please enter initials","error");
            return;
        }

        router.push("/play");
    };

    useEffect(() => {
        const name = localStorage.getItem("player");
        setPlayerName(name ?? "");
    }, []);    
	
    return (

        <Tile>
            <h1 className="
                flex
                text-[clamp(3rem,20vw,5rem)]!
                font-bold
                text-shadow-md
                text-shadow-black 
                w-fit
                h-fit
                mx-auto
            ">
                <span className="text-red-600">T</span>
                <span className="text-orange-600">E</span>
                <span className="text-yellow-600">T</span>
                <span className="text-green-600">R</span>
                <span className="text-blue-600">I</span>
                <span className="text-purple-600">S</span>
            </h1>

            <form
                onSubmit={handleSubmit}
                className="
                    flex 
                    flex-col 
                    gap-4 
                    pb-4 
                    border-b 
                    border-slate-300
                "
            >
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="initials"
                        className="text-sm font-semibold text-slate-700"
                    >
                        Enter Initials
                    </label>

                    <input
                        id="initials"
                        name="initials"
                        type="text"
                        maxLength={3}
                        value={playerName}
                        onChange={(e) => {
                            const name = e.target.value;
                            setPlayerName(name);
                            localStorage.setItem("player", name);
                        }}
                        placeholder="ABC"
                        className="w-full"
                    />
                </div>

                <Button
                    text="Play"
                    x={0}
                    y={0}
                    className="w-full"
                    borderRadius="lg"
                    onClick={handleSubmit}
                />
            </form>

            <div className="
                flex 
                flex-col
                gap-2
                text-2xl
                
            ">
                <div className="flex flex-col gap-1 text-lg font-bold tracking-wide">
                    <HeroLink
                        text="HIGH SCORES"
                        href="/high-scores"
                    />
                    <HeroLink
                        text="HOW TO PLAY"
                        href="/how-to-play"
                    />
                    <HeroLink
                        text="SETTINGS"
                        href="/settings"
                    />
                    <HeroLink
                        text="SOURCE CODE"
                        href="https://github.com/LucaMawyin/tetris_new"
                        target="_blank"
                    />
                </div>
            </div>
        </Tile>
	);
}

function HeroLink(props : {
    text: string,
    href : string,
    target?: "_blank" | null,
    className?: string,
}){

    return (
        <a  
            href={props.href} 
            rel="noopener noreferrer"
            target={props.target ?? ""}
            className={`
                rounded-lg
                px-3
                py-2
                text-slate-700
                transition-colors,
                hover:bg-slate-300
                hover:text-slate-950
                ${props.className}
            `}
        >
            {props.text}
        </a>
    );
}