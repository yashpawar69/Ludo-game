"use client";

import { LudoGame, type Player } from '@/components/ludo/LudoGame';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function GamePageContent({ roomId }: { roomId: string }) {
    const searchParams = useSearchParams();
    const playersParam = searchParams.get('players');
    
    let initialPlayers: Player[] | null = null;
    
    if (playersParam) {
        try {
            initialPlayers = JSON.parse(decodeURIComponent(playersParam));
        } catch (error) {
            console.error("Failed to parse players from URL", error);
        }
    }

    if (!initialPlayers || initialPlayers.length === 0) {
        return (
            <div className="w-screen h-screen bg-background flex flex-col items-center justify-center gap-4 p-4 text-center">
                <h1 className="text-2xl font-bold text-destructive">Error Loading Game</h1>
                <p className="text-muted-foreground">Could not start the game due to invalid player data. Please return to the setup screen.</p>
                <Button asChild>
                  <Link href="/">Back to Setup</Link>
                </Button>
            </div>
        )
    }

    return <LudoGame roomId={roomId} initialPlayers={initialPlayers} />;
}
