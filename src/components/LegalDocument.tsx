import { Fragment, type ReactNode } from 'react';

// Shows a legal text file with real headings and lists. The text is not
// changed; only how it looks.
//
// File format:
// - Line 1 is the title, line 2 is "Last Updated: ...".
// - "1. Section name" lines are section headings.
// - Lines that start with "* " or "- " are bullet items.
// - A short all-caps line (like "ACCEPTANCE") is a heading too.
// - Lines with no blank line between them stay in one paragraph.

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'paragraph'; lines: string[] };

function parse(text: string) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const title = (lines[0] ?? '').trim().replace(/^Wiggle\s+/, '');
  const updated = (lines[1] ?? '').trim();
  const blocks: Block[] = [];
  let list: string[] | null = null;
  let paragraph: string[] | null = null;

  const close = () => {
    if (list) blocks.push({ kind: 'list', items: list });
    if (paragraph) blocks.push({ kind: 'paragraph', lines: paragraph });
    list = null;
    paragraph = null;
  };

  for (const raw of lines.slice(2)) {
    const line = raw.trim();
    if (!line) {
      close();
      continue;
    }
    if (/^\d+\.\s+\S/.test(line) && line.length < 90) {
      close();
      blocks.push({ kind: 'heading', text: line });
      continue;
    }
    if (/^[A-Z][A-Z &]{3,40}$/.test(line)) {
      close();
      blocks.push({ kind: 'heading', text: line.charAt(0) + line.slice(1).toLowerCase() });
      continue;
    }
    const bullet = line.match(/^[*-]\s+(.+)$/);
    if (bullet) {
      if (paragraph) close();
      list = list ?? [];
      list.push(bullet[1]);
      continue;
    }
    if (list) close();
    paragraph = paragraph ?? [];
    paragraph.push(line);
  }
  close();
  return { title, updated, blocks };
}

// Puts the defined term or label at the start of a line in bold:
// “Affiliate” means..., User Data (Clinic Staff): ..., Ownership. ...
function withLabel(text: string): ReactNode {
  const patterns = [
    /^(“[^”]{1,60}”(?: or “[^”]{1,20}”)?)(.*)$/,
    /^([A-Z][^:.]{1,55}:)(\s.*)$/,
    /^([A-Z][A-Za-z&/ ,-]{2,50}\.)(\s.+)$/,
  ];
  for (const [index, pattern] of patterns.entries()) {
    const match = text.match(pattern);
    if (!match) continue;
    if (index === 2 && match[1].split(/\s+/).length > 6) continue;
    return (
      <>
        <strong className="font-semibold text-slate-950 dark:text-white">{match[1]}</strong>
        {match[2]}
      </>
    );
  }
  return text;
}

export default function LegalDocument({ text }: { text: string }) {
  const { title, updated, blocks } = parse(text);

  return (
    <article className="text-[15px] leading-[1.7] text-gray-700 sm:text-base dark:text-[hsl(0,0%,83%)]">
      <h1 className="mb-1.5 text-2xl font-bold leading-tight text-slate-950 sm:text-[32px] dark:text-white">
        {title}
      </h1>
      <p className="mb-7 text-sm text-gray-500 dark:text-[hsl(0,0%,60%)]">{updated}</p>
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          return (
            <h2
              key={index}
              className="mb-2.5 mt-8 text-[17px] font-bold leading-snug text-slate-950 sm:mb-3 sm:mt-10 sm:text-xl dark:text-white"
            >
              {block.text}
            </h2>
          );
        }
        if (block.kind === 'list') {
          return (
            <ul key={index} className="mb-4 flex list-disc flex-col gap-2 pl-[22px]">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1">
                  {withLabel(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="mb-4">
            {block.lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {withLabel(line)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </article>
  );
}
