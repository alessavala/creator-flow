// A tiny, dependency-free renderer for the handful of markdown constructs
// blog content actually uses (## / ###, **bold**, [links](url), "- " lists,
// blank-line paragraphs). Avoids pulling in a markdown library whose React
// 19 / RSC compatibility hasn't been checked against this app's bleeding-edge
// Next.js version - this is a pure function, safe in a server component.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      parts.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-foreground">
          {match[1]}
        </strong>,
      );
    } else {
      parts.push(
        <a
          key={`${keyPrefix}-a-${i++}`}
          href={match[3]}
          target={match[3].startsWith("http") ? "_blank" : undefined}
          rel={match[3].startsWith("http") ? "noreferrer" : undefined}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {match[2]}
        </a>,
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function MarkdownLite({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/);
  return (
    <div className="flex flex-col gap-4 text-[15px] leading-[1.65] text-foreground">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        if (lines[0].startsWith("### ")) {
          return (
            <h3 key={i} className="mt-2 text-lg font-bold tracking-[-0.02em]">
              {renderInline(lines[0].slice(4), `h3-${i}`)}
            </h3>
          );
        }
        if (lines[0].startsWith("## ")) {
          return (
            <h2 key={i} className="mt-4 text-[21px] font-bold tracking-[-0.03em]">
              {renderInline(lines[0].slice(3), `h2-${i}`)}
            </h2>
          );
        }
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="flex flex-col gap-2 pl-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{renderInline(l.slice(2), `li-${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(lines.join(" "), `p-${i}`)}</p>;
      })}
    </div>
  );
}
