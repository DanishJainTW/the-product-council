const GROUPS = {
  decide: { label: "Decide", color: "#003D4F" },
  knowledge: { label: "Build the knowledge base", color: "#6B9E78" },
  deliver: { label: "Learn, deliver and track", color: "#634F7D" },
  terminal: { label: "Terminal commands", color: "#CC850A" }
};
const CMDS = [
  { g: "decide", name: "/council", tag: "Session, mode inferred",
    what: "The one way in. Reads your request, infers the mode, picks the cheapest tier and the fewest panels, asks you a short round of questions, brings back the panels' questions and the figures they need, then returns two or three options with a named pick and an iteration path. Offers an analysis document it keeps current.",
    when: "Any product question that needs more than a lookup. You never choose a mode; it says which one it picked and you correct it in four words.",
    usage: "/council [flags] <anything>\n/council --analysis <slug> <next question>",
    defaults: "per mode, see Modes. At Tier 2 only the 1 to 2 most relevant panels run",
    out: "A short decision reply, the full record in sessions/, a diagram page when the pick changes how something works, and analysis/<slug>.md if you said yes.",
    ex: "/council parents are not told when a driver changes\n/council --mode validate let drivers re-upload expired documents in the app\n/council --panels board --only premortem self-serve route changes for parents\n/council what are we missing in driver onboarding\n/council --panels competitors --segment alt driver onboarding\n/council --deep should we offer routing as a service?\n/council --thorough --no-diagram change the TP invite copy\n/council --fast should TPs see driver ratings\n/council --analysis driver-change-notice what if we text first?",
    keys: "brainstorm improve solve validate radar board compete problem session verdict options premortem full council deep thorough diagram mode tier questions data analysis document iteration path fast continue" },
  { g: "decide", name: "/ask", tag: "Tier 0 or 1, not saved",
    what: "The cheapest way to use the council. Answers a quick question from context, or gets one persona's or panel's short view.",
    when: "Lookups, definitions, a single expert's take, or a follow-up question.",
    usage: "/ask <question>  or  /ask <persona or panel>: <question>",
    out: "A short answer with sources, or a note that the fact is not in context.",
    ex: "/ask what does TSP mean?\n/ask Shreyas Doshi: is driver doc re-upload leverage work this quarter?",
    keys: "question fact persona quick cheap lookup definition" },
  { g: "knowledge", name: "/ingest", tag: "One file, a folder, or a competitor",
    what: "Adds anything new to the knowledge base. Registers the source, cleans transcripts, writes a source review, extracts facts and open items, checks for conflicts and duplicates, and proposes curated updates for your go or no-go.",
    when: "A transcript, Confluence page, web page, PDF, deck or spreadsheet lands. Or a competitor pack has gone stale.",
    usage: "/ingest <path, folder or url> [--theme <name>] [--limit n] [--dry-run]\n/ingest --competitor <company>",
    out: "A source review in 10-processed/, proposed curated changes, and a batch report for a folder.",
    ex: "/ingest context/00-sources/transcripts --dry-run\n/ingest https://www.example.com/blog/post\n/ingest --competitor hopskipdrive",
    keys: "add source transcript pdf deck confluence batch folder competitor refresh research" },
  { g: "decide", name: "/diagram", tag: "Built in, no install",
    what: "Draws every flow a feature touches on one static page, from plain words, a decision record or a JSON spec: user flows, workflows, sequences, data flows, lifecycles, architecture, and today against an option. Each flow carries a legend, evidence counts, unknowns and a notes table. Export PNG or SVG per flow, PDF for the page.",
    when: "A feature changes several touchpoints and you want them side by side, or you need to show what changes against today.",
    usage: "/diagram <request>\n/diagram <session> [--option b]\n/diagram compare <session>\n/diagram <spec.json>\n/diagram list | demo",
    out: "diagrams/<name>.json and one diagrams/<name>.html page. Opens offline, prints cleanly.",
    ex: "/diagram the driver change notice, every touchpoint\n/diagram compare sessions/2026-10-14-driver-change-7F.md\npython3 scripts/diagram.py render diagrams/my-page.json --open",
    keys: "diagram flowchart workflow userflow user flow architecture sequence dataflow data flow lifecycle state machine swimlane draw visual export png svg compare delta archify" },
  { g: "deliver", name: "/draft", tag: "After a BUILD verdict",
    what: "Turns a decision record and its analysis document into working artifacts, then syncs them to Confluence and Jira without creating duplicates. The PRD has twelve fixed sections, from problem to open questions, filled through a field-by-field mapping.",
    when: "A council verdict said BUILD or BUILD WITH CONDITIONS and you need the delivery artifacts.",
    usage: "/draft package|prd|epics|stories <session, decision record or analysis document>",
    out: "A draft in 30-working/ with sync_status, then live Confluence and Jira items after your approval.",
    ex: "/draft prd sessions/2026-10-14-driver-reupload-7F.md\n/draft prd analysis/driver-reupload.md",
    keys: "prd epics stories package jira confluence requirements delivery kpi functional non-functional analysis" },
  { g: "deliver", name: "/handoff", tag: "After a verdict",
    what: "Writes one self-contained design brief per option for the design-variants project, each with that option's user flow drawn and a paste-ready prompt at the bottom.",
    when: "A decision needs design variants, one per approach.",
    usage: "/handoff <decision> [--option a]\n/handoff list",
    out: "A brief per option in the handoff folder, plus a userflow diagram per option in diagrams/.",
    ex: "/handoff sessions/2026-10-14-driver-reupload-7F.md",
    keys: "design variants figma brief paste prompt option userflow" },
  { g: "deliver", name: "/check", tag: "Every two weeks",
    what: "The state of the council in one report: a single staleness score, knowledge base health, open conflicts and duplicates, naked IDs, usage and cost by tier, and whether past verdicts held up.",
    when: "Fortnightly, after a big ingest, or when you want to know if a past decision worked.",
    usage: "/check [health|usage|fix|lesson]\n/check outcome <session>\n/check decision <session>",
    out: "One report ending in the three most valuable fixes.",
    ex: "/check\n/check outcome sessions/2026-09-20-ineligibility-4B.md",
    keys: "health staleness stale lint index metrics usage cost outcome verdict quality lessons conflicts duplicates" },
  { g: "deliver", name: "/open-pr", tag: "Shared changes only",
    what: "Prepares your branch for review: lint, ID clash checks against main, a re-run of conflict detection in case someone merged a contradicting fact, then the description, commit, push and pull request.",
    when: "You changed curated context, rules, lessons, personas or anything in .claude/.",
    usage: "/open-pr",
    out: "A pull request with every curated change, decision, lesson and source ID listed.",
    ex: "/open-pr",
    keys: "pull request review merge branch team share collision" },
  { g: "terminal", name: "start_work.sh", tag: "Before editing shared content",
    what: "Creates your own branch, up to date with the shared branch. A hook blocks edits to shared content on main, so this is required rather than optional.",
    when: "Before changing curated context, rules, personas or .claude/.",
    usage: "bash scripts/start_work.sh <topic>",
    out: "A branch named pm/<you>/<topic>.",
    ex: "bash scripts/start_work.sh driver-docs-intake",
    keys: "branch git start work shared protected" },
  { g: "terminal", name: "check_citations.py", tag: "Run on any session or draft",
    what: "Verifies that every quoted citation really appears in the file it cites. A literal string check, tolerant of case and transcript artifacts. It proves the quote exists, not that it supports the conclusion.",
    when: "Automatic on every saved session and draft. By hand on an older file.",
    usage: "python3 scripts/check_citations.py <file or folder> [--json]",
    out: "Each failed citation with its line, the cited file and the quote. Exit code 1 if any failed.",
    ex: "python3 scripts/check_citations.py sessions/2026-10-14-driver-reupload-7F.md",
    keys: "citation quote evidence verify hallucination check proof" },
  { g: "terminal", name: "resolve_ids.py", tag: "Readability",
    what: "Resolves every S-, D-, OI-, L- and EV- to its title and file, so no reader meets a bare OI-261005-H8. Appends a legend to a file, or finds naked IDs across a folder.",
    when: "Automatically at the end of a session. By hand on an older file.",
    usage: "python3 scripts/resolve_ids.py <file> --append\npython3 scripts/resolve_ids.py sessions/ --check",
    out: "An ID legend table, or a list of IDs printed without their titles.",
    ex: "python3 scripts/resolve_ids.py --id OI-008",
    keys: "id legend readable title reference code resolve naked" }
  ,{ g: "terminal", name: "health.py", tag: "Runs inside /check",
    what: "The staleness score and every freshness check, computed by a script so it is the same number every time. No model tokens.",
    when: "Inside /check, or by hand for the number alone.",
    usage: "python3 scripts/health.py [--json]",
    out: "A one-line score and a report in reports/weekly/.",
    ex: "python3 scripts/health.py",
    keys: "health stale staleness score report freshness" }
  ,{ g: "terminal", name: "diagram.py", tag: "Behind /diagram",
    what: "The renderer /diagram calls. Validates a page spec with a fix for every problem and its location, renders every flow to one offline HTML page, compares two specs, lists pages that need a re-render. A failed spec never replaces the last good page.",
    when: "By hand when you edit a spec outside Claude Code, or to start one from a template.",
    usage: "python3 scripts/diagram.py new page | <type>\npython3 scripts/diagram.py validate <spec>\npython3 scripts/diagram.py render <spec> [--open]\npython3 scripts/diagram.py compare <before> <after>\npython3 scripts/diagram.py list | demo",
    out: "diagrams/<name>.html beside the spec, or a list of problems each with its fix.",
    ex: "python3 scripts/diagram.py new page > diagrams/my-page.json\npython3 scripts/diagram.py render diagrams/my-page.json --open",
    keys: "diagram render validate spec json html compare list demo new template" }
  ,{ g: "terminal", name: "check_clean.py", tag: "Runs on save",
    what: "Checks an analysis document or PRD talks about the work, not the machinery: no file paths, internal IDs, evidence tags, persona or panel names. Persona names are read from personas/, so new ones are covered.",
    when: "Automatic when an analysis document or PRD is saved. By hand before sharing one.",
    usage: "python3 scripts/check_clean.py <file>",
    out: "Each problem with its line and a fix, or clean. Exit code 1 if any.",
    ex: "python3 scripts/check_clean.py analysis/driver-change-notice.md",
    keys: "analysis prd clean check persona panel path readable share" }
  ,{ g: "terminal", name: "selftest.py", tag: "After an upgrade, or when something errors",
    what: "Runs every hook the way Claude Code does, on a throwaway copy of the repo in a folder with a space in its name: session start, citation checks, analysis and PRD checks, diagram rendering, raw-source protection and the end-of-turn checks. 26 checks, each PASS or FAIL with the reason. Nothing in your repo changes.",
    when: "After an upgrade, after editing a script or settings.json, or when a hook error appears and you want to know where.",
    usage: "python3 scripts/selftest.py",
    out: "One line per check and a total. Exit code 1 if anything failed.",
    ex: "python3 scripts/selftest.py",
    keys: "test selftest error debug hook check broken verify upgrade" }
  ,{ g: "terminal", name: "run_evals.py", tag: "After an upgrade or a skill change",
    what: "Runs the golden eval cases through Claude Code unattended, each on a throwaway copy of the repo, then grades them twice: script checks on what the session produced, and a separate Claude call that grades each case's Must and Must not lists. Two cases are also put to plain Claude and compared blind, so you can see whether the council adds value.",
    when: "After an upgrade, after changing a skill, agent, rule or persona, and before sharing a version with the team. It asks before running, because it uses your Claude plan's tokens.",
    usage: "python3 scripts/run_evals.py\npython3 scripts/run_evals.py --case EV-006\npython3 scripts/run_evals.py --dry-run",
    out: "PASS or FAIL per check and rule, a row in evals/results.md, and a full report in evals/runs/.",
    ex: "python3 scripts/run_evals.py --case EV-003",
    keys: "eval evals test regression baseline grade quality behaviour plain claude compare" }
];

const list=document.getElementById("cmdList");
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function card(c){
  const el=document.createElement("article");
  el.className="cmd"; el.style.setProperty("--c",GROUPS[c.g].color);
  el.dataset.group=c.g;
  el.dataset.text=[c.name,c.tag,c.what,c.when,c.keys,c.defaults||""].join(" ").toLowerCase();
  el.innerHTML=`<div class="cmd-head"><span class="cmd-name">${esc(c.name)}</span><span class="cmd-tag">${esc(c.tag)}</span></div>
    <p>${esc(c.what)}</p>
    <dl>
      <dt>Use when</dt><dd>${esc(c.when)}</dd>
      <dt>Syntax</dt><dd><code>${esc(c.usage)}</code></dd>
      ${c.defaults?`<dt>Default panels</dt><dd>${esc(c.defaults)}</dd>`:""}
      ${c.out?`<dt>You get</dt><dd>${esc(c.out)}</dd>`:""}
    </dl>
    <div class="code"><pre>${esc(c.ex)}</pre><button type="button">Copy</button></div>`;
  return el;
}
const groupWraps={};
Object.entries(GROUPS).forEach(([k,g])=>{
  const wrap=document.createElement("div");
  wrap.className="group"; wrap.style.setProperty("--c",g.color);
  wrap.innerHTML=`<h3><i></i>${g.label}</h3>`;
  CMDS.filter(c=>c.g===k).forEach(c=>wrap.appendChild(card(c)));
  list.appendChild(wrap); groupWraps[k]=wrap;
});

const chips=document.getElementById("chips");
let activeGroup="all";
[["all","All"],...Object.entries(GROUPS).map(([k,g])=>[k,g.label])].forEach(([k,label])=>{
  const b=document.createElement("button");
  b.type="button"; b.className="chip"; b.textContent=label; b.dataset.g=k;
  b.setAttribute("aria-pressed",k==="all"?"true":"false");
  b.addEventListener("click",()=>{
    activeGroup=k;
    chips.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x.dataset.g===k?"true":"false"));
    filter();
  });
  chips.appendChild(b);
});

const q=document.getElementById("q"),count=document.getElementById("count"),empty=document.getElementById("empty");
function filter(){
  const terms=q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let shown=0;
  list.querySelectorAll(".cmd").forEach(el=>{
    const ok=(activeGroup==="all"||el.dataset.group===activeGroup)&&terms.every(t=>el.dataset.text.includes(t));
    el.hidden=!ok; if(ok)shown++;
  });
  Object.values(groupWraps).forEach(w=>{w.hidden=!w.querySelector(".cmd:not([hidden])");});
  empty.style.display=shown?"none":"block";
  count.textContent=`${shown} of ${CMDS.length} commands`;
}
q.addEventListener("input",filter);
q.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("commands").scrollIntoView();});
filter();
