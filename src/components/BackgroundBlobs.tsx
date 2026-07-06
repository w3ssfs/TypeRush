export default function BackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-blob-a absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent-blue/20 blur-3xl" />
      <div className="bg-blob-b absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-accent-green/10 blur-3xl" />
      <div className="bg-blob-a absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent-yellow/10 blur-3xl" />
    </div>
  );
}
