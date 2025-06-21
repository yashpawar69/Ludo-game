"use client";

import { cn } from '@/lib/utils';
import { User, Crown } from 'lucide-react';
import { FINISHED_POS } from '@/lib/ludo-constants';
import type { Player } from './LudoGame';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

const getTokenStatus = (pos: number) => {
    if (pos === -1) return "In Base";
    if (pos === FINISHED_POS) return "Finished";
    return "On Board";
}

export function PlayerCard({ player, isActive }: PlayerCardProps) {

  return (
    <div className={cn(
        'p-2 rounded-lg shadow-lg border-2 transition-all duration-300',
        {
            'bg-red-500': player.id === 'red',
            'bg-green-500': player.id === 'green',
            'bg-yellow-400': player.id === 'yellow',
            'bg-blue-500': player.id === 'blue',
        },
        isActive ? `ring-4 ring-offset-2 ring-accent ring-offset-background` : {
            'border-red-700': player.id === 'red',
            'border-green-700': player.id === 'green',
            'border-yellow-600': player.id === 'yellow',
            'border-blue-700': player.id === 'blue',
        }
    )}>
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/50">
                    <User className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-white truncate">{player.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                    {player.tokens.map((pos, i) => (
                        <div key={i} 
                             className={cn(
                                "w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center",
                                pos === -1 ? 'bg-black/20' : ''
                             )}
                             title={`Token ${i+1} status: ${getTokenStatus(pos)}`}>
                            {pos === FINISHED_POS && <Crown className="w-3 h-3 text-white" />}
                            {pos > -1 && pos < FINISHED_POS && <div className={cn("w-2.5 h-2.5 rounded-full", {
                                'bg-red-700': player.id === 'red',
                                'bg-green-700': player.id === 'green',
                                'bg-yellow-600': player.id === 'yellow',
                                'bg-blue-700': player.id === 'blue',
                            })}/>}
                        </div>
                    ))}
                </div>
            </div>
             {player.state === 'won' && <Crown className="w-6 h-6 text-yellow-400 flex-shrink-0 animate-pulse" />}
        </div>
    </div>
  );
}
