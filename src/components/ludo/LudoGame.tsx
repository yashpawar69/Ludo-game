"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LudoBoard } from './LudoBoard';
import { PlayerCard } from './PlayerCard';
import { Dice } from './Dice';
import { Gamepad2, Crown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { PATH_MAP, isSafeSquare, START_POS, HOME_PATH_START_POS, FINISHED_POS } from '@/lib/ludo-constants';

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
export type Player = {
  id: PlayerColor;
  name: string;
  tokens: number[]; // -1: base, 0-50: main path, 51-55: home path, 56: finished
  state: 'waiting' | 'playing' | 'won';
};

const getNextPlayerId = (currentId: PlayerColor, playerIds: PlayerColor[]): PlayerColor => {
    const currentIndex = playerIds.indexOf(currentId);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    return playerIds[nextIndex];
};

export function LudoGame({ roomId, initialPlayers }: { roomId: string, initialPlayers: Player[] }) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [activePlayerId, setActivePlayerId] = useState<PlayerColor>(initialPlayers[0]?.id || 'red');
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [movableTokens, setMovableTokens] = useState<number[]>([]);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const { toast } = useToast();

  const activePlayerIds = useMemo(() => initialPlayers.map(p => p.id), [initialPlayers]);
  const activePlayer = useMemo(() => players.find(p => p.id === activePlayerId)!, [players, activePlayerId]);

  const switchToNextPlayer = useCallback(() => {
    setDiceValue(null);
    setMovableTokens([]);
    setActivePlayerId(getNextPlayerId(activePlayerId, activePlayerIds));
  }, [activePlayerId, activePlayerIds]);

  const getMovableTokensForPlayer = useCallback((player: Player, roll: number): number[] => {
    const movable: number[] = [];
    const playerTokens = player.tokens;
    
    playerTokens.forEach((pos, tokenIndex) => {
        // Token is finished
        if (pos === FINISHED_POS) return;

        // Token in base
        if (pos === -1) {
            if (roll === 6) {
                // Check if start square is blocked by own token
                const startPos = START_POS;
                const startSquareIsBlocked = playerTokens.some(p => p === startPos);
                if (!startSquareIsBlocked) {
                    movable.push(tokenIndex);
                }
            }
            return;
        }

        // Token on home path
        if (pos > HOME_PATH_START_POS) {
            if (pos + roll <= FINISHED_POS) {
                movable.push(tokenIndex);
            }
            return;
        }

        // Token on main path
        const newPos = pos + roll;
        // Check if it can move without overshooting home path
        if (newPos <= FINISHED_POS) {
             movable.push(tokenIndex);
        }
    });

    return movable;
  }, []);

  const handleDiceRoll = useCallback((value: number) => {
    setDiceValue(value);
    
    const movable = getMovableTokensForPlayer(activePlayer, value);
    setMovableTokens(movable);

    toast({
        title: `${activePlayer.name} rolled a ${value}!`,
        description: movable.length > 0 ? "Select a token to move." : "No available moves.",
    });

    if (movable.length === 0) {
        setTimeout(() => {
            if (value !== 6) {
                switchToNextPlayer();
            } else {
                setDiceValue(null); // Allow re-roll on 6 even with no moves
            }
        }, 1500);
    }
  }, [activePlayer, getMovableTokensForPlayer, switchToNextPlayer, toast]);

  const handleTokenMove = (tokenIndex: number) => {
    if (!diceValue || !movableTokens.includes(tokenIndex)) return;

    let grantExtraTurn = false;
    
    const newPlayers = JSON.parse(JSON.stringify(players)) as Player[];
    const playerToMove = newPlayers.find(p => p.id === activePlayerId)!;
    const currentPos = playerToMove.tokens[tokenIndex];

    let newPos: number;

    if (currentPos === -1) { // Move from base
        newPos = START_POS;
    } else {
        newPos = currentPos + diceValue;
    }

    playerToMove.tokens[tokenIndex] = newPos;

    // Capture logic
    if (newPos <= HOME_PATH_START_POS) {
        const targetGridPos = PATH_MAP[playerToMove.id][newPos];
        if (!isSafeSquare(targetGridPos)) {
            newPlayers.forEach(p => {
                if (p.id !== playerToMove.id) {
                    p.tokens = p.tokens.map((tokenPos, tIdx) => {
                        if (tokenPos > -1 && tokenPos <= HOME_PATH_START_POS) {
                            const opponentGridPos = PATH_MAP[p.id][tokenPos];
                            if (opponentGridPos.row === targetGridPos.row && opponentGridPos.col === targetGridPos.col) {
                                toast({ title: "Capture!", description: `${playerToMove.name} captured ${p.name}'s token!` });
                                grantExtraTurn = true;
                                return -1; // Send back to base
                            }
                        }
                        return tokenPos;
                    });
                }
            });
        }
    }

    // Check for win
    if (playerToMove.tokens.every(p => p === FINISHED_POS)) {
        playerToMove.state = 'won';
        setWinner(playerToMove.id);
        grantExtraTurn = false; // Game over
    } else if (newPos === FINISHED_POS) {
        grantExtraTurn = true;
        toast({ title: "Home Safe!", description: `${playerToMove.name} got a token home!` });
    }

    setPlayers(newPlayers);
    setMovableTokens([]);

    if (diceValue === 6) {
        grantExtraTurn = true;
    }

    if (grantExtraTurn && !winner) {
        setDiceValue(null); // Allow re-roll
    } else if (!winner) {
        switchToNextPlayer();
    }
  };
  
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground p-4 gap-4">
      <header className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary hidden sm:block">Ludo Game</h1>
        </div>
        <div className="text-center">
            <h2 className="text-xl font-semibold capitalize">
                {activePlayer.name}'s Turn
            </h2>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
                <Link href="/"><RotateCcw className="mr-2 h-4 w-4"/> New Game</Link>
            </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 min-h-0">
        <div className="w-full lg:w-auto lg:h-full flex items-center justify-center">
             <LudoBoard
                players={players}
                activePlayer={activePlayerId}
                movableTokens={movableTokens}
                onTokenMove={handleTokenMove}
            />
        </div>

        <aside className="w-full lg:w-80 lg:h-full flex flex-col gap-4 flex-shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-4">
            {initialPlayers.map(p_config => players.find(p => p.id === p_config.id)!).map(player => (
                <PlayerCard key={player.id} player={player} isActive={activePlayerId === player.id} />
            ))}
            </div>
             <Dice
                onRoll={handleDiceRoll}
                value={diceValue}
                activePlayerColor={activePlayerId}
                disabled={isRolling || !!winner || diceValue !== null}
            />
        </aside>
      </div>

       <AlertDialog open={!!winner}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-3xl font-bold text-accent capitalize flex items-center justify-center gap-2">
              <Crown className="w-8 h-8"/> {players.find(p=>p.id === winner)?.name} Wins!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Congratulations! What a master of the dice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button className="w-full" asChild>
                <Link href="/">Play Again</Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
