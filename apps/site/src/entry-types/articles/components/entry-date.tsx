const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** An Entry's YYYY-MM-DD date, written out for reading (4 Nov 2026) and machine-readable. */
export function EntryDate({ date }: { date: string }) {
  return <time dateTime={date}>{DATE_FORMAT.format(new Date(date))}</time>;
}
