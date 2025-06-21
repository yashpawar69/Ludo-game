"use client";

import { LudoGame, type Player } from '@/components/ludo/LudoGame';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function GamePageContent({ roomId }: { roomId: string }) {
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


export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <main className="w-screen h-screen bg-background overflow-hidden">
        <Suspense fallback={
             <div className="w-screen h-screen bg-background flex items-center justify-center p-4">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    <Skeleton className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-lg" />
                    <div className="flex flex-col gap-4">
                        <Skeleton className="w-80 h-48 rounded-lg" />
                        <Skeleton className="w-80 h-32 rounded-lg" />
                    </div>
                </div>
            </div>
        }>
            <GamePageContent roomId={params.id} />
        </Suspense>
    </main>
  );
}
