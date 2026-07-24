## ADDED Requirements

### Requirement: Canonical content source
The system SHALL maintain a single `src/content.json` file as the sole authoritative source for the factual skeleton shared across all experiences: profile/positioning, career stops, projects (featured and legacy), skills, education, and contact. Factual values that appear in more than one experience SHALL be defined once in `content.json` and never duplicated as literals across pages.

#### Scenario: A fact is defined once
- **WHEN** a factual value (a job title, a project's tech stack, a quantified stat, a URL, the contact email) is needed by one or more experiences
- **THEN** it exists as a keyed value in `content.json`
- **AND** no experience page hard-codes that value as a literal outside the generated output

#### Scenario: A factual edit propagates from one place
- **WHEN** a fact is changed in `content.json` and the build is run
- **THEN** every experience that references that fact reflects the new value
- **AND** no manual edit to any experience source is required for the change to take effect

### Requirement: Content schema
`content.json` SHALL conform to a documented schema covering: `profile` (name, positioning line, years-of-experience, contact: email, github, linkedin, site); `career` as an ordered list of stops, each with a stable key and fields for company, role/title, location, start and end dates, and any quantified facts; `projects` as an ordered list, each with a stable key and fields for name, year, tech stack (list), URL (nullable), a headline stat, and a `featured` vs `legacy` classification; `skills` grouped by category; and `education` as an ordered list. Every entity that an experience references SHALL be addressable by a stable key that does not change when list ordering changes.

#### Scenario: Stable keys survive reordering
- **WHEN** the order of career stops or projects changes in `content.json`
- **THEN** each entity retains its stable key
- **AND** template token references to those keys continue to resolve to the same entities

#### Scenario: Legacy classification is explicit
- **WHEN** a project is added to `content.json`
- **THEN** it declares whether it is `featured` or `legacy`
- **AND** experiences use that classification rather than hard-coding which projects are archived

### Requirement: Build-time injection into self-contained output
The system SHALL provide a build step that reads `content.json` and per-experience templates and emits the final experience pages into `src/` with all referenced facts substituted as literal text. Generated pages SHALL remain fully self-contained (inline CSS/JS, no external asset requests), openable via `file://`, and SHALL carry the injected facts as literal content in the served markup rather than fetching or rendering them at runtime.

#### Scenario: Facts are present in served markup
- **WHEN** a generated experience page is served and inspected without executing JavaScript
- **THEN** the shared facts (name, current role, project names and stacks, contact) are present as literal text in the HTML

#### Scenario: Output remains self-contained
- **WHEN** a generated experience page is opened directly via `file://`
- **THEN** it renders its content without a network request for content data

#### Scenario: No runtime content fetch
- **WHEN** a generated experience page loads
- **THEN** it does not fetch `content.json` or any content resource over the network

### Requirement: Tokens resolve inside voiced prose
Templates SHALL reference shared facts by token, and the build SHALL substitute tokens wherever they appear — including inside theme-voiced sentences, HTML attributes, and JavaScript string literals within `<script>` blocks. A theme's re-voiced prose SHALL be authored in its template while any fact embedded in that prose is expressed as a token, so that changing the underlying fact updates every voicing without editing prose.

#### Scenario: An embedded fact updates every voice
- **WHEN** a fact that appears inside re-voiced prose in multiple experiences (for example a migration's source/target versions, or a percentage) is changed in `content.json` and the build is run
- **THEN** each experience's voiced sentence reflects the new value
- **AND** no prose is hand-edited to achieve the update

#### Scenario: Context-aware escaping
- **WHEN** a fact value contains characters significant to its surrounding context (an ampersand, angle bracket, or apostrophe in HTML text, an HTML attribute, or a JS string literal)
- **THEN** the injected value is escaped for that context
- **AND** the generated page remains valid HTML and executable JavaScript

### Requirement: Voice remains template-owned
The system SHALL keep per-theme prose voicing and per-theme presentation data (glyphs, layout positions, path fractions, accent colors) in the experience templates, not in `content.json`. `content.json` SHALL contain only theme-neutral facts.

#### Scenario: content.json holds no voiced prose
- **WHEN** `content.json` is inspected
- **THEN** it contains factual values only
- **AND** it contains no theme-specific sentences, metaphors, or presentation values

#### Scenario: Re-voicing stays independent per experience
- **WHEN** one experience's wording or presentation is rewritten in its template
- **THEN** no other experience and `content.json` are affected

### Requirement: Build integrity
The build SHALL fail loudly rather than emit a page with missing or malformed content. An unknown token (no matching key in `content.json`), or any unresolved `{{…}}` marker remaining in generated output, SHALL cause the build to error and SHALL NOT produce a served page.

#### Scenario: Unknown token fails the build
- **WHEN** a template references a token whose key does not exist in `content.json`
- **THEN** the build errors and identifies the offending token
- **AND** no generated page is written for that experience

#### Scenario: No stray markers ship
- **WHEN** the build completes
- **THEN** no generated page contains an unresolved `{{…}}` marker

### Requirement: Generated output is verifiable against source
Because generated pages are committed and served, the system SHALL provide a way to detect that a generated page is stale or was hand-edited. A verification step SHALL rebuild from templates and `content.json` and compare against the committed generated pages, reporting a failure when they differ. Each generated page SHALL carry a header comment identifying it as generated and naming its source.

#### Scenario: Hand-edited generated file is detected
- **WHEN** a generated `src/*.html` is edited directly and verification is run
- **THEN** verification reports that the file differs from its rebuilt source

#### Scenario: Stale output is detected
- **WHEN** `content.json` or a template changes but the generated pages are not rebuilt, and verification is run
- **THEN** verification reports the generated pages as out of date

### Requirement: Non-regression of experiences
Converting an experience to the shared-content model SHALL preserve its existing rendered behavior. A newly generated page SHALL differ from its pre-migration hand-authored page only in intended ways (facts now sourced from `content.json`), preserving layout, animation machinery, reduced-motion fallbacks, and self-containment.

#### Scenario: Migration preserves the experience
- **WHEN** an experience is converted to a template and regenerated
- **THEN** the generated page differs from the prior hand-authored page only where a shared fact is now injected
- **AND** its animations, reduced-motion behavior, and accessibility affordances are unchanged

#### Scenario: The live site stays working during migration
- **WHEN** experiences are migrated one at a time
- **THEN** each experience remains fully functional whether or not it has yet been converted
