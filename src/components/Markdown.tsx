import React from "react";

// Renderizador markdown minimalista (server component) —
// suporta: h2/h3, negrito, código inline, listas, listas
// numeradas, tabelas, blockquotes e blocos de código.

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code key={`${keyPrefix}-c${i}`} className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-[0.85em] text-gold-400">
          {tok.slice(1, -1)}
        </code>
      );
    } else {
      const label = tok.slice(1, tok.indexOf("]"));
      const href = tok.slice(tok.indexOf("(") + 1, -1);
      nodes.push(
        <a key={`${keyPrefix}-l${i}`} href={href} target="_blank" rel="noopener noreferrer" className="text-gold-400 underline decoration-gold-400/40 hover:decoration-gold-400">
          {label}
        </a>
      );
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // bloco de código
    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre key={key++} className="my-4 overflow-x-auto rounded-xl border border-ink-600 bg-ink-900 p-4 text-[13px] leading-relaxed text-neon-400">
          <code>{buf.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // tabela
    if (line.trim().startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim());
        i++;
      }
      const cells = (r: string) =>
        r
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim());
      const header = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      blocks.push(
        <div key={key++} className="my-5 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {header.map((h, hi) => (
                  <th key={hi} className="border-b border-ink-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gold-400">
                    {inline(h, `th${key}-${hi}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri} className="align-top">
                  {r.map((c, ci) => (
                    <td key={ci} className="border-b border-ink-700/60 px-3 py-2 text-ink-100/90">
                      {inline(c, `td${key}-${ri}-${ci}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // blockquote
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={key++} className="my-4 rounded-r-xl border-l-4 border-gold-500 bg-ink-800/60 px-5 py-3 text-[15px] italic text-ink-100/90">
          {inline(buf.join(" "), `bq${key}`)}
        </blockquote>
      );
      continue;
    }

    // headings
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="mb-2 mt-7 text-lg font-bold text-white">
          {inline(line.slice(4), `h3-${key}`)}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="mb-3 mt-9 text-2xl font-extrabold tracking-tight text-white">
          {inline(line.slice(3), `h2-${key}`)}
        </h2>
      );
      i++;
      continue;
    }

    // listas
    if (/^[-*]\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-3 space-y-1.5 pl-1">
          {items.map((it, ii) => (
            <li key={ii} className="flex gap-2.5 text-[15px] text-ink-100/90">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-500" />
              <span>{inline(it, `li${key}-${ii}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="my-3 space-y-1.5">
          {items.map((it, ii) => (
            <li key={ii} className="flex gap-2.5 text-[15px] text-ink-100/90">
              <span className="flex-none font-mono text-xs font-bold text-gold-500">{ii + 1}.</span>
              <span>{inline(it, `ol${key}-${ii}`)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // parágrafo
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith(">") &&
      !/^[-*]\s/.test(lines[i].trim()) &&
      !/^\d+\.\s/.test(lines[i].trim())
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="my-3 text-[15.5px] leading-relaxed text-ink-100/85">
        {inline(buf.join(" "), `p${key}`)}
      </p>
    );
  }

  return <div className="max-w-none">{blocks}</div>;
}
