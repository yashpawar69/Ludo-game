"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, Home, Crown } from 'lucide-react';
import { PLAYER_COLORS, FINISHED_POS } from '@/lib/ludo-constants';

type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';
type Player = {
  id: PlayerColor;
  name: string;
  tokens: number[];
  state: 'waiting' | 'playing' | 'won';
};

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export function PlayerCard({ player, isActive }: PlayerCardProps) {
  const tokensInBase = player.tokens.filter(p => p === -1).length;
  const tokensFinished = player.tokens.filter(p => p === FINISHED_POS).length;

  return (
    <Card className={cn('transition-all duration-300', isActive ? 'shadow-lg ring-2 ring-accent' : 'shadow-md')}>
      <CardHeader className={cn("p-3 rounded-t-lg", PLAYER_COLORS[player.id].bg)}>
        <CardTitle className="flex items-center gap-2 text-primary-foreground text-base">
          <User className="w-5 h-5" />
          <span className="truncate">{player.name}</span>
          {player.state === 'won' && <Crown className="w-5 h-5 text-accent" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm flex justify-around">
        <div className="flex items-center gap-1" title="Tokens in base">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span>{tokensInBase}</span>
        </div>
        <div className="flex items-center gap-1" title="Tokens finished">
          <Crown className="w-4 h-4 text-muted-foreground" />
          <span>{tokensFinished}</span>
        </div>
      </CardContent>
    </Card>
  );
}
