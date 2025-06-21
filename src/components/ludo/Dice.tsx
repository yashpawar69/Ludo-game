"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAYER_COLORS } from '@/lib/ludo-constants';
import type { PlayerColor } from './LudoGame';


interface DiceProps {
  onRoll: (value: number) => void;
  value: number | null;
  activePlayerColor: PlayerColor;
  disabled: boolean;
}

const diceIcons = [
  <Dice1 key={1} className="w-full h-full" />,
  <Dice2 key={2} className="w-full h-full" />,
  <Dice3 key={3} className="w-full h-full" />,
  <Dice4 key={4} className="w-full h-full" />,
  <Dice5 key={5} className="w-full h-full" />,
  <Dice6 key={6} className="w-full h-full" />,
];

export function Dice({ onRoll, value, activePlayerColor, disabled }: DiceProps) {
    const [isRolling, setIsRolling] = useState(false);
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        if (!isRolling) {
            setDisplayValue(value);
        }
    }, [value, isRolling]);

    const handleRoll = () => {
        if (disabled || isRolling) return;
        setIsRolling(true);

        let rollCount = 0;
        const rollInterval = setInterval(() => {
            setDisplayValue(Math.floor(Math.random() * 6) + 1);
            rollCount++;
            if (rollCount > 10) { // Roll for a bit
                clearInterval(rollInterval);
                const finalValue = Math.floor(Math.random() * 6) + 1;
                onRoll(finalValue); // Call parent once with the final value
                setIsRolling(false);
            }
        }, 80);
    };

    const currentDisplayValue = isRolling ? displayValue : value;

    return (
        <div className="flex flex-col items-center justify-center gap-4 p-4 bg-card rounded-lg shadow-md">
            <motion.div
                className="w-24 h-24 p-2 rounded-lg text-foreground"
                animate={{
                    rotate: isRolling ? 360 : 0,
                    scale: isRolling ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {currentDisplayValue ? diceIcons[currentDisplayValue - 1] : <div className="w-full h-full border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground">?</div>}
            </motion.div>
            <Button
                onClick={handleRoll}
                disabled={disabled || isRolling}
                className={cn(
                    "w-full text-lg font-bold",
                    !disabled && PLAYER_COLORS[activePlayerColor].bg,
                    !disabled && `hover:${PLAYER_COLORS[activePlayerColor].darkBg}`,
                    "text-primary-foreground"
                )}
            >
                {isRolling ? <RotateCw className="mr-2 h-5 w-5 animate-spin" /> : null}
                {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>
        </div>
    );
}
