/**
 * A component's props with `className` narrowed to a string of layout classes (ADR 0016). Base UI
 * also takes a function of the part's state there, which `cn` can't merge and lint can't read; a
 * caller's className only places the part, so it never needs the state. `undefined` is allowed
 * so a wrapper can pass its own optional className straight through.
 */
export type LayoutClassNameProps<Props> = Omit<Props, "className"> & {
  className?: string | undefined;
};
