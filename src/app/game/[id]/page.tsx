import { LudoGame } from '@/components/ludo/LudoGame';

export default function GamePage({ params }: { params: { id: string } }) {
  return (
    <main className="w-screen h-screen bg-background overflow-hidden">
      <LudoGame roomId={params.id} />
    </main>
  );
}
