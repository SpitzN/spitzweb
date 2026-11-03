# Two UI registers on one token system

spitzweb has to look professional where people get work done and creative where it shows Nadav's work. So it uses two registers on one shared token system in `DESIGN.md`:

| Surface | Register | Impeccable mode | Built from |
| --- | --- | --- | --- |
| Admin panel | Professional | Operate | shadcn/ui on Base UI, with variants added to each primitive's `cva` |
| Articles, Entry lists, Activity | Professional | Read | Project components on the shared tokens |
| Home, Project pages, Hosted projects | Creative | Experience or Persuade | Custom components; may add their own tokens and per-folder lint exceptions |

Both registers meet the same UI floor (`.claude/rules/ui.md`): tokens, WCAG 2.2 AA and the required states.

## Considered Options

- **One register everywhere**: either the creative pages end up looking like a dashboard, or the Admin panel ends up as an art piece.
- **Separate design systems per register**: two sets of tokens drift apart, and the site stops reading as one place.

## Consequences

- Each surface's register is recorded in its Impeccable surface brief. A new surface picks a register before it is designed.
- Rules specific to a register are added to `.claude/rules/` once Impeccable sets the visual direction.
