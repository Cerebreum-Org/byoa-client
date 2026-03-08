interface Props {
  typingUsers: string[];
}

export function TypingIndicator({ typingUsers }: Props) {
  if (typingUsers.length === 0) return null;

  let text: string;
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  } else if (typingUsers.length <= 4) {
    const last = typingUsers[typingUsers.length - 1];
    const rest = typingUsers.slice(0, -1).join(", ");
    text = `${rest} and ${last} are typing...`;
  } else {
    text = "Several people are typing...";
  }

  return (
    <div className="px-4 h-6 flex items-center gap-2 text-xs text-zinc-400">
      <span className="flex gap-0.5 items-end h-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      <span>{text}</span>
    </div>
  );
}
