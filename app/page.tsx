import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="max-w-xl space-y-8">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          ScheduleMe
        </h1>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Sign In
          </Link>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          A schedule manager
        </p>
      </div>
    </div>
  );
}
