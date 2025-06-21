"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gamepad2, Users } from 'lucide-react';
import { PLAYER_COLORS } from '@/lib/ludo-constants';
import type { PlayerColor } from '@/components/ludo/LudoGame';

const ALL_COLORS = Object.keys(PLAYER_COLORS) as PlayerColor[];

type PlayerConfig = {
    name: string;
    color: PlayerColor;
};

export default function SetupPage() {
    const router = useRouter();
    const [numPlayers, setNumPlayers] = useState<number>(2);
    const [players, setPlayers] = useState<PlayerConfig[]>([
        { name: 'Player 1', color: 'red' },
        { name: 'Player 2', color: 'blue' },
        { name: 'Player 3', color: 'green' },
        { name: 'Player 4', color: 'yellow' },
    ]);

    const handlePlayerCountChange = (value: string) => {
        setNumPlayers(parseInt(value, 10));
    };

    const handlePlayerChange = (index: number, field: keyof PlayerConfig, value: string) => {
        const newPlayers = [...players];
        newPlayers[index] = { ...newPlayers[index], [field]: value };
        setPlayers(newPlayers);
    };

    const availableColors = (currentIndex: number) => {
        const selectedColors = players
            .slice(0, numPlayers)
            .map((p, i) => i !== currentIndex ? p.color : null)
            .filter(Boolean);
        return ALL_COLORS.filter(c => !selectedColors.includes(c));
    };

    const handleStartGame = () => {
        const gamePlayers = players.slice(0, numPlayers).map(p => ({
            id: p.color,
            name: p.name,
            tokens: [-1, -1, -1, -1],
            state: 'playing' as const
        }));

        const colors = gamePlayers.map(p => p.id);
        if (new Set(colors).size !== colors.length) {
            alert("Each player must have a unique color.");
            return;
        }

        const query = encodeURIComponent(JSON.stringify(gamePlayers));
        router.push(`/game/offline-${Date.now()}?players=${query}`);
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-lg shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <Gamepad2 className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-primary">Ludo Game Setup</CardTitle>
                    <CardDescription>Configure your offline game.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Number of Players</Label>
                        <RadioGroup defaultValue="2" onValueChange={handlePlayerCountChange} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id="p2" />
                                <Label htmlFor="p2">2 Players</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="4" id="p4" />
                                <Label htmlFor="p4">4 Players</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {players.slice(0, numPlayers).map((player, index) => (
                            <div key={index} className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Player {index + 1}</h3>
                                <div className="space-y-2">
                                    <Label htmlFor={`p${index}-name`}>Name</Label>
                                    <Input
                                        id={`p${index}-name`}
                                        value={player.name}
                                        onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                                        placeholder={`Enter name for Player ${index + 1}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`p${index}-color`}>Color</Label>
                                    <Select
                                        value={player.color}
                                        onValueChange={(value) => handlePlayerChange(index, 'color', value)}
                                    >
                                        <SelectTrigger id={`p${index}-color`}>
                                            <SelectValue placeholder="Select a color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableColors(index).map(color => (
                                                <SelectItem key={color} value={color}>
                                                    <span className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-full ${PLAYER_COLORS[color].bg}`}></div>
                                                        {PLAYER_COLORS[color].name}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleStartGame} className="w-full">Start Game</Button>
                </CardContent>
            </Card>
        </main>
    );
}
