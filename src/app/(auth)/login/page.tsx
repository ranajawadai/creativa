"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-heading font-bold text-xl">
              C
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Creativa account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full" size="lg">Sign In</Button>
          <p className="text-sm text-center text-muted">
            No account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
