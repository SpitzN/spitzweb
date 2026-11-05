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

/** The year of an Entry's YYYY-MM-DD date, machine-readable, for Entries dated by their year. */
export function EntryYear({ date }: { date: string }) {
  const year = date.slice(0, 4);
  return <time dateTime={year}>{year}</time>;
}
