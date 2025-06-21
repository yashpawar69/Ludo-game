"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Home, Star } from 'lucide-react';
import { PLAYER_COLORS, BOARD_LAYOUT, PATH_MAP } from '@/lib/ludo-constants';

type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
type Player = {
  id: PlayerColor;
  tokens: number[];
};

interface LudoBoardProps {
  players: Player[];
  activePlayer: PlayerColor;
  movableTokens: number[];
  onTokenMove: (tokenIndex: number) => void;
}

export function LudoBoard({ players, activePlayer, movableTokens, onTokenMove }: LudoBoardProps) {

  const renderTokens = () => {
    return players.flatMap(player => 
      player.tokens.map((pos, tokenIndex) => {
        const tokenId = `${player.id}-${tokenIndex}`;
        let gridPos;

        if (pos === -1) { // In base
          const baseInfo = BOARD_LAYOUT.find(c => c.type === 'base' && c.color === player.id);
          if (!baseInfo || !baseInfo.itemPositions) return null;
          gridPos = baseInfo.itemPositions[tokenIndex];
        } else if (pos >= 101 && pos <= 106) { // Home path
          const homePathId = `${player.id}-h${pos - 100}`;
          const cell = BOARD_LAYOUT.find(c => c.id === homePathId);
          if (!cell) return null;
          gridPos = { row: cell.row, col: cell.col };
        } else if (pos >= 0 && pos <= 51) { // Main path
            const pathCell = PATH_MAP[player.id][pos];
            if (!pathCell) return null;
            gridPos = {row: pathCell.row, col: pathCell.col};
        } else { // Finished
          return null;
        }

        const isMovable = activePlayer === player.id && movableTokens.includes(tokenIndex);

        return (
          <motion.div
            key={tokenId}
            layoutId={tokenId}
            initial={false}
            animate={{ gridRow: gridPos.row, gridColumn: gridPos.col }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
                "flex items-center justify-center rounded-full h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 z-20 border-2 shadow-lg",
                PLAYER_COLORS[player.id].bg,
                PLAYER_COLORS[player.id].border,
                isMovable && "cursor-pointer ring-4 ring-accent ring-offset-2",
                isMovable && "animate-bounce"
            )}
            onClick={() => onTokenMove(tokenIndex)}
            style={{ gridRow: gridPos.row, gridColumn: gridPos.col }}
          >
             <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-white/50"></div>
          </motion.div>
        );
      })
    );
  };
  
  return (
    <div className="relative aspect-square w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] p-2 bg-muted rounded-lg shadow-inner">
      <div className="grid grid-cols-15 grid-rows-15 w-full h-full gap-px">
        {BOARD_LAYOUT.map(cell => {
          const { type, color, id, row, col, span, isSafe } = cell;
          const style = { gridRow: `${row} / span ${span?.row || 1}`, gridColumn: `${col} / span ${span?.col || 1}` };
          
          if (type === 'base' || type === 'home-finish') {
            return (
              <div key={id} style={style} className={cn('rounded-lg', PLAYER_COLORS[color!].bg, 'flex items-center justify-center p-2')}>
                  {type === 'base' && <Home className="w-1/2 h-1/2 text-white/50" />}
                  {type === 'home-finish' && <div className={cn("w-full h-full flex items-center justify-center", PLAYER_COLORS[color!].darkBg)}> <Crown className="w-1/2 h-1/2 text-accent" /> </div>}
              </div>
            );
          }
          
          if (type === 'path' || type === 'home-path') {
            const pathColor = type === 'path' ? 'bg-white' : PLAYER_COLORS[color!].lightBg;
            return (
              <div key={id} style={style} className={cn('rounded-sm', pathColor, 'flex items-center justify-center')}>
                {isSafe && <Star className="w-3/4 h-3/4 text-muted-foreground/30" />}
              </div>
            );
          }
          
          return <div key={id} style={style} />;
        })}
        {renderTokens()}
      </div>
    </div>
  );
}
