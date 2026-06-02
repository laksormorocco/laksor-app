"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>Error</h1>
      <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
}
