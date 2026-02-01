import Link from 'next/link';

export default function NotesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">Create and manage your notes</p>
        </div>
        <Link
          href="/notes/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
        >
          <span className="text-xl">➕</span>
          <span className="font-medium">New Note</span>
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No notes yet
        </h2>
        <p className="text-gray-600 mb-6">
          Get started by creating your first note!
        </p>
        <Link
          href="/notes/new"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Your First Note
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📄</div>
            <div>
              <p className="text-gray-600 text-sm">Total Notes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔗</div>
            <div>
              <p className="text-gray-600 text-sm">Shared Notes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏷️</div>
            <div>
              <p className="text-gray-600 text-sm">Tags</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
