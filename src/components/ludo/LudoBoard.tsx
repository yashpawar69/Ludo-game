"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Star, ArrowUp, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
import { BOARD_LAYOUT, PATH_MAP, HOME_PATH_START_POS, FINISHED_POS, START_INDICES } from '@/lib/ludo-constants';
import type { PlayerColor, Player } from './LudoGame';
import { Dice } from './Dice';

interface DiceProps {
  onRoll: (value: number) => void;
  value: number | null;
  activePlayerColor: PlayerColor;
  disabled: boolean;
}

interface LudoBoardProps {
  players: Player[];
  activePlayer: PlayerColor;
  movableTokens: number[];
  onTokenMove: (tokenIndex: number) => void;
  diceProps: DiceProps;
}

export function LudoBoard({ players, activePlayer, movableTokens, onTokenMove, diceProps }: LudoBoardProps) {

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
            // Tokens that are finished will be visually represented on the player card, not the board center.
            return null;
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
                "flex items-center justify-center rounded-full h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 border-4 shadow-lg",
                {
                    'bg-red-500 border-red-700': player.id === 'red',
                    'bg-green-500 border-green-700': player.id === 'green',
                    'bg-yellow-400 border-yellow-600': player.id === 'yellow',
                    'bg-blue-500 border-blue-700': player.id === 'blue',
                },
                isMovable && "cursor-pointer ring-4 ring-accent ring-offset-background",
                isMovable && "animate-bounce"
            )}
            onClick={() => isMovable && onTokenMove(tokenIndex)}
          >
             <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-white/70 border border-black/20"></div>
          </motion.div>
        );
      })
    );
  };

  const renderArrows = () => {
    const redStart = PATH_MAP.red[0];
    const greenStart = PATH_MAP.green[0];
    const yellowStart = PATH_MAP.yellow[0];
    const blueStart = PATH_MAP.blue[0];
    const arrowBaseClass = "w-4 h-4 z-10 place-self-center pointer-events-none";

    return (
        <>
            <ArrowUp style={{gridRow: redStart.row, gridColumn: redStart.col}} className={cn(arrowBaseClass, "text-white")} />
            <ArrowRight style={{gridRow: greenStart.row, gridColumn: greenStart.col}} className={cn(arrowBaseClass, "text-white")} />
            <ArrowDown style={{gridRow: yellowStart.row, gridColumn: yellowStart.col}} className={cn(arrowBaseClass, "text-black")} />
            <ArrowLeft style={{gridRow: blueStart.row, gridColumn: blueStart.col}} className={cn(arrowBaseClass, "text-white")} />
        </>
    )
  }
  
  return (
    <div className="relative aspect-square w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] p-2 bg-card rounded-lg shadow-inner">
      <div className="grid grid-cols-15 grid-rows-15 w-full h-full gap-px">
        {BOARD_LAYOUT.map(cell => {
          const { type, color, id, row, col, span, isSafe } = cell;
          const style = { gridRow: `${row} / span ${span?.row || 1}`, gridColumn: `${col} / span ${span?.col || 1}` };
          
          if (type === 'base') {
            return (
              <div key={id} style={style} className={cn('rounded-lg flex items-center justify-center p-1', {
                  'bg-red-500': color === 'red',
                  'bg-green-500': color === 'green',
                  'bg-yellow-400': color === 'yellow',
                  'bg-blue-500': color === 'blue',
              })}>
                 <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full bg-black/20 rounded-md p-2">
                    <div className="bg-white/80 rounded-full border-2 border-white/90"></div>
                    <div className="bg-white/80 rounded-full border-2 border-white/90"></div>
                    <div className="bg-white/80 rounded-full border-2 border-white/90"></div>
                    <div className="bg-white/80 rounded-full border-2 border-white/90"></div>
                </div>
              </div>
            );
          }

          if (type === 'home-finish') {
            return (
              <div key={id} style={style} className={cn('flex items-center justify-center relative bg-card/50')}>
                 <div className="absolute inset-0 bg-red-400" style={{clipPath: 'polygon(0 0, 50% 50%, 0 100%)'}}></div>
                 <div className="absolute inset-0 bg-green-400" style={{clipPath: 'polygon(0 0, 100% 0, 50% 50%)'}}></div>
                 <div className="absolute inset-0 bg-yellow-300" style={{clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)'}}></div>
                 <div className="absolute inset-0 bg-blue-400" style={{clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)'}}></div>
                 <div className="relative z-10">
                    <Dice {...diceProps} />
                 </div>
              </div>
            );
          }
          
          if (type === 'path' || type === 'home-path') {
            const starColor = type === 'path' ? 'text-gray-400' : 'text-white/50';
            const isRedStart = id === `path-main-${START_INDICES.red}`;
            const isGreenStart = id === `path-main-${START_INDICES.green}`;
            const isYellowStart = id === `path-main-${START_INDICES.yellow}`;
            const isBlueStart = id === `path-main-${START_INDICES.blue}`;
            const isStart = isRedStart || isGreenStart || isYellowStart || isBlueStart;
            
            return (
              <div key={id} style={style} className={cn('rounded-sm flex items-center justify-center', 
                {
                  'bg-white': type === 'path' && !isStart,
                  'bg-red-400': (type === 'home-path' && color === 'red') || isRedStart,
                  'bg-green-400': (type === 'home-path' && color === 'green') || isGreenStart,
                  'bg-yellow-300': (type === 'home-path' && color === 'yellow') || isYellowStart,
                  'bg-blue-400': (type === 'home-path' && color === 'blue') || isBlueStart,
                }
              )}>
                {isSafe && <Star className={cn("w-3/4 h-3/4", isStart ? 'text-white/80' : starColor)} />}
              </div>
            );
          }
          
          return <div key={id} style={style} />;
        })}
        {renderTokens()}
        {renderArrows()}
      </div>
    </div>
  );
}
