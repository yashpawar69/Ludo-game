import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { GamePageContent } from './game-page-content';

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
