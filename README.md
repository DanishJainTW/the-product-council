https://danishjaintw.github.io/the-product-council

# Docs

The Product Council documentation, as a static multi-page site. Open `index.html` in a browser, or publish the folder with GitHub Pages (Settings, Pages, deploy from branch, folder `/docs`). `.nojekyll` makes GitHub serve the files as they are, and `404.html` is shown for any missing page.

| Page | Audience | Covers |
|---|---|---|
| `index.html` | Product leads | What the council is, how a decision gets made, what you walk away with, who is in the room, when to use it, why to trust it, competitor comparisons |
| `use.html` | Everyone | Quick start, which command, modes, flags, what to say mid-session |
| `commands.html` | Everyone | Command reference with search |
| `behaviour.html` | Everyone | Cost tiers, session flow, questions and analysis documents, evidence rules, decision to delivery, learning loop, automatic behaviour, team working |
| `knowledge.html` | Everyone | Knowledge base layers, how knowledge gets in, the scout, context before questions, new context from the chat |
| `diagrams.html` | Everyone | Diagram pages |
| `technical.html` | Maintainers | Architecture, agents, personas in detail, skills |
| `reference.html` | Maintainers | Repository map, verdicts and tags, upgrading |
| `comparisons.html` and `comparisons/` | Product leads | Driver, parent, provider and district portal comparisons |

Shared files in `assets/`:
- `chrome.css` and `chrome.js`: the header and footer used by every page, comparisons included, and the phone menu and theme switch.
- `site.css` and `site.js`: documentation page styles (Thoughtworks theme, light and dark), copy buttons and section highlighting.
- `commands.js`: command data and search.
- `img/`: flow images.

Every page has the same header and footer markup. When you add a page, add it to the header nav and footer of every page, including the four comparison pages, and to the previous and next links.

The repository is the source of truth. When a command, agent or persona changes, update the matching page in the same pull request. Command entries live in `assets/commands.js`.
