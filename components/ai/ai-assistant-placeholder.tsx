export function AiAssistantPlaceholder() {
  return (
    <div className="rounded-2xl bg-white/5 border border-dashed border-white/20 p-4 text-xs text-muted-foreground">
      <p className="font-medium mb-1">AI Assistant (coming soon)</p>
      <p>
        Ask questions like “How much did I spend on food last month?” or “Can I safely
        increase my SIP by 5k?”. Responses will run locally, using your data.
      </p>
    </div>
  );
}
