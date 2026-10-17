"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Tile from "@/components/Tile";
import { House } from "lucide-react";

type HighScore = {
    name: string;
    score: number;
};

export default function HighScores() {
    const router = useRouter();
    const [highScores, setHighScores] = useState<HighScore[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("highScores");

            if (saved) {
                const parsed: unknown = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    const validScores = parsed.filter(
                        (entry): entry is HighScore =>
                            entry !== null &&
                            typeof entry === "object" &&
                            typeof entry.name === "string" &&
                            typeof entry.score === "number" &&
                            Number.isFinite(entry.score)
                    );

                    validScores.sort((a, b) => b.score - a.score);
                    setHighScores(validScores.slice(0, 10));
                }
            }
        } catch {
            setHighScores([]);
        }
    }, []);

    return (
        <Tile>
                <h1>High Scores</h1>
                <div>
                    <div className="grid grid-cols-[0.5fr_2fr_1fr] gap-4 border-b border-slate-400 p-4 font-bold">
                        <span>Rank</span>
                        <span>Player</span>
                        <span className="text-right">Score</span>
                    </div>

                    {highScores.length > 0 ? (
                        highScores.map((entry, index) => (
                            <div
                                key={`${entry.name}-${entry.score}-${index}`}
                                className="grid grid-cols-[0.5fr_2fr_1fr] gap-4 border-b border-slate-300 p-4 last:border-b-0"
                            >
                                <span>{index + 1}</span>
                                <span>{entry.name.toUpperCase()}</span>
                                <span className="text-right font-semibold">
                                    {entry.score.toLocaleString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="p-6 text-center">
                            No high scores yet. Play a game to get on the leaderboard!
                        </p>
                    )}                    
                </div>


            <div className="">
                <Button onClick={() => router.push("/")}>
                    <House size={18}/>
                </Button>
            </div>
        </Tile>
    );
}