import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Gamepad2, PlusCircle, Users, LogOut } from 'lucide-react';
import Link from "next/link";

const rooms = [
  { id: 'alpha-g4m3', name: 'Beginner\'s Luck', players: 2, maxPlayers: 4, status: 'Waiting' },
  { id: 'beta-g4m3', name: 'Pro Players Only', players: 3, maxPlayers: 4, status: 'Waiting' },
  { id: 'gamma-g4m3', name: 'Weekend Fun', players: 4, maxPlayers: 4, status: 'In Progress' },
  { id: 'delta-g4m3', name: 'Chill & Chat', players: 1, maxPlayers: 2, status: 'Waiting' },
];

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="male avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">LudoPlayer1</p>
            <p className="text-xs leading-none text-muted-foreground">
              player1@ludo.io
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function LobbyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 border-b bg-card">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Ludo Lounge</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
             <Link href={`/game/new-${Date.now()}`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Room
             </Link>
          </Button>
          <UserMenu />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <h2 className="text-3xl font-semibold mb-6">Available Rooms</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rooms.map(room => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="truncate">{room.name}</CardTitle>
                <CardDescription className={`font-semibold ${room.status === 'Waiting' ? 'text-green-500' : 'text-yellow-500'}`}>{room.status}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{room.players} / {room.maxPlayers} Players</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" disabled={room.status === 'In Progress'}>
                  <Link href={`/game/${room.id}`}>Join Room</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
