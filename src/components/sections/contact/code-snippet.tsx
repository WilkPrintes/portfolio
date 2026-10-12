import type { ReactNode } from "react";
import { Window } from "@/components/ui/window";

const Keyword = ({ children }: { children: string }) => <span className="text-[#c792ea]">{children}</span>;
const Str = ({ children }: { children: string }) => <span className="text-ok">&quot;{children}&quot;</span>;
const Fn = ({ children }: { children: string }) => <span className="text-[#82aaff]">{children}</span>;

type CodeSnippetProps = {
  role: string;
  email: string;
  comment: string;
};

/** Fake `contact.ts` file whose lines are "typed" in by the parent section. */
export function CodeSnippet({ role, email, comment }: CodeSnippetProps) {
  const lines: ReactNode[] = [
    <>
      <Keyword>const</Keyword> next = <Keyword>await</Keyword> <Fn>contact</Fn>({"{"}
    </>,
    <>
      {"  "}name: <Str>Wilk Printes</Str>,
    </>,
    <>
      {"  "}role: <Str>{role}</Str>,
    </>,
    <>
      {"  "}stack: [<Str>React</Str>, <Str>TypeScript</Str>, <Str>Next.js</Str>],
    </>,
    <>
      {"  "}email: <Str>{email}</Str>,
    </>,
    <>{"});"}</>,
    <>
      <span className="text-muted">{comment}</span>
    </>,
  ];

  return (
    <Window data-code-window className="ticks bg-ink shadow-2xl shadow-black/50">
      <Window.Bar>
        <Window.Title>contact.ts</Window.Title>
      </Window.Bar>
      <Window.Body className="overflow-x-auto text-[13px] leading-7 text-foreground sm:text-sm">
        <pre>
          {lines.map((line, index) => (
            <div key={index} data-code-line className="flex">
              <span className="mr-5 w-4 shrink-0 text-right text-muted/50 select-none">{index + 1}</span>
              <span className="whitespace-pre">{line}</span>
            </div>
          ))}
          <div className="flex">
            <span className="mr-5 w-4 shrink-0 text-right text-muted/50 select-none">{lines.length + 1}</span>
            <span className="blink text-accent">▍</span>
          </div>
        </pre>
      </Window.Body>
    </Window>
  );
}
