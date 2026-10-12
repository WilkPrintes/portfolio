/*
 * Splits text into spans with React instead of mutating the DOM (like GSAP's SplitText),
 * so re-renders such as a language switch stay safe. Animate `[data-char]` / `[data-word]`.
 */

export function SplitChars({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <span aria-label={text} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} aria-hidden="true" className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, charIndex) => (
            <span key={charIndex} data-char className="inline-block will-change-transform">
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

export function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <span aria-label={text} className={className}>
      {words.map((word, index) => (
        <span key={index} aria-hidden="true" className="inline-block overflow-hidden pb-1 align-bottom">
          <span data-word className="inline-block will-change-transform">
            {word}
            {index < words.length - 1 && " "}
          </span>
        </span>
      ))}
    </span>
  );
}
