import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Welcome to NoteApp
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Your personal note-taking app with powerful features like tagging, sharing, and image support.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
