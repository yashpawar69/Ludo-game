"use client";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/lobby');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Gamepad2 className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Ludo Lounge</CardTitle>
          <CardDescription>Log in to roll the dice!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline text-primary">
              Sign up
            </Link>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
             <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 74.3C309 107 281.4 96 248 96c-88.8 0-160.1 71.1-160.1 160.1S159.2 416.2 248 416.2c37.6 0 71.7-11.8 98.6-31.4l74.9 69.1c-43.2 39.2-99.7 62.2-161.5 62.2C110.8 512 0 401.2 0 265.2S110.8 18 248 18c130.6 0 231.2 96.7 231.2 228.6 0 14.3-.4 28.3-1.2 42.4H248v-94.8h139.6c5.8 32.3 8.3 65.8 8.3 99.8z"></path></svg>
            Login with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
