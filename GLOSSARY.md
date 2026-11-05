# spitzweb

Nadav Spitzer's personal site: the things Nadav builds, writes and is doing, for developers, hiring managers and potential clients. Names are plain and self-explanatory; the site has no governing metaphor.

## Site structure

**Entry**:
A dated piece of content Nadav publishes over time. Every Entry has an Entry type and a publication state, and appears in Activity. Every Entry but an Update has Topics.
_Avoid_: Post, Piece, Item, Document, Content (as a countable noun)

**Entry type**:
The kind an Entry is (for example Article or Update). The set of Entry types grows over time.
_Avoid_: Content type, Collection, Category

**Feature**:
A standing part of the site that is not published as an Entry, such as Activity, search, a contact form or a tool.
_Avoid_: Section, Module, Page (as a domain term)

**Featured**:
A mark Nadav puts by hand on a few Entries so they are shown first, ahead of the chronological order.
_Avoid_: Pinned, Highlighted, Starred

**Topic**:
A subject from one small, curated set shared by all Entry types, used to gather everything Nadav has done on that subject.
_Avoid_: Tag, Category, Label

## Entry types

**Project**:
An Entry presenting something Nadav built, together with the story of how and why it was built.
_Avoid_: Experiment, Lab, Build, Work, Portfolio item

**Hosted project**:
A Project that Nadav runs as part of spitzweb, from a small interactive demo to a full app, wherever on spitzweb it is served.
_Avoid_: Live project, Experiment, Demo

**External project**:
A Project that spitzweb does not run (client work, a job, open source hosted elsewhere), presented as a case study with links out.
_Avoid_: Case study (as a concept; it is only how the page reads), Client project

**Status**:
Whether a Project is In progress or Complete, independent of its publication state. Only Projects have a Status.
_Avoid_: Stage, Maturity, Phase

**Article**:
A written Entry that stands on its own rather than telling the story of one Project: opinions, how-tos, lessons, reviews.
_Avoid_: Post, Blog post, Essay, Writing, Note

**Update**:
A one- or two-line Entry saying what Nadav is doing right now. An Update is Published the moment it is posted and is never a Draft, Unlisted or Archived; it can only be edited or deleted. It has no Topics, so posting one takes a line of text and, optionally, a link.
_Avoid_: Status, Note, Tweet, Log line

**Related entries**:
Entries Nadav has linked to each other by hand; the link shows on both Entries.
_Avoid_: References, See also, Links

## Publication

**Draft**:
The state of an Entry that only Nadav can see.

**Unlisted**:
The state of an Entry that is live at its URL for anyone with the link but appears in no list, Activity, search or sitemap.
_Avoid_: Hidden, Private, Preview

**Published**:
The state of an Entry that is public and listed everywhere.
_Avoid_: Live, Public

**Archived**:
The state of a once-Published Entry that stays public, labelled as no longer maintained, and drops out of the main lists.
_Avoid_: Deleted, Retired, Deprecated

**Admin panel**:
Nadav's private controls for running the site, such as posting Updates. It is not part of the site visitors see.
_Avoid_: Sandbox, Dashboard, Backoffice

## Activity

**Activity**:
The chronological stream of what Nadav is doing, made of Updates and Events, newest first; whatever is at the top is the current focus.
_Avoid_: Now, Feed, Log, Timeline, Stream (in the ActivityPub sense an "Activity" is an action; revisit if the site ever federates)

**Event**:
Something that happened and was recorded in Activity automatically, such as an Entry being Published, a Project's Status changing, or activity on Nadav's GitHub.
_Avoid_: Action, Notification, Activity (for a single occurrence)
