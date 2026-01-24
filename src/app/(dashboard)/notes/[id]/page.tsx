export default function NoteDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Note Detail</h1>
      <p>Note ID: {params.id}</p>
    </div>
  );
}
