"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { LudoBoard } from './LudoBoard';
import { PlayerCard } from './PlayerCard';
import { Dice } from './Dice';
import { Gamepad2, Home, LogOut, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
type Player = {
  id: PlayerColor;
  name: string;
  tokens: number[]; // -1: base, 0-51: main path, 101-105: home path, 106: finished
  state: 'waiting' | 'playing' | 'won';
};

const initialPlayers: Player[] = [
  { id: 'red', name: 'Player 1', tokens: [-1, -1, -1, -1], state: 'playing' },
  { id: 'green', name: 'Player 2', tokens: [-1, -1, -1, -1], state: 'playing' },
  { id: 'yellow', name: 'Player 3', tokens: [-1, -1, -1, -1], state: 'playing' },
  { id: 'blue', name: 'Player 4', tokens: [-1, -1, -1, -1], state: 'playing' },
];

export function LudoGame({ roomId }: { roomId: string }) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [activePlayer, setActivePlayer] = useState<PlayerColor>('red');
  const [diceValue, setDiceValue] = useState<number | null>(6);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const { toast } = useToast();

  const movableTokens = useMemo(() => {
    if (!diceValue) return [];
    // Simplified logic: for now, any token can move.
    // A real implementation would check for valid moves.
    const player = players.find(p => p.id === activePlayer);
    if (!player) return [];

    return player.tokens.map((pos, index) => {
      if (pos === -1 && diceValue !== 6) return -1;
      if (pos === 106) return -1; // Cannot move finished tokens
      return index;
    }).filter(i => i !== -1);
  }, [diceValue, activePlayer, players]);

  const handleDiceRoll = (value: number) => {
    setDiceValue(value);
    setIsRolling(false);
    toast({
      title: `You rolled a ${value}!`,
      description: value === 6 ? "You get an extra turn." : "Select a token to move.",
    });
    // If no moves are possible, automatically switch turn after a delay
  };

  const handleTokenMove = (tokenIndex: number) => {
    if (!diceValue || !movableTokens.includes(tokenIndex)) return;
  
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      const playerIndex = newPlayers.findIndex(p => p.id === activePlayer);
      const player = newPlayers[playerIndex];
      const currentPos = player.tokens[tokenIndex];
  
      // Simplified move logic
      if (currentPos === -1 && diceValue === 6) {
        player.tokens[tokenIndex] = 0; // Starting position (will be mapped to player's start)
      } else if (currentPos !== -1) {
        let newPos = currentPos + diceValue;
        // Simple win condition
        if (newPos > 51) {
          player.tokens[tokenIndex] = 106; // Finished
        } else {
          player.tokens[tokenIndex] = newPos;
        }
      }
  
      // Check for win
      if (player.tokens.every(p => p === 106)) {
        player.state = 'won';
        setWinner(player.id);
      }
  
      return newPlayers;
    });
  
    // Switch turn if not a 6
    if (diceValue !== 6) {
      const currentPlayerIndex = initialPlayers.findIndex(p => p.id === activePlayer);
      const nextPlayerIndex = (currentPlayerIndex + 1) % initialPlayers.length;
      setActivePlayer(initialPlayers[nextPlayerIndex].id);
    }
  
    setDiceValue(null);
  };
  
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground p-4 gap-4">
      <header className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary hidden sm:block">Ludo Lounge</h1>
        </div>
        <div className="text-center">
            <h2 className="text-lg font-semibold">Room: {roomId}</h2>
            <p className={cn("text-lg font-bold capitalize", 
                activePlayer === 'red' && 'text-red-500',
                activePlayer === 'green' && 'text-green-500',
                activePlayer === 'yellow' && 'text-yellow-500',
                activePlayer === 'blue' && 'text-blue-500',
            )}>
                {activePlayer}'s Turn
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/lobby"><Home className="mr-2 h-4 w-4"/> Lobby</Link>
            </Button>
            <Button variant="destructive" asChild>
                <Link href="/"><LogOut className="mr-2 h-4 w-4"/> Quit</Link>
            </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 min-h-0">
        <div className="w-full lg:w-auto lg:h-full flex items-center justify-center">
             <LudoBoard
                players={players}
                activePlayer={activePlayer}
                movableTokens={movableTokens}
                onTokenMove={handleTokenMove}
            />
        </div>

        <aside className="w-full lg:w-80 lg:h-full flex flex-col gap-4 flex-shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-4">
            {players.map(player => (
                <PlayerCard key={player.id} player={player} isActive={activePlayer === player.id} />
            ))}
            </div>
             <Dice
                isRolling={isRolling}
                onRoll={handleDiceRoll}
                value={diceValue}
                activePlayerColor={activePlayer}
                disabled={isRolling || !!winner || diceValue !== null}
            />
        </aside>
      </div>

       <AlertDialog open={!!winner}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-3xl font-bold text-accent capitalize flex items-center justify-center gap-2">
              <Crown className="w-8 h-8"/> {winner} Wins!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Congratulations to {players.find(p=>p.id === winner)?.name}!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button className="w-full" asChild>
                <Link href="/lobby">Back to Lobby</Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
