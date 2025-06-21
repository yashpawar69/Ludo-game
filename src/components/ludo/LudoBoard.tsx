"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Home, Star, Crown } from 'lucide-react';
import { PLAYER_COLORS, BOARD_LAYOUT, PATH_MAP, HOME_PATH_START_POS, FINISHED_POS } from '@/lib/ludo-constants';

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
        } else if (pos === FINISHED_POS) { // Finished - place in the center
            const homeInfo = BOARD_LAYOUT.find(c => c.type === 'home-finish');
            if (!homeInfo || !homeInfo.itemPositions) return null;
            const playerIndex = players.findIndex(p => p.id === player.id);
            gridPos = homeInfo.itemPositions[playerIndex];
        } else if (pos > HOME_PATH_START_POS) { // Home path
            const homePathIndex = pos - HOME_PATH_START_POS; // 1-5
            const homePathId = `${player.id}-h${homePathIndex}`;
            const cell = BOARD_LAYOUT.find(c => c.id === homePathId);
            if (!cell) return null;
            gridPos = { row: cell.row, col: cell.col };
        } else { // Main path
            const pathCell = PATH_MAP[player.id][pos];
            if (!pathCell) return null;
            gridPos = {row: pathCell.row, col: pathCell.col};
        }

        const isMovable = activePlayer === player.id && movableTokens.includes(tokenIndex);

        return (
          <motion.div
            key={tokenId}
            layoutId={tokenId}
            initial={false}
            animate={{ 
                gridRowStart: gridPos.row, 
                gridColumnStart: gridPos.col,
                zIndex: isMovable ? 30 : 20,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
                "flex items-center justify-center rounded-full h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 border-2 shadow-lg",
                PLAYER_COLORS[player.id].bg,
                PLAYER_COLORS[player.id].border,
                isMovable && "cursor-pointer ring-4 ring-accent ring-offset-background",
                isMovable && "animate-bounce"
            )}
            onClick={() => isMovable && onTokenMove(tokenIndex)}
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
          
          if (type === 'base') {
            return (
              <div key={id} style={style} className={cn('rounded-lg', PLAYER_COLORS[color!].bg, 'flex items-center justify-center p-2')}>
                  <Home className="w-1/2 h-1/2 text-white/50" />
              </div>
            );
          }

          if (type === 'home-finish') {
            return (
              <div key={id} style={style} className={cn('flex items-center justify-center relative')}>
                 <div className={cn("absolute inset-0", PLAYER_COLORS['red'].bg)} style={{clipPath: 'polygon(0 0, 50% 50%, 0 100%)'}}></div>
                 <div className={cn("absolute inset-0", PLAYER_COLORS['green'].bg)} style={{clipPath: 'polygon(0 0, 100% 0, 50% 50%)'}}></div>
                 <div className={cn("absolute inset-0", PLAYER_COLORS['yellow'].bg)} style={{clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)'}}></div>
                 <div className={cn("absolute inset-0", PLAYER_COLORS['blue'].bg)} style={{clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)'}}></div>
                 <Crown className="w-1/2 h-1/2 text-accent relative z-10" />
              </div>
            );
          }
          
          if (type === 'path' || type === 'home-path') {
            const pathColor = type === 'path' ? 'bg-card' : PLAYER_COLORS[color!].lightBg;
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
