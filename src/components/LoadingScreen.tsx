export default function LoadingScreen({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-sand-200 flex flex-col items-center justify-center gap-6">
      <img src="/logo7.png" alt="Laksor" style={{ height: 56, width: "auto", objectFit: "contain", maxWidth: 180 }} />
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-bronze-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
        <p className="text-xs text-charcoal-400 font-medium">{message}</p>
      </div>
    </div>
  );
}
