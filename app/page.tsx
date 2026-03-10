import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-3)] px-6">
      <Card className="w-full max-w-md text-center bg-[var(--brand-4)]">
        <CardContent className="space-y-6 p-10 ">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={90}
            priority
            className="mx-auto"
          />
          <p className="text-sm text-muted-foreground">
            A straightforward schedule manager
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
