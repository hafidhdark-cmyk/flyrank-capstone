import Link from "next/link";

const HomePage = () => {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">FlyRank AI Capstone</h1>
        <p className="mt-2 text-gray-600">
          Frontend project built with Next.js, React, and Tailwind CSS.
        </p>
      </div>
      <Link
        href="/settings"
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        Open settings
      </Link>
    </main>
  );
};

export default HomePage;
