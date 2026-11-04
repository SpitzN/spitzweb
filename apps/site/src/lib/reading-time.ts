const WORDS_PER_MINUTE = 230;

/** Whole minutes to read `wordCount` words, rounded up and never below one. */
export function readingMinutes(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
