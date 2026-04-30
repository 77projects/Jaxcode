import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const FREE_BANKS = {
  "Subordinating Conjunctions": {
    color: "#C084FC", short: "CONJUNCT",
    desc: "Opening words that create flow and forward momentum in conversation.",
    items: ["because","since","while","as","although","even though","even if","unless","until","before","after","once","whenever","wherever","whereas","as if","as though","so that","in order that","provided that","assuming that","given that","now that","by the time","as long as","as soon as","whether or not","even when","just as","much like","the moment","every time"],
  },
  "Soft Qualifiers": {
    color: "#67E8F9", short: "QUALIFIER",
    desc: "Words that make ideas feel personally relevant and lived-in, not abstract.",
    items: ["it felt like","it seemed like","it looked as if","it gave me the impression that","almost like","in a way","somehow","sort of","kind of","in some way","you could almost say","it was as though","there was something about it that","it had this quality of","not quite, but close to","you might say","if you could imagine","it was one of those things where","without quite knowing why","for reasons you can't entirely explain"],
  },
  "Nominalizations": {
    color: "#86EFAC", short: "NOMINAL",
    desc: "Open, meaningful words that people naturally connect to their own experience.",
    items: ["awareness","understanding","comfort","curiosity","realization","learning","recognition","appreciation","connection","transformation","relaxation","knowledge","freedom","security","satisfaction","growth","peace","clarity","trust","openness","wisdom","belonging","possibility","resolution","acceptance","presence","alignment","integration","relief","expansion"],
  },
  "Unspecified Verbs": {
    color: "#FCD34D", short: "VERB",
    desc: "Action words that invite people to apply meaning from their own life.",
    items: ["experience","notice","sense","realize","become aware","begin to","allow","discover","consider","explore","find","shift","move","settle","open","let","develop","wonder","feel","process","remember","imagine","recognize","appreciate","understand","absorb","drift","ease","know","perceive"],
  },
  "Temporal Drift": {
    color: "#A78BFA", short: "TEMPORAL",
    desc: "Phrases that ease time pressure and create a sense of spaciousness.",
    items: ["and I might not remember exactly when","at some point — maybe now, maybe earlier","and it could have been yesterday or a year ago","by the time I noticed","before I even realized","somewhere between then and now","and maybe it already started","as if time had folded over on itself","and whether that was a moment ago or much longer","in that space where minutes don't quite work the same way","and it doesn't matter when, exactly","as though it had always been that way","I might find myself wondering when that began","and the interesting thing is, it may have already happened","at some point I can't quite pin down","in a time that felt like no particular time","somewhere before the moment I became aware of it","by the time it registered it had already been happening","not recently and not long ago — just at some point","and the when of it keeps moving when I look at it","as if the whole thing existed outside of any clock","between one breath and the next, though I couldn't say which","in that part of memory where sequences don't hold their order","and whether it was once or many times I genuinely couldn't tell you","the timing of it was the last thing I could have described"],
  },
  "Mundane Witness": {
    color: "#94A3B8", short: "WITNESS",
    desc: "Specific sensory details that make stories feel real and trustworthy.",
    items: ["The fluorescent light was humming just slightly too loud","There was a half-empty coffee cup nobody claimed","His left shoe was untied the entire time","The door didn't quite close all the way","Someone had written something on the whiteboard and not erased it","The elevator took longer than it should have","There was a plant in the corner that had seen better days","He was wearing two different shades of blue","The window was open just enough to move the papers","Nobody sat in the chair closest to the door","The clock on the wall was three minutes fast","She stirred her coffee but never drank it","The menu had a laminate that was peeling at the corner","One of the ceiling tiles was slightly off-center","There was a dog-eared page in a book nobody was reading"],
  },
};

const CONFUSION_BANK = [
  "What hasn't occurred yet has no place in the time that isn't now",
  "What was there before hasn't been what it isn't",
  "What happened before after it had already had an awareness just makes it so that",
  "People not knowing what hasn't been can't work with what isn't there",
  "Not knowing what hasn't been perceived can't undo what isn't a feeling",
  "I haven't properly done what hasn't already happened",
  "What you couldn't have comes before what it shouldn't perceive",
  "Having a perspective of something that makes a knowing of what isn't the knowledge you can perceive",
  "The part that wasn't there before isn't what it used to not be",
  "What you haven't remembered hasn't finished not arriving yet",
  "The understanding that isn't yours yet hasn't decided not to settle",
  "Before what didn't happen had already not finished, the time that wasn't now was still then",
  "Not perceiving what hasn't been felt doesn't make it not already there",
  "The awareness of what isn't known yet can't undo what hasn't been realized",
  "What you couldn't have noticed before isn't what it hadn't already become",
  "The knowing of what isn't yet can't be what it wasn't before it wasn't",
];


const CARRIERS = {
  "Awareness Frames": { color: "#C084FC", short: "AWARE", desc: "Gentle awareness language that naturally guides attention.", items: ["you might start to *feel completely at ease*","it's interesting how people *let go of tension* when they sit like this","I wonder if you've noticed how easy it is to *just relax now*","some people find they *become very comfortable* without trying","most people don't realize they've already started to *slow down*","you can *allow yourself to drift* whenever you're ready","it's fascinating to notice how the body *begins to settle* on its own","there's something about this conversation that makes it easy to *feel calm*"] },
  "Third Person Displacement": { color: "#67E8F9", short: "3RD", desc: "Stories and examples that let people find their own connection to the message.", items: ["a friend of mine once described how she'd *just let the whole thing go*","people in that situation often find they *feel more open* than expected","someone told me once that the moment you *stop resisting* it changes","I knew a guy who said the second he *decided to trust the process* everything shifted","most people I've worked with *notice a shift* right around this point","she said the strangest part was realizing she could *simply agree* and it felt right","he mentioned that when he *allowed himself to be curious* it stopped being difficult","they all said the same thing — the moment you *stop fighting it* you understand"] },
  "Negation Delivery": { color: "#86EFAC", short: "NEG", desc: "Softened language that reduces pressure while keeping the helpful intention clear.", items: ["don't *feel too comfortable* just yet","there's no need to *relax completely* right now","I'm not asking you to *trust this process* before you're ready","you don't have to *let go* of anything you're not ready to release","I wouldn't tell you to *just go ahead and decide*","there's no reason to *feel confident about this* already","don't *notice how much easier this is getting*","you don't need to *become more open* than you already are"] },
  "Question Embedding": { color: "#FCD34D", short: "QUEST", desc: "The command is hidden inside a question. Questions invite rather than push.", items: ["have you ever noticed how easy it is to *just let something settle*?","I'm curious whether you've already started to *feel the difference*","do you find it easier to *become more relaxed* in situations like this?","what would it be like if you could *simply trust what's happening*?","isn't it interesting how the body *knows how to release* before the mind does?","can you *allow yourself to be here* for just a moment?","have you noticed yet that you're already starting to *drift a little*?","what happens when you *let the thinking slow down* just slightly?"] },
  "Story Commands": { color: "#F9A8D4", short: "STORY", desc: "Stories that carry helpful ideas naturally — people receive them without feeling told.", items: ["and he looked at her and said, '*just breathe and let it happen*'","the teacher told us once — '*stop trying and it arrives*'","she said the only thing that helped was learning to '*trust what you already know*'","the sign on the wall just said '*be here now*' and somehow that was enough","he said to me, very quietly, '*you already know what to do*'","the whole room seemed to say '*settle in and stay a while*'","someone once told me that the best advice is just '*stop explaining it to yourself*'","and the last thing she said before leaving was '*you can let go now*'"] },
};

const PRINCIPLES = {
  "Reciprocity": { color: "#C084FC", short: "RECIP", tagline: "Generosity builds trust naturally.", mechanism: "When someone receives something — a favor, information, time, attention — an unconscious obligation activates. The return doesn't require asking. It requires giving first, without conditions, in a way that feels genuine.", frames: ["I want to share something with you before we go any further","let me give you this — no strings, just because it's useful","before you decide anything, here's something that might help","I'm going to tell you something most people in my position wouldn't"] },
  "Consistency": { color: "#67E8F9", short: "COMMIT", tagline: "Help people stay aligned with their own values.", mechanism: "Once someone has said or done something — even something small — they experience pressure to remain consistent with it. Every subsequent request feels like alignment, not compliance.", frames: ["you've already shown you care about this kind of thing","given what you said earlier about wanting to make a real change","you've always been someone who follows through on things like this","you've already made the harder decision — this is just the next step"] },
  "Social Proof": { color: "#86EFAC", short: "PROOF", tagline: "Shared experience builds confidence and trust.", mechanism: "In ambiguous situations, people look to others to determine the correct course. A single specific story does more than a survey.", frames: ["everyone who's been in this position and moved forward has said the same thing","I've seen a lot of people at exactly this crossroads — the ones who did it found that","most people I've talked to who hesitated said afterward that","the people who've done this and looked back all say the same thing"] },
  "Authority": { color: "#FCD34D", short: "AUTH", tagline: "Genuine knowledge and care inspire confidence.", mechanism: "People defer to those who appear knowledgeable or experienced. Authority is established through specificity and calm confidence — claiming it directly undermines it.", frames: ["in my experience working with people in exactly this situation","what I've found — and this is consistent across many different cases","most people assume the opposite, but what actually happens is","the distinction most people miss — and it's an important one — is"] },
  "Liking": { color: "#F9A8D4", short: "LIKE", tagline: "Real connection makes communication easier.", mechanism: "Influence travels on relationship. Similarity doesn't have to be deep — shared small details carry surprising weight.", frames: ["the way you described that is almost exactly how I think about it","most people I talk to don't quite get what you clearly already understand","you have a way of thinking about this that not many people do","I noticed something about you that reminded me of"] },
  "Scarcity": { color: "#FB923C", short: "SCAR", tagline: "Honest clarity about timing helps people decide.", mechanism: "Loss aversion means the prospect of losing something activates more strongly than gaining the same thing. Scarcity can be implied through timing or the natural arc of a situation.", frames: ["this particular window doesn't stay open — not because of anything artificial","at some point the situation changes and this specific option isn't available","I want to be honest with you — this isn't indefinitely on the table","most people who've been at this crossroads and waited said the window was shorter than it looked"] },
};



const SENSORY_OBJECTS = [
  "a chair","a door","a window","a street","a table","a tree","a car","a room",
  "a staircase","a clock","a coat","a phone","a glass of water","a book",
  "a corridor","a wall","a ceiling","a lamp","a floor","a key",
];

const SENSORY_BANKS = {
  Visual: {
    color: "#FCD34D",
    qualities: ["shiny","matte","pale","deep","dark","bright","faded","worn","polished","rough-looking","translucent","stark","weathered","gleaming","dusty","glossy","shadowed","washed-out","vivid","cracked"],
    colors: ["red","amber","grey","black","white","blue","green","brown","gold","silver","rust","cream","slate","bone","ink","copper","ash","ochre","navy","olive"],
  },
  Tactile: {
    color: "#86EFAC",
    qualities: ["cold","warm","smooth","rough","soft","hard","damp","dry","heavy","light","grainy","slick","coarse","velvet","sharp-edged","thick","thin","dense","brittle","solid"],
  },
  Auditory: {
    color: "#67E8F9",
    qualities: ["humming","silent","creaking","hollow","resonant","muffled","sharp","distant","close","echoing","rattling","whispering","still","buzzing","clicking","dripping","scraping","settling","low","faint"],
  },
  Olfactory: {
    color: "#C084FC",
    qualities: ["dusty","clean","salt-tinged","earthy","metallic","burnt","sweet","cold-aired","smoky","damp","pine-scented","chemical","old","fresh","sour","woody","mineral","dry","heady","neutral"],
  },
  Atmosphere: {
    color: "#F9A8D4",
    qualities: ["abandoned","busy","waiting","forgotten","charged","calm","uneasy","lived-in","temporary","permanent","ceremonial","ordinary","intimate","exposed","private","public","quiet","tense","spacious","contained"],
  },
};

const INDIRECT_FRAMES = [
  "there was a [X] that",
  "I remember that [X] when",
  "I had a bit of a [X]",
  "something like a [X] came over me",
  "a kind of [X] settled in",
  "there was something that felt like [X]",
  "I noticed what might have been a [X]",
  "a [X] arrived that I hadn't expected",
  "it was almost as if a [X] had been waiting there",
  "somewhere in that, a [X] started to form",
  "the [X] wasn't loud — just present",
  "I wouldn't call it certainty, more like a [X]",
  "and somewhere in the middle of it there was this [X]",
  "a quiet [X] that I almost didn't notice",
  "without deciding to, I found a [X]",
];

const INDIRECT_NOMINALS = [
  "awareness","understanding","clarity","knowing","comfort",
  "realization","recognition","curiosity","ease","certainty",
  "settledness","openness","trust","sense of arrival","quiet",
  "stillness","belonging","readiness","resolution","presence",
];

const METAPHOR_STAGES = [
  { id: "function", number: "01", name: "Function", color: "#C084FC", instruction: "What does your X do? Name the core action or behavior.", q1: "What does X do?", q2: "What else does exactly that?", hint: "List at least five answers. The first three will be obvious. Push past them.", example: { x: "a deadline", a1: "creates urgency by arriving whether you're ready or not", a2: "a tide. a storm. a birth." } },
  { id: "characteristic", number: "02", name: "Characteristic", color: "#67E8F9", instruction: "What does X have? Its qualities, textures, behaviors.", q1: "What does X have?", q2: "What else has that?", hint: "The metaphor that shares both function AND characteristic feels inevitable.", example: { x: "a deadline", a1: "a hard edge, a fixed position, indifference to your readiness", a2: "a wall. a cliff. a locked door at closing time." } },
  { id: "extension", number: "03", name: "Extension", color: "#86EFAC", instruction: "Extend it into a system. A metaphor that collapses after one sentence is a simile in disguise.", q1: "If X is [your metaphor] — what are its rooms? Its locked doors?", q2: "What happens when you push it one step further than is comfortable?", hint: "The house of the unconscious has rooms nobody visits.", example: { x: "the unconscious as a house", a1: "rooms, a basement, locked doors, a room nobody's been in since childhood", a2: "you don't renovate a house by standing outside describing it" } },
  { id: "test", number: "04", name: "Test", color: "#FCD34D", instruction: "Say it in one sentence. A metaphor works when the listener finishes it before you do.", q1: "State the metaphor in one sentence.", q2: "Does it need explanation — or does it land on its own?", hint: "If they're waiting for you to explain, compress further.", example: { x: "deadline", a1: "A deadline is a tide — it arrives whether you're ready or not, and the water doesn't care.", a2: "No explanation needed. The image completes itself." } },
];

const ADVERSARIAL_PAIRS = [["a library","a wildfire"],["a question","a locked room"],["silence","a crowded market"],["a habit","a river"],["a belief","a pair of glasses"],["forgetting","a door closing"],["trust","a glass bridge"],["a memory","a photograph left in the sun"]];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function dealFree() {
  const names = Object.keys(FREE_BANKS);
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.4 ? 4 : 3;
  return shuffled.slice(0, count).map(n => ({ bank: n, phrase: pick(FREE_BANKS[n].items), color: FREE_BANKS[n].color, short: FREE_BANKS[n].short }));
}

function dealConfusion() {
  const shuffled = [...CONFUSION_BANK].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.5 ? 3 : 2;
  const colors = ["#C084FC", "#67E8F9", "#F9A8D4"];
  return shuffled.slice(0, count).map((phrase, i) => ({
    type: String.fromCharCode(65 + i),
    phrase,
    color: colors[i],
    short: `CONFUSION ${String.fromCharCode(65 + i)}`,
    fragment: phrase,
  }));
}

function dealCarriers() {
  const names = Object.keys(CARRIERS);
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.5 ? 3 : 2;
  return shuffled.slice(0, count).map(n => ({ type: n, phrase: pick(CARRIERS[n].items), color: CARRIERS[n].color, short: CARRIERS[n].short }));
}

function dealPrinciples() {
  const names = Object.keys(PRINCIPLES);
  const shuffled = [...names].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.5 ? 3 : 2;
  return shuffled.slice(0, count).map(n => ({ name: n, frame: pick(PRINCIPLES[n].frames), color: PRINCIPLES[n].color, short: PRINCIPLES[n].short, tagline: PRINCIPLES[n].tagline }));
}

function highlightCommand(str, color) {
  const parts = str.split("*");
  return parts.map((p, i) => <span key={i} style={{ color: i % 2 === 1 ? color : "inherit", fontWeight: i % 2 === 1 ? "500" : "normal" }}>{p}</span>);
}

function detectUsed(text, cards) {
  return cards.map(c => ({ ...c, used: text.toLowerCase().includes((c.phrase || c.fragment || c.frame || "").toLowerCase()) }));
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#16142a", fontFamily: "'Georgia', serif", color: "#f0ecff", position: "relative", overflow: "hidden" },
  glow: { position: "fixed", top: "-15%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(100,40,180,0.22) 0%, transparent 70%)", pointerEvents: "none" },
  container: { position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto", padding: "40px 20px 80px" },
  eyebrow: { fontSize: "9px", letterSpacing: "6px", color: "#9b8ed8", fontFamily: "monospace", marginBottom: "10px", textAlign: "center" },
  h1: { fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "normal", margin: "0 0 6px", background: "linear-gradient(135deg, #e8e0d0 0%, #9070c0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" },
  sub: { fontSize: "18px", color: "#8878a8", fontStyle: "italic", margin: "0 0 28px", textAlign: "center" },
  tabBar: { display: "flex", justifyContent: "center", gap: "6px", marginBottom: "28px", flexWrap: "wrap" },
  textarea: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#f0ecff", fontSize: "17px", lineHeight: "1.75", fontFamily: "'Georgia', serif", padding: "14px 16px", resize: "vertical", outline: "none" },
  input: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#f0ecff", fontSize: "17px", fontFamily: "'Georgia', serif", fontStyle: "italic", padding: "12px 14px", outline: "none" },
  btnPrimary: { padding: "13px 28px", background: "rgba(124,58,237,0.95)", border: "2px solid rgba(192,160,255,0.7)", borderRadius: "10px", color: "#ffffff", fontSize: "12px", letterSpacing: "2px", fontFamily: "monospace", cursor: "pointer", boxShadow: "0 0 18px rgba(124,58,237,0.5), 0 2px 8px rgba(0,0,0,0.4)" },
  btnGhost: { padding: "11px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#9080b0", fontSize: "11px", letterSpacing: "2px", fontFamily: "monospace", cursor: "pointer" },
  card: (color, used) => ({ border: `1px solid ${used ? color : "rgba(255,255,255,0.15)"}`, borderRadius: "8px", padding: "12px 16px", background: used ? `linear-gradient(135deg, ${color}18, ${color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }),
  divider: { fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#6050a0", textAlign: "center", marginBottom: "14px" },
};

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "7px 14px", background: active ? "rgba(124,58,237,0.25)" : "transparent", border: `1px solid ${active ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.15)"}`, borderRadius: "5px", color: active ? "#c4a8f0" : "#4a4060", fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace", cursor: "pointer" }}>
      {label}
    </button>
  );
}

function CardDealer({ cards, visible, sentence, setSentence, submitted, setSubmitted, onDeal, historyKey }) {
  const updated = detectUsed(sentence, cards);
  const usedCount = updated.filter(c => c.used).length;
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
        {cards.map((card, i) => {
          const isUsed = updated[i]?.used;
          const txt = card.phrase || card.fragment || card.frame || "";
          return (
            <div key={i} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
              <div style={S.card(card.color, isUsed)}>
                <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                <div style={{ fontSize: "18px", fontStyle: "italic", color: isUsed ? "#e8e0d0" : "#7a7080", lineHeight: "1.45" }}>"{typeof txt === "string" ? txt : txt}"</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
          {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updated[i]?.used ? updated[i].color : "rgba(255,255,255,0.18)", transition: "all 0.3s" }} />)}
          <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
        </div>
      </div>
      {submitted ? (
        <div style={{ padding: "18px 20px", border: "1px solid rgba(134,239,172,0.2)", borderRadius: "10px", background: "rgba(134,239,172,0.02)", fontSize: "17px", lineHeight: "1.75", fontStyle: "italic", color: "#c8c0b0", marginBottom: "14px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
          {sentence}
        </div>
      ) : (
        <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Write a sentence using the phrases — let them guide the tone naturally." rows={3} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.35)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
      )}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
        <button onClick={onDeal} style={S.btnGhost}>NEW DEAL ↺</button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────

function DriftEngine() {
  const [subView, setSubView] = useState("practice");
  const ALL_BANK_NAMES = Object.keys(FREE_BANKS);
  const [activeBanks, setActiveBanks] = useState(() => new Set(ALL_BANK_NAMES));

  const dealActive = useCallback(() => {
    const available = ALL_BANK_NAMES.filter(n => activeBanks.has(n));
    const pool = available.length > 0 ? available : ALL_BANK_NAMES;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const count = Math.min(Math.random() > 0.4 ? 4 : 3, pool.length);
    return shuffled.slice(0, count).map(n => ({
      bank: n, phrase: pick(FREE_BANKS[n].items),
      color: FREE_BANKS[n].color, short: FREE_BANKS[n].short,
    }));
  }, [activeBanks]);

  const [cards, setCards] = useState(() => dealActive());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase()),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  const toggleBank = (name) => {
    setActiveBanks(prev => {
      const next = new Set(prev);
      if (next.has(name) && next.size === 1) return prev;
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i * 120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealActive()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount, dealActive]);

  return (
    <>
      <div style={S.tabBar}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
        <Tab label="PICK" active={subView==="pick"} onClick={() => setSubView("pick")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "17px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(134,239,172,0.2)", borderRadius: "10px", background: "rgba(134,239,172,0.02)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8c0b0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave the phrases into a natural sentence..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "36px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {Object.entries(FREE_BANKS).map(([name, bank]) => (
            <div key={name}>
              <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {subView === "pick" && (
        <div>
          <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "20px", lineHeight: "1.6" }}>
            Choose which banks to deal from. Tap to toggle. At least one must stay active.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {ALL_BANK_NAMES.map(name => {
              const bank = FREE_BANKS[name];
              const isActive = activeBanks.has(name);
              return (
                <div key={name} onClick={() => toggleBank(name)} style={{ border: `2px solid ${isActive ? bank.color + "70" : "rgba(255,255,255,0.09)"}`, borderRadius: "8px", padding: "12px 16px", background: isActive ? `${bank.color}10` : "rgba(255,255,255,0.02)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
                  <div>
                    <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color, marginRight: "12px" }}>{bank.short}</span>
                    <span style={{ fontSize: "15px", color: isActive ? "#d8c8f0" : "#7060a0", transition: "color 0.2s" }}>{name}</span>
                  </div>
                  <div style={{ width: "22px", height: "22px", borderRadius: "5px", border: `2px solid ${isActive ? bank.color : "rgba(255,255,255,0.15)"}`, background: isActive ? bank.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                    {isActive && <span style={{ color: "#08080f", fontSize: "13px", fontWeight: "bold", lineHeight: 1 }}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => { setCards(dealActive()); setSubView("practice"); setSentence(""); setSubmitted(false); }} style={S.btnPrimary}>
              DEAL FROM SELECTED →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ConfusionForge() {
  const [cards, setCards] = useState(() => dealConfusion());
  const [command, setCommand] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false, false, false]);

  useEffect(() => {
    setVisible([false, false, false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*130));
  }, [cards]);

  const handleDeal = useCallback(() => {
    if (command.trim()) setHistory(h => [{ command, cards }, ...h].slice(0, 5));
    setSubmitted(false);
    setVisible([false, false, false]);
    setTimeout(() => { setCards(dealConfusion()); setCommand(""); }, 150);
  }, [command, cards]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Use one or more of these in conversation. Then follow with a short guiding phrase while the mind is reorienting.
      </p>
      <div style={{ fontSize: "10px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "20px" }}>
        — CONFUSION STATEMENTS —
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        {cards.map((card, i) => (
          <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
            <div style={{ border: `1px solid ${card.color}40`, borderRadius: "8px", padding: "14px 18px", background: `${card.color}08` }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace", color: card.color, marginBottom: "6px" }}>{card.short}</div>
              <div style={{ fontSize: "16px", fontStyle: "italic", color: "#d8c8f0", lineHeight: "1.6" }}>"{card.phrase}"</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: "10px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "12px" }}>
        — FOLLOW WITH A GUIDING PHRASE —
      </div>
      <div style={{ fontSize: "13px", color: "#7060a0", fontStyle: "italic", textAlign: "center", marginBottom: "12px" }}>
        While the mind is reorienting — give it somewhere to land.
      </div>

      {submitted ? (
        <div style={{ padding: "16px 18px", border: "1px solid rgba(134,239,172,0.25)", borderRadius: "10px", background: "rgba(134,239,172,0.04)", fontSize: "17px", fontStyle: "italic", color: "#a0c8a8", lineHeight: "1.75", marginBottom: "14px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>COMMITTED</div>
          {command}
        </div>
      ) : (
        <textarea value={command} onChange={e => setCommand(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && command.trim() && setSubmitted(true)} placeholder="...you can just (let go)" rows={3} style={{ ...S.textarea, fontStyle: command ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(134,239,172,0.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
      )}

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "36px" }}>
        {!submitted && <button onClick={() => command.trim() && setSubmitted(true)} disabled={!command.trim()} style={{ ...S.btnPrimary, opacity: command.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
        <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
      </div>

      {history.length > 0 && (
        <div>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "8px" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
              <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.command}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


function EmbeddedCommands() {
  const [cards, setCards] = useState(() => dealCarriers());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false]);

  useEffect(() => {
    setVisible([false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards }, ...h].slice(0, 5));
    setSubmitted(false);
    setVisible([false,false,false]);
    setTimeout(() => { setCards(dealCarriers()); setSentence(""); }, 150);
  }, [sentence, cards]);

  const renderCards = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
      {cards.map((card, i) => (
        <div key={i} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
          <div style={{ border: `1px solid ${card.color}30`, borderRadius: "8px", padding: "12px 16px", background: `${card.color}06` }}>
            <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short}</div>
            <div style={{ fontSize: "18px", lineHeight: "1.45" }}>{highlightCommand(card.phrase, card.color)}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <p style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", textAlign: "center", marginBottom: "6px", lineHeight: "1.6" }}>The * marks where the command sits. Hide your own command inside the carrier pattern.</p>
      <p style={{ fontSize: "11px", color: "#7060a0", fontFamily: "monospace", textAlign: "center", marginBottom: "20px" }}>Remove the * in actual use.</p>
      {renderCards()}
      {submitted ? (
        <div style={{ padding: "18px 20px", border: "1px solid rgba(192,132,252,0.2)", borderRadius: "10px", background: "rgba(192,132,252,0.03)", fontSize: "17px", lineHeight: "1.75", fontStyle: "italic", color: "#c8c0d8", marginBottom: "12px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#C084FC", marginBottom: "8px", opacity: 0.6 }}>COMMITTED</div>
          {sentence}
        </div>
      ) : (
        <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Write a sentence with a helpful guiding phrase woven inside..." rows={3} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(192,132,252,0.35)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
      )}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
        <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
      </div>
      {history.length > 0 && (
        <div style={{ marginTop: "36px" }}>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "6px" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.6" }}>{h.sentence}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function InfluencePrinciples() {
  const [cards, setCards] = useState(() => dealPrinciples());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false]);
  const [openP, setOpenP] = useState(null);
  const [subView, setSubView] = useState("build");

  useEffect(() => {
    if (subView !== "build") return;
    setVisible([false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards }, ...h].slice(0, 5));
    setSubmitted(false);
    setVisible([false,false,false]);
    setTimeout(() => { setCards(dealPrinciples()); setSentence(""); }, 150);
  }, [sentence, cards]);

  return (
    <>
      <div style={S.tabBar}>
        <Tab label="BUILD" active={subView==="build"} onClick={() => setSubView("build")} />
        <Tab label="REFERENCE" active={subView==="ref"} onClick={() => setSubView("ref")} />
      </div>
      {subView === "build" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => (
              <div key={i} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                <div style={{ border: `1px solid ${card.color}30`, borderRadius: "8px", padding: "12px 16px", background: `${card.color}06` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: card.color }}>{card.short}</span>
                    <span style={{ fontSize: "10px", color: "#7060a0", fontStyle: "italic" }}>{card.tagline}</span>
                  </div>
                  <div style={{ fontSize: "18px", fontStyle: "italic", color: "#c8b8e0", lineHeight: "1.45" }}>"{card.frame}"</div>
                </div>
              </div>
            ))}
          </div>
          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(192,132,252,0.2)", borderRadius: "10px", background: "rgba(192,132,252,0.03)", fontSize: "17px", lineHeight: "1.75", fontStyle: "italic", color: "#c8c0d8", marginBottom: "12px" }}>
              <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#C084FC", marginBottom: "8px", opacity: 0.6 }}>COMMITTED</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Write one sentence that carries all the principles..." rows={3} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(192,132,252,0.35)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
          )}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>
          {history.length > 0 && (
            <div style={{ marginTop: "36px" }}>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {subView === "ref" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.entries(PRINCIPLES).map(([name, p]) => {
            const isOpen = openP === name;
            return (
              <div key={name} style={{ border: `1px solid ${isOpen ? p.color+"40" : "rgba(255,255,255,0.12)"}`, borderRadius: "9px", overflow: "hidden", transition: "border-color 0.3s" }}>
                <div onClick={() => setOpenP(isOpen ? null : name)} style={{ padding: "14px 18px", cursor: "pointer", background: isOpen ? `${p.color}08` : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><span style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: p.color, marginRight: "10px" }}>{p.short}</span><span style={{ fontSize: "17px", color: "#c8b8e0" }}>{name}</span></div>
                  <span style={{ fontSize: "10px", color: "#7060a0" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 18px 18px" }}>
                    <div style={{ fontSize: "18px", color: p.color, fontStyle: "italic", marginBottom: "10px", opacity: 0.8 }}>{p.tagline}</div>
                    <p style={{ fontSize: "18px", color: "#9080b0", lineHeight: "1.65", marginBottom: "14px" }}>{p.mechanism}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {p.frames.map((f, i) => <div key={i} style={{ padding: "7px 11px", border: `1px solid ${p.color}20`, borderRadius: "4px", background: `${p.color}05`, fontSize: "18px", fontStyle: "italic", color: "#a090c0" }}>"{f}"</div>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function MetaphorForge() {
  const [mode, setMode] = useState("guided");
  const [xValue, setXValue] = useState("");
  const [xStarted, setXStarted] = useState(false);
  const [stage, setStage] = useState(0);
  const [answers, setAnswers] = useState({0:{q1:"",q2:""},1:{q1:"",q2:""},2:{q1:"",q2:""},3:{q1:"",q2:""}});
  const [complete, setComplete] = useState(false);
  const [advPair, setAdvPair] = useState(() => pick(ADVERSARIAL_PAIRS));
  const [advAnswer, setAdvAnswer] = useState("");
  const [advSubmitted, setAdvSubmitted] = useState(false);
  const [advHistory, setAdvHistory] = useState([]);

  const cur = METAPHOR_STAGES[stage];
  const curAns = answers[stage];
  const canAdvance = curAns.q1.trim().length > 3 && curAns.q2.trim().length > 3;
  const updateAns = (q, v) => setAnswers(a => ({ ...a, [stage]: { ...a[stage], [q]: v } }));
  const handleReset = () => { setXValue(""); setXStarted(false); setStage(0); setAnswers({0:{q1:"",q2:""},1:{q1:"",q2:""},2:{q1:"",q2:""},3:{q1:"",q2:""}}); setComplete(false); };

  return (
    <>
      <div style={S.tabBar}>
        <Tab label="GUIDED" active={mode==="guided"} onClick={() => setMode("guided")} />
        <Tab label="ADVERSARIAL" active={mode==="adversarial"} onClick={() => setMode("adversarial")} />
      </div>
      {mode === "guided" && (
        !xStarted ? (
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "22px 20px", background: "rgba(255,255,255,0.09)" }}>
            <p style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", marginBottom: "18px", lineHeight: "1.6" }}>X is the thing you want to illuminate. Don't overthink it — the work happens in the questions.</p>
            <input value={xValue} onChange={e => setXValue(e.target.value)} onKeyDown={e => e.key === "Enter" && xValue.trim() && setXStarted(true)} placeholder="Enter your X..." style={S.input} onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
            <button onClick={() => xValue.trim() && setXStarted(true)} disabled={!xValue.trim()} style={{ ...S.btnPrimary, marginTop: "12px", opacity: xValue.trim() ? 1 : 0.3 }}>BEGIN FORGE →</button>
          </div>
        ) : complete ? (
          <div>
            <div style={{ border: "1px solid rgba(134,239,172,0.2)", borderRadius: "10px", padding: "20px", background: "rgba(134,239,172,0.02)", marginBottom: "16px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "16px" }}>COMPLETE — X: "{xValue}"</div>
              {METAPHOR_STAGES.map((s, i) => (
                <div key={i} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: s.color, marginBottom: "6px" }}>{s.number} {s.name.toUpperCase()}</div>
                  <div style={{ fontSize: "17px", fontStyle: "italic", color: "#a090c0", lineHeight: "1.6", marginBottom: "4px" }}>{answers[i].q1}</div>
                  <div style={{ fontSize: "17px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{answers[i].q2}</div>
                </div>
              ))}
            </div>
            <button onClick={handleReset} style={S.btnGhost}>FORGE ANOTHER ↺</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "18px" }}>
              {METAPHOR_STAGES.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: `1px solid ${i===stage ? s.color : answers[i]?.q1?.trim() ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontFamily: "monospace", color: i===stage ? s.color : "#3a3050", background: i===stage ? `${s.color}12` : "transparent" }}>{answers[i]?.q1?.trim() ? "✓" : i===stage ? "→" : "·"}</div>
                  {i < 3 && <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.12)" }} />}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#7060a0" }}>X = </span>
              <span style={{ fontSize: "17px", fontStyle: "italic", color: cur.color }}>"{xValue}"</span>
            </div>
            <div style={{ border: `1px solid ${cur.color}30`, borderRadius: "10px", padding: "20px", background: `${cur.color}06`, marginBottom: "16px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "12px" }}>
                <span style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: cur.color }}>{cur.number}</span>
                <span style={{ fontSize: "17px", color: "#c8b8d8" }}>{cur.name}</span>
              </div>
              <p style={{ fontSize: "18px", color: "#9080b0", fontStyle: "italic", lineHeight: "1.6", marginBottom: "16px" }}>{cur.instruction}</p>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "10px", fontFamily: "monospace", color: cur.color, marginBottom: "6px", opacity: 0.8 }}>{cur.q1.replace("X", `"${xValue}"`)}</div>
                <textarea value={curAns.q1} onChange={e => updateAns("q1", e.target.value)} rows={2} placeholder="Your answer..." style={{ ...S.textarea, marginBottom: 0 }} onFocus={e => e.target.style.borderColor = `${cur.color}50`} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", fontFamily: "monospace", color: cur.color, marginBottom: "6px", opacity: 0.8 }}>{cur.q2}</div>
                <textarea value={curAns.q2} onChange={e => updateAns("q2", e.target.value)} rows={3} placeholder="Push past the obvious..." style={{ ...S.textarea, marginBottom: 0 }} onFocus={e => e.target.style.borderColor = `${cur.color}50`} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
              </div>
              <div style={{ padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderLeft: `2px solid ${cur.color}40`, borderRadius: "4px", marginBottom: "16px" }}>
                <div style={{ fontSize: "11px", color: "#7060a0", fontStyle: "italic", lineHeight: "1.5" }}>{cur.hint}</div>
              </div>
              <button onClick={() => stage < 3 ? setStage(s => s+1) : setComplete(true)} disabled={!canAdvance} style={{ ...S.btnPrimary, background: `${cur.color}90`, borderColor: `${cur.color}60`, opacity: canAdvance ? 1 : 0.3 }}>{stage < 3 ? "NEXT →" : "COMPLETE ✓"}</button>
            </div>
          </>
        )
      )}
      {mode === "adversarial" && (
        <>
          <p style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", textAlign: "center", marginBottom: "20px", lineHeight: "1.6" }}>Two things that seem totally unrelated. Find the similarity anyway. Act as if someone told you it was impossible.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ padding: "12px 18px", border: "1px solid rgba(192,132,252,0.3)", borderRadius: "8px", background: "rgba(192,132,252,0.06)", fontSize: "17px", fontStyle: "italic", color: "#d8c8f0" }}>{advPair[0]}</div>
            <span style={{ color: "#6050a0", fontSize: "18px" }}>+</span>
            <div style={{ padding: "12px 18px", border: "1px solid rgba(103,232,249,0.3)", borderRadius: "8px", background: "rgba(103,232,249,0.06)", fontSize: "17px", fontStyle: "italic", color: "#90d8e8" }}>{advPair[1]}</div>
          </div>
          {!advSubmitted ? (
            <>
              <textarea value={advAnswer} onChange={e => setAdvAnswer(e.target.value)} rows={3} placeholder="What do they share?" style={{ ...S.textarea, marginBottom: "12px", fontStyle: advAnswer ? "italic" : "normal" }} onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                <button onClick={() => advAnswer.trim() && setAdvSubmitted(true)} disabled={!advAnswer.trim()} style={{ ...S.btnPrimary, opacity: advAnswer.trim() ? 1 : 0.3 }}>COMMIT</button>
                <button onClick={() => { setAdvPair(pick(ADVERSARIAL_PAIRS)); setAdvAnswer(""); setAdvSubmitted(false); }} style={S.btnGhost}>SKIP ↺</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: "16px 18px", border: "1px solid rgba(134,239,172,0.2)", borderRadius: "8px", background: "rgba(134,239,172,0.02)", fontSize: "18px", fontStyle: "italic", color: "#c8c0b0", lineHeight: "1.65", marginBottom: "14px" }}>{advAnswer}</div>
              <button onClick={() => { setAdvHistory(h => [{ pair: advPair, answer: advAnswer }, ...h].slice(0, 6)); setAdvPair(pick(ADVERSARIAL_PAIRS)); setAdvAnswer(""); setAdvSubmitted(false); }} style={S.btnPrimary}>NEW PAIR ↺</button>
            </>
          )}
          {advHistory.length > 0 && (
            <div style={{ marginTop: "28px" }}>
              <div style={S.divider}>— PREVIOUS —</div>
              {advHistory.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "7px", opacity: 1 - i*0.13 }}>
                  <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#7060a0", marginBottom: "5px" }}>{h.pair[0]} + {h.pair[1]}</div>
                  <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.55" }}>{h.answer}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}


function IndirectFraming() {
  const [frame, setFrame] = useState(() => pick(INDIRECT_FRAMES));
  const [nominal, setNominal] = useState(() => pick(INDIRECT_NOMINALS));
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [showRef, setShowRef] = useState(false);

  const combined = frame.replace("[X]", nominal);

  const handleNew = () => {
    if (sentence.trim()) setHistory(h => [{ sentence, combined }, ...h].slice(0, 6));
    setSubmitted(false);
    setFrame(pick(INDIRECT_FRAMES));
    setNominal(pick(INDIRECT_NOMINALS));
    setSentence("");
  };

  return (
    <>
      <p style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", textAlign: "center", marginBottom: "24px", lineHeight: "1.65" }}>
        Indirect framing places a state at a distance from the self — as if it arrived rather than was generated. The listener receives it without needing to claim it.
      </p>

      {/* Combined prompt */}
      <div style={{ border: "1px solid rgba(167,139,250,0.25)", borderRadius: "10px", padding: "22px 20px", background: "rgba(167,139,250,0.05)", marginBottom: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#9b8ed8", marginBottom: "14px" }}>YOUR PROMPT</div>
        <div style={{ fontSize: "24px", fontStyle: "italic", color: "#d8c8ff", lineHeight: "1.5", marginBottom: "16px" }}>
          "{combined}"
        </div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ padding: "5px 12px", border: "1px solid rgba(192,132,252,0.3)", borderRadius: "5px", background: "rgba(192,132,252,0.07)", fontSize: "11px", fontFamily: "monospace", color: "#C084FC" }}>
            FRAME: {frame.replace("[X]", "___")}
          </div>
          <div style={{ padding: "5px 12px", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "5px", background: "rgba(167,139,250,0.07)", fontSize: "11px", fontFamily: "monospace", color: "#A78BFA" }}>
            NOMINAL: {nominal}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "12px" }}>
        — COMPLETE THE SENTENCE —
      </div>

      {submitted ? (
        <div style={{ padding: "18px 20px", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "10px", background: "rgba(167,139,250,0.03)", fontSize: "17px", lineHeight: "1.75", fontStyle: "italic", color: "#c8c0d8", marginBottom: "12px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#A78BFA", marginBottom: "8px", opacity: 0.6 }}>COMMITTED</div>
          {sentence}
        </div>
      ) : (
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)}
          placeholder={`"${combined} ..."`}
          rows={3}
          style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }}
          onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
          autoFocus
        />
      )}

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
        {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
        <button onClick={handleNew} style={S.btnGhost}>NEW PROMPT ↺</button>
      </div>

      {/* Reference toggle */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
        <div onClick={() => setShowRef(r => !r)} style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", cursor: "pointer", marginBottom: "14px" }}>
          — {showRef ? "HIDE" : "SHOW"} REFERENCE —
        </div>
        {showRef && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#C084FC", marginBottom: "10px" }}>INDIRECT FRAMES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {INDIRECT_FRAMES.map((f, i) => (
                  <div key={i} style={{ padding: "7px 11px", border: "1px solid rgba(192,132,252,0.15)", borderRadius: "4px", background: "rgba(192,132,252,0.04)", fontSize: "17px", fontStyle: "italic", color: "#a090c0" }}>
                    "{f.replace("[X]", "___")}"
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#A78BFA", marginBottom: "10px" }}>NOMINALIZATIONS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {INDIRECT_NOMINALS.map((n, i) => (
                  <span key={i} style={{ padding: "3px 9px", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "4px", background: "rgba(167,139,250,0.05)", fontSize: "18px", fontStyle: "italic", color: "#a090c0" }}>{n}</span>
                ))}
              </div>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "16px 18px", background: "rgba(255,255,255,0.09)" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", marginBottom: "12px" }}>WHY IT WORKS</div>
              <p style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", lineHeight: "1.7", margin: 0 }}>
                Normal framing: <span style={{ color: "#6a6075" }}>"I felt clarity."</span> — the self claims the state. The listener evaluates whether you're credible.<br /><br />
                Indirect framing: <span style={{ color: "#9070b0" }}>"There was a clarity that arrived without warning."</span> — the state exists independently of the self. No claim to evaluate. The listener receives the state without needing to decide whether to believe it.<br /><br />
                The nominalization freezes the process into a thing. The indirect frame makes that thing arrive from outside. Together, they deliver the state without an author.
              </p>
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: "28px" }}>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "7px", opacity: 1 - i * 0.12 }}>
              <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#7060a0", marginBottom: "5px", fontStyle: "italic" }}>"{h.combined}..."</div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.6" }}>{h.sentence}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


function SensoryStacker() {
  const [object, setObject] = useState(() => pick(SENSORY_OBJECTS));
  const [selections, setSelections] = useState({});
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [customObject, setCustomObject] = useState("");
  const [usingCustom, setUsingCustom] = useState(false);

  const activeObject = usingCustom && customObject.trim() ? customObject.trim() : object;

  const toggle = (bank, quality) => {
    setSelections(s => {
      const current = s[bank] || [];
      if (current.includes(quality)) {
        return { ...s, [bank]: current.filter(q => q !== quality) };
      }
      if (current.length >= 2) return s; // max 2 per sense
      return { ...s, [bank]: [...current, quality] };
    });
  };

  const buildDescriptor = () => {
    const parts = [];
    Object.entries(SENSORY_BANKS).forEach(([bank, data]) => {
      const sel = selections[bank] || [];
      parts.push(...sel);
    });
    if (parts.length === 0) return activeObject;
    return parts.join(" ") + " " + activeObject;
  };

  const descriptor = buildDescriptor();
  const totalSelected = Object.values(selections).flat().length;
  const sensesUsed = Object.entries(selections).filter(([,v]) => v.length > 0).length;

  const handleNew = () => {
    if (sentence.trim()) setHistory(h => [{ sentence, descriptor }, ...h].slice(0, 5));
    setObject(pick(SENSORY_OBJECTS));
    setSelections({});
    setSentence("");
    setSubmitted(false);
    setCustomObject("");
    setUsingCustom(false);
  };

  return (
    <>
      <p style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", textAlign: "center", marginBottom: "22px", lineHeight: "1.65" }}>
        Stack descriptors from different senses onto the same object. Then use the full descriptor in a sentence.
      </p>

      {/* Object selector */}
      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px 18px", background: "rgba(255,255,255,0.09)", marginBottom: "18px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", marginBottom: "12px" }}>YOUR OBJECT</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: "20px", fontStyle: "italic", color: "#d8c8ff" }}>{activeObject}</div>
          <button onClick={() => { setObject(pick(SENSORY_OBJECTS)); setSelections({}); setSentence(""); setSubmitted(false); setUsingCustom(false); setCustomObject(""); }} style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "2px", color: "#7060a0", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px", padding: "4px 10px", cursor: "pointer" }}>SHUFFLE</button>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", alignItems: "center" }}>
          <input value={customObject} onChange={e => { setCustomObject(e.target.value); setUsingCustom(true); }} placeholder="or type your own..." style={{ ...S.input, fontSize: "17px", padding: "8px 12px", flex: 1 }} onFocus={e => { e.target.style.borderColor = "rgba(167,139,250,0.4)"; setUsingCustom(true); }} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
        </div>
      </div>

      {/* Sense banks */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
        {Object.entries(SENSORY_BANKS).map(([bank, data]) => {
          const sel = selections[bank] || [];
          return (
            <div key={bank} style={{ border: `1px solid ${sel.length > 0 ? data.color + "40" : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 14px", background: sel.length > 0 ? `${data.color}06` : "transparent", transition: "all 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: data.color }}>{bank.toUpperCase()}</span>
                <span style={{ fontSize: "9px", color: "#6050a0", fontFamily: "monospace" }}>{sel.length}/2</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {(data.qualities || []).concat(data.colors || []).map((q, i) => {
                  const active = sel.includes(q);
                  return (
                    <button key={i} onClick={() => toggle(bank, q)} style={{ padding: "3px 9px", border: `1px solid ${active ? data.color + "80" : "rgba(255,255,255,0.12)"}`, borderRadius: "4px", background: active ? `${data.color}20` : "transparent", color: active ? data.color : "#3a3050", fontSize: "11px", fontStyle: "italic", cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live descriptor */}
      {totalSelected > 0 && (
        <div style={{ border: "1px solid rgba(167,139,250,0.2)", borderRadius: "8px", padding: "14px 16px", background: "rgba(167,139,250,0.04)", marginBottom: "18px", textAlign: "center" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#9b8ed8", marginBottom: "8px" }}>
            DESCRIPTOR — {sensesUsed} {sensesUsed === 1 ? "sense" : "senses"}
          </div>
          <div style={{ fontSize: "21px", fontStyle: "italic", color: "#d8c8ff", lineHeight: "1.4" }}>
            {descriptor}
          </div>
        </div>
      )}

      {/* Write sentence */}
      <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "12px" }}>
        — NOW USE IT IN A SENTENCE —
      </div>

      {submitted ? (
        <div style={{ padding: "18px 20px", border: "1px solid rgba(134,239,172,0.2)", borderRadius: "10px", background: "rgba(134,239,172,0.02)", fontSize: "17px", lineHeight: "1.75", fontStyle: "italic", color: "#c8c0b0", marginBottom: "12px" }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>COMMITTED</div>
          {sentence}
        </div>
      ) : (
        <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder={totalSelected > 0 ? `Use "${descriptor}" in a sentence...` : "Stack some descriptors first, then write your sentence..."} rows={3} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} />
      )}

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "36px" }}>
        {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
        <button onClick={handleNew} style={S.btnGhost}>NEW OBJECT ↺</button>
      </div>

      {/* Tip */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#6050a0", marginBottom: "12px", textAlign: "center" }}>— THE PRINCIPLE —</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            ["One sense", "the car", "Places an object. Nothing more."],
            ["Two senses", "the red car", "Adds color. Still generic."],
            ["Three senses", "the shiny bright red car", "Visual + light quality + color. Now the brain sees it."],
            ["Cross-sense", "the salty blue sea", "Taste arriving through a visual. The crossover creates presence."],
          ].map(([label, ex, note]) => (
            <div key={label} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ fontSize: "9px", fontFamily: "monospace", color: "#7060a0", minWidth: "80px", paddingTop: "2px" }}>{label}</div>
              <div>
                <div style={{ fontSize: "18px", fontStyle: "italic", color: "#a090c0", marginBottom: "2px" }}>"{ex}"</div>
                <div style={{ fontSize: "11px", color: "#7060a0" }}>{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "7px", opacity: 1 - i * 0.12 }}>
              <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#7060a0", marginBottom: "5px", fontStyle: "italic" }}>{h.descriptor}</div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.6" }}>{h.sentence}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


function Guide() {
  const [showNeuro, setShowNeuro] = useState(false);

  const sections = [
    {
      title: "Drift Engine",
      color: "#A78BFA",
      tag: "FREE",
      what: "The core practice tool. You get 3-4 phrases drawn from six banks of language patterns used in therapy, coaching, storytelling, and clear communication. Your job is to weave them into a natural sentence.",
      why: "These language patterns come from communication research, therapeutic practice, and skilled storytelling. Practising them builds the kind of natural fluency that makes conversations feel effortless and genuine.",
      how: "Tap NEW DEAL to get a fresh hand. Write your sentence in the box. The dots at the top light up as you use each phrase. Hit COMMIT when you're done. Your previous sentences stack below so you can track your progress.",
      tip: "Don't try to use all the phrases first — write the sentence, then see which ones fell in naturally. That's the real test.",
      banks: [
        ["Subordinating Conjunctions", "#C084FC", "Opening words that pull the mind forward before it can evaluate. 'Because', 'by the time', 'the moment'. Start a clause with one of these and the sentence has to keep going."],
        ["Soft Qualifiers", "#67E8F9", "Words that blur the edges of a statement — 'it felt like', 'somehow', 'in a way'. They make things feel experiential rather than factual, so the listener processes them internally instead of evaluating them."],
        ["Nominalizations", "#86EFAC", "Abstract nouns with no fixed meaning — 'awareness', 'clarity', 'transformation'. Because they're vague, the listener fills them with their own meaning. That's the point."],
        ["Unspecified Verbs", "#FCD34D", "Verbs that don't say how, when, or in what way — 'notice', 'sense', 'drift'. The listener projects their own experience onto the action."],
        ["Temporal Drift", "#A78BFA", "Phrases that blur the listener's sense of when things are happening — 'somewhere between then and now', 'before I even realized'. Softens the timeline so the mind floats rather than anchors."],
        ["Mundane Witness", "#94A3B8", "Small, useless, specific details — 'the fluorescent light was humming just slightly too loud'. Real memories contain details that serve no purpose. These make everything feel remembered rather than invented."],
      ],
    },
    {
      title: "Drift Engine",
      color: "#A78BFA",
      tag: "FREE",
      what: "The core practice tool. Six banks of language patterns drawn from communication research, therapeutic practice, and Ericksonian storytelling. You deal 3-4 cards and weave them into one natural sentence.",
      why: "These patterns work by targeting different neurological mechanisms simultaneously. Nominalizations activate the Default Mode Network. Temporal drift dissolves the timeline anchor. Witness details bypass evaluation through specificity. Unspecified verbs trigger internal projection. Subordinating conjunctions overload working memory. Together they create a sentence the critical faculty cannot fully evaluate before the suggestion has landed.",
      how: "Tap PRACTICE to get a hand of cards. Write a sentence that uses as many as possible. The dots light up as you use each phrase. Tap PICK to choose which banks to deal from — useful for focused drilling on specific pattern types. Tap BANKS to browse all phrases.",
      tip: "Practice until the patterns stop feeling like patterns. The goal is a sentence that sounds like something a real person would actually say — and happens to be doing four things at once.",
      banks: [
        ["Subordinating Conjunctions", "#C084FC", "Opening words that pull the mind forward: 'because', 'by the time', 'the moment'. Start a clause with one of these and the sentence has to keep going."],
        ["Soft Qualifiers", "#67E8F9", "Words that blur the edges: 'it felt like', 'somehow', 'in a way'. Make things feel experiential rather than factual."],
        ["Nominalizations", "#86EFAC", "Abstract nouns with no fixed referent: 'awareness', 'clarity', 'transformation'. The listener fills them with their own meaning."],
        ["Unspecified Verbs", "#FCD34D", "Action words that don't specify how: 'notice', 'sense', 'drift'. The listener projects their own experience onto the action."],
        ["Temporal Drift", "#A78BFA", "Phrases that loosen the timeline: 'somewhere between then and now', 'before I even realized'. The mind floats rather than anchors."],
        ["Mundane Witness", "#94A3B8", "Specific useless details: 'the fluorescent light was humming just slightly too loud'. Too specific to be invented — the critical faculty accepts the whole story."],
      ],
    },
    {
      title: "Confusion Forge",
      color: "#C084FC",
      tag: "ADVANCED",
      what: "A bank of confusion statements — language that sounds like it should make sense but leaves the mind with no solid ground to stand on. You deal 2-3 cards, use one or more in conversation, then follow with a short guiding phrase.",
      why: "When the mind is busy trying to parse a confusing statement it temporarily stops evaluating incoming content. That gap is where a helpful guiding phrase lands most naturally — the listener receives it before the critical process restarts.",
      how: "Deal a hand of confusion statements. Deliver one in conversation. Then immediately follow with a short positive guiding phrase — something like 'and you can just let go' or 'and that's where the clarity arrives'. The confusion creates the opening. The phrase walks through it.",
      tip: "Keep the guiding phrase short and positive. One clause maximum. The confusion already did the work — the phrase just needs to arrive cleanly while the mind is still reorienting.",
      banks: [
        ["Temporal Negation", "#C084FC", "'What hasn't occurred yet has no place in the time that isn't now.' Time and absence blur together — the when and the what-didn't-happen collapse into each other."],
        ["Referential Drift", "#67E8F9", "'What was there before hasn't been what it isn't.' The subject keeps shifting. The brain reaches for what's being described and keeps missing."],
        ["Nested Negation", "#86EFAC", "'People not knowing what hasn't been can't work with what isn't there.' Absence stacked inside absence — the brain can't hold two non-things as referents simultaneously."],
        ["Perceptual Loop", "#FCD34D", "'Not knowing what hasn't been perceived can't undo what isn't a feeling.' Perception and negation fold back on each other until the sentence has no anchor."],
        ["Knowledge Blur", "#F9A8D4", "'Having a perspective of something that makes a knowing of what isn't the knowledge you can perceive.' Understanding and not-understanding occupy the same grammatical space."],
      ],
    },
    {
      title: "Embedded Commands",
      color: "#67E8F9",
      tag: "ADVANCED",
      what: "A trainer for weaving helpful guidance into natural conversation. Instead of direct instructions that can feel pressuring, these patterns deliver support in a way that feels easy and unforced.",
      why: "Direct instructions can create resistance, even when the intention is helpful. Woven guidance feels natural and self-directed — the person arrives at the helpful place without feeling pushed. This is widely used in coaching, therapy, teaching, and leadership.",
      how: "You get carrier sentences marked with * around the guiding phrase. Write your own sentence using the carrier pattern with a helpful phrase of your own. In real conversation, the phrasing flows naturally.",
      tip: "The best guiding phrases are complete and positive. 'Feel completely at ease' lands clearly. 'Don't be anxious' is less effective — always frame toward where you want them to go, not away from where they are.",
      banks: [
        ["Awareness Frames", "#C084FC", "The carrier is about noticing. The command rides inside. 'You might start to *feel completely at ease*' — the surface is a possibility, the instruction is the command."],
        ["Third Person Displacement", "#67E8F9", "The instruction is given to a fictional someone else. The listener maps it onto themselves without being asked. No source to resist."],
        ["Negation Delivery", "#86EFAC", "The command is negated on the surface. The unconscious processes it anyway — it can't not. 'Don't *feel too comfortable* just yet.'"],
        ["Question Embedding", "#FCD34D", "Questions invite rather than push. 'Have you noticed how easy it is to *just let something settle*?' The command arrives as a discovery."],
        ["Story Commands", "#F9A8D4", "The instruction belongs to a character in a story. No author in the room to evaluate or resist. 'He said, very quietly, you already know what to do.'"],
      ],
    },
    {
      title: "Influence Principles",
      color: "#FCD34D",
      tag: "ADVANCED",
      what: "Six principles of ethical communication, trust-building, and genuine persuasion — each with natural language frames that put the principle into practice.",
      why: "Understanding these principles makes you a more honest, effective communicator. They appear everywhere — in great leadership, teaching, therapy, and sales. The goal is to use them with genuine care for the person you're talking to.",
      how: "BUILD mode deals 2-3 principles with example frames. Write one sentence that carries all of them at once. REFERENCE mode lets you browse each principle and its frames individually.",
      tip: "The most effective communication naturally combines several principles at once. Genuine generosity + real expertise + honest timing creates conversations people genuinely respond to.",
      banks: [
        ["Reciprocity", "#C084FC", "Give first, without conditions. The return is automatic and unconscious. Information, attention, and honesty all trigger it — not just material gifts."],
        ["Consistency", "#67E8F9", "People become their commitments. Once someone has agreed to something small, larger requests feel like continuation rather than compliance."],
        ["Social Proof", "#86EFAC", "In uncertain situations, people look to others. One specific story about one specific person does more than any statistic."],
        ["Authority", "#FCD34D", "Credibility through demonstrated knowledge, not announced credentials. Specificity is more authoritative than titles."],
        ["Liking", "#F9A8D4", "Influence travels on relationship. Similarity — even in small details — is the fastest bridge. Genuine interest in the other person is the most powerful signal."],
        ["Scarcity", "#FB923C", "Loss aversion is twice as strong as the equivalent gain. Honest scarcity — named without manipulation — is more persuasive than artificial urgency."],
      ],
    },
    {
      title: "Metaphor Forge",
      color: "#86EFAC",
      tag: "ADVANCED",
      what: "A guided tool for building original metaphors from scratch using two questions, then extending them into full systems.",
      why: "A metaphor that works doesn't need explanation — the listener finishes it before you do. A metaphor that needs explanation is a simile in disguise. This tool trains the difference.",
      how: "GUIDED mode walks you through four stages with your chosen X — Function, Characteristic, Extension, Test. ADVERSARIAL mode drops two unrelated objects and makes you find the similarity. That second mode is where the real fluency develops.",
      tip: "The first three answers to 'what else does that?' will be obvious. The interesting ones live past those. Push to five or six before you choose.",
      banks: [
        ["Function", "#C084FC", "What does X do? What else does that? Function comparisons surprise because things that seem unrelated share behaviors constantly."],
        ["Characteristic", "#67E8F9", "What does X have? What else has that? The metaphor that shares both function AND characteristic with X is the one that feels inevitable."],
        ["Extension", "#86EFAC", "Push the metaphor until it becomes a system. If the unconscious is a house — what are the rooms? The locked ones? A metaphor that can be extended carries a full story."],
        ["Test", "#FCD34D", "State it in one sentence. If they're waiting for you to explain, compress further. A metaphor works when the listener completes it before you do."],
      ],
    },
    {
      title: "Indirect Framing",
      color: "#A78BFA",
      tag: "ADVANCED",
      what: "A trainer for describing internal states as if they arrived from outside — rather than being generated by the self.",
      why: "Normal framing: 'I felt clarity.' The self claims the state, the listener evaluates your credibility. Indirect framing: 'There was a clarity that arrived without warning.' The state exists independently. No claim to evaluate. The listener receives it.",
      how: "You get a pre-built frame + nominalization combination as a prompt — something like 'there was a knowing that...' — and you complete the sentence. The reference section shows all frames and nominalizations separately so you can build your own combinations.",
      tip: "The frame distances the state from the self. The nominalization freezes it into a thing. Together they deliver the state without an author — which means nothing to resist.",
      banks: [
        ["Indirect Frames", "#C084FC", "Phrases that place the state at a distance: 'there was a...', 'a kind of... settled in', 'I noticed what might have been a...'. The state happens to you rather than coming from you."],
        ["Nominalizations", "#A78BFA", "The same abstract nouns from the Drift Engine — awareness, clarity, understanding — but now delivered indirectly. The combination is more powerful than either alone."],
      ],
    },
    {

    },
    {
      title: "Sensory Stacker",
      color: "#94A3B8",
      tag: "ADVANCED",
      what: "A trainer for building rich, multi-sense descriptors that place an object vividly in the listener's imagination.",
      why: "Specific, multi-sense language is the difference between a story people hear and a story they experience. Great writers, teachers, and communicators naturally describe the world across multiple senses — this tool trains that skill deliberately.",
      how: "You get a plain object. Select up to two qualities from each sense bank — Visual, Tactile, Auditory, Olfactory, Atmosphere. The descriptor builds live. Then write a sentence using it.",
      tip: "The unexpected sense is the most powerful move. 'Salty blue sea' works because taste arrives through a visual description. That crossover creates presence — the listener is suddenly in the scene.",
      banks: [
        ["Visual", "#FCD34D", "Color and light qualities — shiny, faded, gleaming, pale. The most obvious sense and the one people over-rely on. Combine with others."],
        ["Tactile", "#86EFAC", "Temperature, texture, weight — cold, rough, dense, slick. Often more evocative than visual because the body responds directly."],
        ["Auditory", "#67E8F9", "Sound qualities that belong to the object even in silence — humming, hollow, settling, still. A room can be silent and still have an auditory quality."],
        ["Olfactory", "#C084FC", "Smell descriptors that locate the object in a physical world — dusty, metallic, earthy, salt-tinged. Smell bypasses the critical faculty faster than any other sense."],
        ["Atmosphere", "#F9A8D4", "The felt quality of the object's presence — abandoned, waiting, charged, intimate. Not a sense exactly, but the thing all the senses add up to."],
      ],
    },
  ];

  const [open, setOpen] = useState(null);
  const [openInduction, setOpenInduction] = useState(null);
  const [openLevel, setOpenLevel] = useState(null);

  return (
    <>
      <p style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", textAlign: "center", marginBottom: "24px", lineHeight: "1.65" }}>
        What each section does, why it works, and how to get the most out of it.
      </p>

      {/* Induction Guide */}
      <div style={{ border: "1px solid rgba(103,232,249,0.3)", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
        <div onClick={() => setOpenInduction(o => o === "main" ? null : "main")} style={{ padding: "16px 20px", cursor: "pointer", background: openInduction === "main" ? "rgba(103,232,249,0.08)" : "rgba(103,232,249,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginRight: "12px" }}>GUIDE</span>
            <span style={{ fontSize: "17px", color: "#d8f0f8" }}>Induction Guide</span>
          </div>
          <span style={{ fontSize: "10px", color: "#67E8F9" }}>{openInduction === "main" ? "▲" : "▼"}</span>
        </div>
        {openInduction === "main" && (
          <div style={{ padding: "0 20px 24px" }}>
            <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", lineHeight: "1.7", marginBottom: "24px" }}>
              Every section of this app trains one component. An induction is what happens when they run together — a natural conversation that moves someone from ordinary waking attention into a deep, receptive state without them noticing the transition. The goal at every level is the same: the technique disappears into the voice.
            </p>
            <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", lineHeight: "1.7", marginBottom: "24px" }}>
              Bandler's core insight — from his transcripts and work — is that trance is primarily induced through story, sound, and state, not through progressive relaxation scripts. He would tell a story in which the outcome had already happened. By the time the story ended, the change was a done deal inside the narrative. The listener's critical faculty was busy following the story. The suggestion arrived before the evaluation started.
            </p>

            {/* LEVEL 1 */}
            {[
              {
                level: "01",
                label: "BEGINNER",
                title: "The Witness + Drift Formula",
                color: "#86EFAC",
                formula: "One witness detail → temporal drift → open ending",
                mechanism: "The witness detail bypasses evaluation because it is too specific to be fabricated — the critical faculty accepts it and follows. The temporal drift softens the timeline while trust is still building. The open ending leaves a working memory loop unclosed. The brain stays in a receptive, searching state waiting for the resolution that never comes.",
                steps: [
                  "Observe something real and specific about the environment or the person — one useless detail that serves no narrative purpose.",
                  "Begin a short story or observation that contains one temporal drift phrase. Keep it casual.",
                  "End without resolving. Let the last sentence trail into something the brain cannot close.",
                ],
                example: "You know what's funny — I was standing outside earlier and there was this dark wet pavement, you know the kind, and I couldn't tell you when exactly the light changed but at some point it got this quality that made everything feel slightly further away than it was. I was just standing there and I remember thinking, huh.",
                note: "One witness detail (the light, the quality of it). One temporal drift ('couldn't tell you when exactly', 'at some point'). The ending — 'I remember thinking, huh' — is an open loop the listener's brain reaches into and finds nothing to grip. They stay open.",
              },
              {
                level: "02",
                label: "INTERMEDIATE",
                title: "The Story Bridge Formula",
                color: "#FCD34D",
                formula: "Third-person story → done-deal framing → soft landing",
                mechanism: "Bandler's core move: tell a story in which the change has already happened to someone else. The critical faculty follows the narrative. The suggestion arrives inside the story before evaluation can start. The done-deal framing — 'the decision had already been made somewhere' — presupposes completion. The listener's brain maps the story onto themselves without being asked to.",
                steps: [
                  "Move directly into a third-person story — someone you knew, a client, a situation. No preamble.",
                  "Inside the story, make the change a done deal. Past tense. Already happened. The person just caught up to it.",
                  "Stack 2-3 nominalizations inside the story so the listener has to search internally for their own meaning.",
                  "End on something small and true. Not a conclusion — just the last image. Let it sit.",
                ],
                example: "I had a guy once — he'd been carrying the same thing for about three years. Came in, sat down, and we talked about something completely unrelated for about twenty minutes. And I remember at some point his hands just stopped moving. Just rested there. And he looked up and said, yeah. Like that was the whole sentence. Picked up his keys and left. I still think about that sometimes.",
                note: "No technique visible anywhere. The change happens inside the story — the hands stopping, the yeah, the keys. The nominalization is the 'something' he'd been carrying — undefined, so the listener fills it with their own thing. 'I still think about that sometimes' is the open close. No instruction. No landing. The loop stays open.",
              },
              {
                level: "03",
                label: "ADVANCED",
                title: "The Full Stack Formula",
                color: "#C084FC",
                formula: "Story → full pattern stack → time compression → confusion bridge → embedded command → open close",
                mechanism: "The story is doing everything simultaneously. Witness details build credibility so the critical faculty relaxes. Temporal drift loosens the timeline. Nominalizations activate the DMN — the listener searches internally. Unspecified verbs trigger projection. Subordinating conjunctions overload working memory. Time compression (Bandler's signature move) makes the outcome feel inevitable — 'by morning we had a design'. The confusion statement dissolves whatever critical evaluation remains. The embedded command lands in that gap. The open close keeps the brain in a searching, receptive state.",
                steps: [
                  "Enter the story immediately — no setup. A person, a place, one useless specific detail.",
                  "Stack inside the story: witness detail + temporal drift + nominalization + unspecified verb + soft qualifier.",
                  "Use time compression at the outcome — make the change feel fast and inevitable. 'At some point', 'by the time', 'before I even noticed'.",
                  "Deliver one confusion statement — something grammatically plausible that has no resolvable meaning. The critical faculty reaches for the ground and doesn't find it.",
                  "Immediately follow with one short embedded command. Positive, present tense, one clause.",
                  "Close on a small, true, unresolved image. Not a conclusion. The last thing should have nowhere to land.",
                ],
                example: "I had a guy come in once — long drive, old car, cracked dark leather on the wheel. Sat down in this soft grey chair. And we talked, and at some point his hands just stopped. Not decided to stop. Just — stopped. And there was this pale amber light through the blinds, kind of warm and still. And we kept talking, I couldn't tell you about what exactly, the way conversations go. And on the table between us there was this dark oak desk — smooth, heavy — and at some point I noticed the thing he'd walked in with was just gone. Not resolved. Just not there anymore. And what hadn't been there before the knowing of it makes it so that you can just — let that be.",
                note: "Sensory details land first — cracked dark leather, soft grey chair, pale amber light, dark oak desk. Each one is stacked (two senses minimum) and placed casually so they register below the story. The critical faculty follows the narrative. The sensory details are doing their work underneath it. The confusion statement — 'what hadn't been there before the knowing of it' — has no floor. The embedded command arrives in that gap. Nothing resolves.",
              },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: "24px", border: `1px solid ${item.color}25`, borderRadius: "10px", overflow: "hidden" }}>
                <div onClick={() => setOpenLevel(o => o === i ? null : i)} style={{ padding: "14px 18px", cursor: "pointer", background: openLevel === i ? `${item.color}10` : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.3s" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: item.color }}>LEVEL {item.level}</span>
                    <span style={{ fontSize: "16px", color: "#d8c8f0" }}>{item.title}</span>
                  </div>
                  <span style={{ fontSize: "9px", color: item.color }}>{openLevel === i ? "▲" : "▼"}</span>
                </div>
                {openLevel === i && (
                  <div style={{ padding: "0 18px 20px" }}>
                    {/* Formula */}
                    <div style={{ padding: "8px 12px", background: `${item.color}10`, borderRadius: "5px", marginBottom: "16px" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: item.color, marginBottom: "4px" }}>FORMULA</div>
                      <div style={{ fontSize: "14px", color: item.color, fontStyle: "italic" }}>{item.formula}</div>
                    </div>

                    {/* Mechanism */}
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", marginBottom: "6px" }}>WHY IT WORKS</div>
                      <p style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.7", margin: 0 }}>{item.mechanism}</p>
                    </div>

                    {/* Steps */}
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", marginBottom: "10px" }}>THE STEPS</div>
                      {item.steps.map((step, j) => (
                        <div key={j} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "10px", fontFamily: "monospace", color: item.color, minWidth: "20px", paddingTop: "2px" }}>{j+1}.</span>
                          <span style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.6" }}>{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Example */}
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", marginBottom: "10px" }}>EXAMPLE</div>
                      <div style={{ padding: "14px 16px", border: `1px solid ${item.color}30`, borderRadius: "8px", background: `${item.color}06`, fontSize: "15px", fontStyle: "italic", color: "#c8b8e8", lineHeight: "1.8" }}>
                        "{item.example}"
                      </div>
                    </div>

                    {/* Note */}
                    <div style={{ padding: "10px 14px", borderLeft: `2px solid ${item.color}50`, borderRadius: "4px" }}>
                      <div style={{ fontSize: "13px", color: "#7060a0", fontStyle: "italic", lineHeight: "1.6" }}>{item.note}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Universal rules */}
            <div style={{ marginTop: "8px", padding: "16px 18px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", marginBottom: "14px" }}>RULES THAT APPLY AT EVERY LEVEL</div>
              {[
                ["Slow down at the images.", "The images are doing the neurological work. The words are just the frame. Most beginners rush past the detail that would have landed."],
                ["Never announce the technique.", "The moment the listener feels a technique being applied, the critical faculty reactivates. Everything should sound like genuine observation."],
                ["The story must be true, or close enough.", "Fabricated stories flatten under conversational pressure. Real ones carry the kind of specific, useless detail that cannot be invented — the creak of the oars, the paint peeling at the bow."],
                ["End before the resolution.", "The open ending is not a stylistic choice. It is the mechanism. A file left open in working memory keeps the brain in a receptive, searching state."],
                ["Silence after the command.", "After the embedded command or the open close, stop talking. The silence is not empty — it is where the suggestion is processing. Filling it destroys the work."],
              ].map(([rule, desc], i) => (
                <div key={i} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ fontSize: "13px", color: "#c8b8e0", marginBottom: "4px" }}>{rule}</div>
                  <div style={{ fontSize: "13px", color: "#7060a0", fontStyle: "italic", lineHeight: "1.55" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ericksonian Storytelling Panel */}
      <div style={{ border: "1px solid rgba(134,239,172,0.3)", borderRadius: "10px", overflow: "hidden", marginBottom: "10px" }}>
        <div onClick={() => setOpenInduction(o => o === "story" ? null : "story")} style={{ padding: "16px 20px", cursor: "pointer", background: openInduction === "story" ? "rgba(134,239,172,0.08)" : "rgba(134,239,172,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginRight: "12px" }}>STORYTELLING</span>
            <span style={{ fontSize: "17px", color: "#d8f8e8" }}>Ericksonian Storytelling</span>
          </div>
          <span style={{ fontSize: "10px", color: "#86EFAC" }}>{openInduction === "story" ? "▲" : "▼"}</span>
        </div>
        {openInduction === "story" && (
          <div style={{ padding: "0 20px 24px" }}>
            <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", lineHeight: "1.75", marginBottom: "20px" }}>
              The brain cannot fully distinguish between a vividly told story and a real experience. When someone is absorbed in a story, their sensory and motor cortices activate identically to when the events are actually happening. This means a well-constructed story is not an analogy for trance — it produces trance. No formal induction is required if the absorption is deep enough.
            </p>

            {[
              {
                title: "The Brain as a Prediction Machine",
                color: "#86EFAC",
                body: "The brain is constantly building a model of what comes next — predicting, filling gaps, expecting. When that model is violated — when something happens that shouldn't — the listener enters a state of open searching. They cannot move forward until the gap is resolved. That gap is your entry point. A man extends his hand for a handshake and then stops. A letter arrives and goes into a drawer, unopened. The prediction breaks and the listener leans in, receptive, waiting.",
              },
              {
                title: "Involuntary Attention — Four Triggers",
                color: "#67E8F9",
                body: "These four things capture attention without the listener's consent:

1. An unanswered question — Why would a man drive to the edge of town every Thursday at midnight?

2. An unresolved sequence — She wrote the letter. Sealed it. Addressed it. Held it over the bin.

3. A violated expectation — The funeral was the first time she had laughed in years.

4. Knowledge the listener senses you have and they don't — He had known for twenty years. He'd never told anyone.

Any of these holds attention automatically. The listener cannot choose not to follow.",
              },
              {
                title: "The Three-Descriptor Rule",
                color: "#FCD34D",
                body: "Describe objects using three descriptors. Not one — too vague, the mind wanders. Not five — too many, conscious cataloguing begins. Three closes the loop precisely and renders a complete internal image.

The fat gray rabbit. The orange spiral vase. A small brass compass with a cracked face.

Three descriptors and the object appears inside the listener before the critical faculty has decided whether to accept it. Specificity bypasses scrutiny because the critical mind does not interrogate specific things the way it interrogates vague ones.",
              },
              {
                title: "Multi-Sensory Language",
                color: "#C084FC",
                body: "Single-sense description stays shallow. Multi-sense description creates full somatic absorption — the listener's body enters the scene.

The bakery at six in the morning: the burn of yeast in the back of the throat, flour dust catching the light, the soft thud of dough on the counter, warmth pressing against your face before you even opened the door.

Four senses in four clauses. The listener is now inside the room. Their body is there before their mind has agreed to follow.",
              },
              {
                title: "Ambiguity as Projective Space",
                color: "#A78BFA",
                body: "An unspecified detail forces the unconscious to generate content. Whatever the listener fills the gap with is their own material — their own associations, their own meaning. They have become the co-creator of the suggestion.

She found what he had left for her on the kitchen table.

He came back changed. Nobody could quite say how.

The listener's unconscious rushes to fill the gap. Whatever arrives is theirs — which means it already fits perfectly. You handed them a space. They built the suggestion themselves.",
              },
              {
                title: "Show, Never Tell",
                color: "#F9A8D4",
                body: "Motivations, fears and desires are revealed through action, never stated directly. The critical mind accepts what it concludes for itself far more deeply than what it is told.

TELLING: She was afraid of being abandoned.

SHOWING: When he was twenty minutes late, she had already decided what she would say when he didn't come back.

The listener concludes 'she is afraid of abandonment' without being told. Because they reached that conclusion themselves, it carries full weight — and cannot be argued with.",
              },
              {
                title: "Open Loops and Seeding",
                color: "#86EFAC",
                body: "Create an unresolved tension early — something promised but not yet delivered. The brain compulsively seeks closure. Open loops hold the listener in a receptive, searching state until you choose to close them.

Seed transformation early: 'She didn't know it yet, but she was already different from the woman who had walked in through that door.'

The destination is planted before the journey begins. The unconscious starts moving toward it immediately.",
              },
              {
                title: "Setting as Emotional Primer",
                color: "#67E8F9",
                body: "Setting influences mood before plot even begins. Sensory-rich environmental description installs the emotional state you want the suggestion to land in. The setting IS the induction.

For safety: The cottage sat at the end of a lane that seemed to grow quieter as you walked it. Inside, the fire had been burning long enough that the room held its warmth the way old rooms do — evenly, without effort.

For possibility: The morning was the kind that made things feel undecided. The light hadn't committed to anything yet.

Prime the emotional state first. The suggestion lands in prepared soil.",
              },
              {
                title: "The 11-Step Application Sequence",
                color: "#FCD34D",
                body: "1. CAPTURE — Open a loop. Pose a question. Violate an expectation.
2. PRIME — Set the emotional state through environment before content begins.
3. ABSORB — Build full sensory immersion. Three descriptors. All senses. Causal flow.
4. IDENTIFY — Introduce the protagonist at their wound. Lead with the flaw.
5. SEED — Plant the possibility of transformation before the journey begins.
6. BYPASS — Show, never tell. Use themes as presuppositions.
7. SUGGEST — Embed meaning through subtext. Use ambiguity as projective space.
8. DEEPEN — Escalate pressure. Use pacing. Add subplots.
9. BREAK — Arrive at the moment of maximum receptivity. Hold it.
10. RESOLVE — Deliver catharsis. Identity-level change, not circumstance change.
11. ANCHOR — Close all loops. Return to what was seeded early. End in silence.",
              },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: "18px", paddingBottom: "18px", borderBottom: i < 8 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace", color: item.color, marginBottom: "8px" }}>{String(i+1).padStart(2,"0")} — {item.title.toUpperCase()}</div>
                <p style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.8", margin: 0, whiteSpace: "pre-line" }}>{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sections.map((sec, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ border: `1px solid ${isOpen ? sec.color + "50" : "rgba(255,255,255,0.12)"}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.3s" }}>

              {/* Header */}
              <div onClick={() => setOpen(isOpen ? null : i)} style={{ padding: "16px 20px", cursor: "pointer", background: isOpen ? `${sec.color}08` : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.3s" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", padding: "3px 7px", border: `1px solid ${sec.color}40`, borderRadius: "3px", color: sec.color }}>{sec.tag}</span>
                  <span style={{ fontSize: "18px", color: "#c8b8e0" }}>{sec.title}</span>
                </div>
                <span style={{ fontSize: "10px", color: "#7060a0" }}>{isOpen ? "▲" : "▼"}</span>
              </div>

              {/* Body */}
              {isOpen && (
                <div style={{ padding: "0 20px 22px" }}>

                  {/* What / Why / How */}
                  {[["WHAT", sec.what], ["WHY", sec.why], ["HOW", sec.how]].map(([label, text]) => (
                    <div key={label} style={{ marginBottom: "14px" }}>
                      <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: sec.color, marginBottom: "5px", opacity: 0.7 }}>{label}</div>
                      <p style={{ fontSize: "18px", color: "#9080b0", lineHeight: "1.65", margin: 0 }}>{text}</p>
                    </div>
                  ))}

                  {/* Tip */}
                  <div style={{ padding: "10px 14px", background: `${sec.color}08`, borderLeft: `2px solid ${sec.color}50`, borderRadius: "4px", marginBottom: "18px" }}>
                    <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: sec.color, marginBottom: "4px", opacity: 0.7 }}>TIP</div>
                    <div style={{ fontSize: "18px", color: "#9080b0", fontStyle: "italic", lineHeight: "1.55" }}>{sec.tip}</div>
                  </div>

                  {/* Banks */}
                  <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", marginBottom: "10px" }}>
                    {sec.title === "Drift Engine" ? "THE SIX BANKS" : sec.title === "Sensory Stacker" ? "THE FIVE SENSES" : "THE TYPES"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                    {sec.banks.map(([name, color, desc]) => (
                      <div key={name} style={{ padding: "9px 12px", border: `1px solid ${color}20`, borderRadius: "5px", background: `${color}05` }}>
                        <div style={{ fontSize: "9px", letterSpacing: "2px", fontFamily: "monospace", color: color, marginBottom: "4px" }}>{name.toUpperCase()}</div>
                        <div style={{ fontSize: "18px", color: "#8878a8", fontStyle: "italic", lineHeight: "1.5" }}>{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}


// ─────────────────────────────────────────────
// COMBINED GENERATOR DATA
// ─────────────────────────────────────────────


const SPATIAL_BANKS = {
  "Volume & Dimension": {
    color: "#67E8F9",
    short: "VOL",
    desc: "Words that force the brain to model size and three-dimensional space.",
    items: ["the vastness of","the expanse of","the hollow of","the depth of","the breadth of","the width of","the entirety of","the fullness of","the openness of","the emptiness beyond","the volume of","the immensity of","the reach of","the span of","the magnitude of"],
  },
  "Distance & Position": {
    color: "#C084FC",
    short: "DIST",
    desc: "Words that place things in spatial relation to each other and to the listener.",
    items: ["in the distance","surrounding you","somewhere behind","far beyond","just on the edge of","spreading outward from","at the periphery of","further than","closer than you expected","somewhere between here and","drifting away from","extending past","radiating outward","hovering just beyond","receding into"],
  },
  "Background & Field": {
    color: "#86EFAC",
    short: "FIELD",
    desc: "Words that shift attention from foreground to background — from focus to field.",
    items: ["in the background","beyond the foreground","at the edges of awareness","in the wider field","outside the point of focus","in the soft periphery","where attention has not yet settled","in the space between","beyond what is being looked at","where the gaze softens","in the ambient layer","past the boundary of focus","where things blur gently","in the wider surround","where near becomes far"],
  },
  "Expansion & Softening": {
    color: "#FCD34D",
    short: "EXP",
    desc: "Words that describe awareness or attention opening outward rather than narrowing.",
    items: ["expanding outward","widening gently","softening at the edges","opening in all directions","releasing its hold on any single point","allowing the field to grow","letting the edges breathe","spreading without effort","dissolving the boundary between","allowing the periphery to become vivid","relaxing the focus until","broadening without trying","growing past its usual edges","widening until near and far feel equal","softening into the whole"],
  },
  "Pronominal Shift": {
    color: "#F9A8D4",
    short: "SHIFT",
    desc: "Moving between you / one / we creates dissociation — the listener becomes an observer of a general experience rather than the target.",
    items: ["you might notice, and as one becomes aware","a person in this moment could find","we can observe how easily","one begins to realize","as you settle, one can sense","and anyone in this space might","we tend to find that","one notices, as you do now","a mind like yours — like any mind — will","you and one are the same thing here","as one drifts, you follow naturally","what you feel, one recognizes immediately","we arrive at the same place","anyone paying attention would find","one simply allows what you are already doing"],
  },
};

const SPATIAL_BANK_NAMES = Object.keys(SPATIAL_BANKS);

function dealSpatial() {
  const shuffled = [...SPATIAL_BANK_NAMES].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.4 ? 4 : 3;
  return shuffled.slice(0, count).map(name => ({
    bank: name,
    phrase: pick(SPATIAL_BANKS[name].items),
    color: SPATIAL_BANKS[name].color,
    short: SPATIAL_BANKS[name].short,
  }));
}

const COMBINED_POOLS = {
  temporal: {
    label: "Temporal Drift",
    color: "#A78BFA",
    short: "TIME",
    items: ["and I might not remember exactly when","at some point — maybe now, maybe earlier","and it could have been yesterday or a year ago","by the time I noticed","before I even realized","somewhere between then and now","as if time had folded over on itself","in that space where minutes don't quite work the same way","as though it had always been that way","I might find myself wondering when that began","in a time that felt like no particular time","somewhere before the moment I became aware of it","by the time it registered it had already been happening","not recently and not long ago — just at some point","as if the whole thing existed outside of any clock","between one breath and the next, though I couldn't say which","the timing of it was the last thing I could have described"],
  },
  qualifier: {
    label: "Soft Qualifier",
    color: "#67E8F9",
    short: "QUAL",
    items: ["it felt like","it seemed like","almost like","in a way","somehow","sort of","it was as though","there was something about it that","it had this quality of","without quite knowing why","for reasons I can't entirely explain","you could almost say","if you could imagine","it was one of those things where","not quite, but close to"],
  },
  nominal: {
    label: "Nominalization",
    color: "#86EFAC",
    short: "NOM",
    items: ["awareness","understanding","comfort","curiosity","realization","clarity","recognition","connection","transformation","relaxation","trust","openness","wisdom","presence","relief","expansion","belonging","possibility","acceptance","integration"],
  },
  verb: {
    label: "Unspecified Verb",
    color: "#FCD34D",
    short: "VERB",
    items: ["notice","sense","realize","become aware","allow","discover","settle","drift","ease","shift","wonder","perceive","absorb","move","open","let","develop","find","process","remember"],
  },
  indirect: {
    label: "Indirect Frame",
    color: "#C084FC",
    short: "INDIR",
    items: ["there was a","a kind of","something like a","I noticed what might have been a","a quiet","without deciding to, I found a","the [state] wasn't loud — just present","there was something that felt like","a [state] arrived that I hadn't expected","it was almost as if a"],
  },
  confusion: {
    label: "Confusion Fragment",
    color: "#F9A8D4",
    short: "CONF",
    items: ["the time you left behind wasn't there when you didn't see it","what didn't occur hasn't always happened before you didn't know","the part that knew before it learned is still learning what it knew","if you were to notice what you'd notice if you weren't noticing","the silence and the time it took to not say it are the same weight","the thing that keeps changing is the only thing that hasn't moved","if you stopped trying to understand this, you'd understand it","what hasn't been decided is making every decision","by the time you notice you've already arrived","the gap between thoughts is where the thinking happens"],
  },
  sensory: {
    label: "Sensory Detail",
    color: "#FB923C",
    short: "SENSE",
    items: [
      "cold smooth glass", "pale dusty window", "dark worn floorboard",
      "warm rough brick", "damp earthy smell", "faint metallic hum",
      "soft grey carpet", "bright cracked plaster", "muffled distant voices",
      "cool still air", "heavy amber afternoon light", "sharp cold door handle",
      "matte white ceiling", "grainy dark wood", "hollow echoing corridor",
      "warm dry paper smell", "shiny black wet pavement", "weathered pale stone",
    ],
  },
  witness: {
    label: "Mundane Witness",
    color: "#94A3B8",
    short: "WIT",
    items: ["the fluorescent light was humming just slightly too loud","there was a half-empty cup nobody claimed","the door didn't quite close all the way","the clock on the wall was three minutes fast","a plant in the corner that had seen better days","nobody sat in the chair closest to the door","the window was open just enough to move the papers","one of the ceiling tiles was slightly off-center","someone had written something and not erased it","his left shoe was untied the entire time"],
  },
};

const POOL_KEYS = Object.keys(COMBINED_POOLS);

const DIFFICULTY_CONFIGS = {
  standard:  { count: 3, label: "STANDARD",  desc: "3 patterns from 3 sections" },
  advanced:  { count: 5, label: "ADVANCED",  desc: "5 patterns from 5 sections" },
  fulldrift: { count: 8, label: "FULL DRIFT", desc: "one from every section" },
};

function dealCombined(difficulty) {
  if (difficulty === "fulldrift") {
    return POOL_KEYS.map(k => ({
      poolKey: k,
      phrase: pick(COMBINED_POOLS[k].items),
      color: COMBINED_POOLS[k].color,
      short: COMBINED_POOLS[k].short,
      label: COMBINED_POOLS[k].label,
    }));
  }
  const count = DIFFICULTY_CONFIGS[difficulty].count;
  const shuffled = [...POOL_KEYS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(k => ({
    poolKey: k,
    phrase: pick(COMBINED_POOLS[k].items),
    color: COMBINED_POOLS[k].color,
    short: COMBINED_POOLS[k].short,
    label: COMBINED_POOLS[k].label,
  }));
}

// ─────────────────────────────────────────────
// COMBINED GENERATOR COMPONENT
// ─────────────────────────────────────────────

function CombinedGenerator() {
  const [difficulty, setDifficulty] = useState("standard");
  const [cards, setCards] = useState(() => dealCombined("standard"));
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState(Array(8).fill(false));
  const [showDetection, setShowDetection] = useState(true);

  const updatedCards = cards.map(card => ({
    ...card,
    used: showDetection && sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 18)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    setVisible(Array(8).fill(false));
    cards.forEach((_, i) => {
      setTimeout(() => setVisible(v => { const n = [...v]; n[i] = true; return n; }), i * 100);
    });
  }, [cards]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount, difficulty }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible(Array(8).fill(false));
    setTimeout(() => { setCards(dealCombined(difficulty)); setSentence(""); }, 150);
  }, [sentence, cards, usedCount, difficulty]);

  const handleDifficulty = (d) => {
    setDifficulty(d);
    setCards(dealCombined(d));
    setSentence("");
    setSubmitted(false);
    setVisible(Array(8).fill(false));
  };

  return (
    <>
      {/* Difficulty selector */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "12px" }}>
          DIFFICULTY
        </div>
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          {Object.entries(DIFFICULTY_CONFIGS).map(([key, cfg]) => (
            <button key={key} onClick={() => handleDifficulty(key)} style={{
              padding: "8px 14px",
              background: difficulty === key ? "rgba(124,58,237,0.3)" : "transparent",
              border: `1px solid ${difficulty === key ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "6px",
              color: difficulty === key ? "#c4a8f0" : "#4a4060",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace" }}>{cfg.label}</div>
              <div style={{ fontSize: "9px", color: difficulty === key ? "#8060b0" : "#2a2535", marginTop: "2px" }}>{cfg.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detection toggle */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setShowDetection(d => !d)} style={{
          fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace",
          color: showDetection ? "#6b5ea8" : "#2a2535",
          background: "transparent", border: "none", cursor: "pointer",
        }}>
          {showDetection ? "● DETECTION ON" : "○ DETECTION OFF"}
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {cards.map((card, i) => {
          const isUsed = updatedCards[i]?.used;
          return (
            <div key={`${card.phrase}-${i}`} style={{
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
            }}>
              <div style={{
                border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px", padding: "10px 16px",
                background: isUsed ? `linear-gradient(135deg, ${card.color}15, ${card.color}05)` : "rgba(255,255,255,0.01)",
                display: "flex", gap: "12px", alignItems: "flex-start",
                transition: "all 0.3s",
              }}>
                <div style={{ minWidth: "48px" }}>
                  <div style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: card.color, marginBottom: "2px" }}>
                    {card.short} {isUsed ? "✓" : ""}
                  </div>
                </div>
                <div style={{ fontSize: "17px", fontStyle: "italic", color: isUsed ? "#e8e0d0" : "#6a6078", lineHeight: "1.45", flex: 1 }}>
                  "{card.phrase}"
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
          {cards.map((_, i) => (
            <div key={i} style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.18)",
              transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)",
            }} />
          ))}
          <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>
            {usedCount}/{cards.length}
          </span>
        </div>
      </div>

      {/* Input */}
      {submitted ? (
        <div style={{
          padding: "18px 20px",
          border: "1px solid rgba(134,239,172,0.2)",
          borderRadius: "10px",
          background: "rgba(134,239,172,0.02)",
          fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8c0b0",
          marginBottom: "14px",
        }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>
            COMMITTED — {usedCount}/{cards.length} WOVEN
          </div>
          {sentence}
        </div>
      ) : (
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)}
          placeholder="Weave all the patterns into one sentence..."
          rows={difficulty === "fulldrift" ? 5 : 4}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", color: "#f0ecff",
            fontSize: "17px", lineHeight: "1.75",
            fontFamily: "'Georgia', serif", fontStyle: sentence ? "italic" : "normal",
            padding: "16px 18px", resize: "vertical", outline: "none",
            transition: "border-color 0.2s", marginBottom: "12px",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
          autoFocus
        />
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
        {!submitted && (
          <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{
            ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3,
          }}>COMMIT ⌘↵</button>
        )}
        <button onClick={handleDeal} style={S.btnGhost}
          onMouseEnter={e => { e.target.style.color = "#a090c0"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={e => { e.target.style.color = "#5a5070"; e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
        >NEW DEAL ↺</button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{
              padding: "12px 14px", marginBottom: "8px",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "7px", opacity: 1 - i * 0.12,
            }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#8878c0", padding: "2px 5px", border: "1px solid rgba(74,63,107,0.3)", borderRadius: "3px" }}>
                  {DIFFICULTY_CONFIGS[h.difficulty]?.label}
                </span>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#7060a0" }}>
                  {h.usedCount}/{h.cards.length}
                </span>
              </div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.65" }}>
                {h.sentence}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


function CombinedGenerator() {
  const [difficulty, setDifficulty] = useState("standard");
  const [cards, setCards] = useState(() => dealCombined("standard"));
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState(Array(8).fill(false));
  const [showDetection, setShowDetection] = useState(true);

  const updatedCards = cards.map(card => ({
    ...card,
    used: showDetection && sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 18)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    setVisible(Array(8).fill(false));
    cards.forEach((_, i) => {
      setTimeout(() => setVisible(v => { const n = [...v]; n[i] = true; return n; }), i * 100);
    });
  }, [cards]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount, difficulty }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible(Array(8).fill(false));
    setTimeout(() => { setCards(dealCombined(difficulty)); setSentence(""); }, 150);
  }, [sentence, cards, usedCount, difficulty]);

  const handleDifficulty = (d) => {
    setDifficulty(d);
    setCards(dealCombined(d));
    setSentence("");
    setSubmitted(false);
    setVisible(Array(8).fill(false));
  };

  return (
    <>
      {/* Difficulty selector */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "12px" }}>
          DIFFICULTY
        </div>
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          {Object.entries(DIFFICULTY_CONFIGS).map(([key, cfg]) => (
            <button key={key} onClick={() => handleDifficulty(key)} style={{
              padding: "8px 14px",
              background: difficulty === key ? "rgba(124,58,237,0.3)" : "transparent",
              border: `1px solid ${difficulty === key ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "6px",
              color: difficulty === key ? "#c4a8f0" : "#4a4060",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace" }}>{cfg.label}</div>
              <div style={{ fontSize: "9px", color: difficulty === key ? "#8060b0" : "#2a2535", marginTop: "2px" }}>{cfg.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detection toggle */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setShowDetection(d => !d)} style={{
          fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace",
          color: showDetection ? "#6b5ea8" : "#2a2535",
          background: "transparent", border: "none", cursor: "pointer",
        }}>
          {showDetection ? "● DETECTION ON" : "○ DETECTION OFF"}
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {cards.map((card, i) => {
          const isUsed = updatedCards[i]?.used;
          return (
            <div key={`${card.phrase}-${i}`} style={{
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
            }}>
              <div style={{
                border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px", padding: "10px 16px",
                background: isUsed ? `linear-gradient(135deg, ${card.color}15, ${card.color}05)` : "rgba(255,255,255,0.01)",
                display: "flex", gap: "12px", alignItems: "flex-start",
                transition: "all 0.3s",
              }}>
                <div style={{ minWidth: "48px" }}>
                  <div style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: card.color, marginBottom: "2px" }}>
                    {card.short} {isUsed ? "✓" : ""}
                  </div>
                </div>
                <div style={{ fontSize: "17px", fontStyle: "italic", color: isUsed ? "#e8e0d0" : "#6a6078", lineHeight: "1.45", flex: 1 }}>
                  "{card.phrase}"
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
          {cards.map((_, i) => (
            <div key={i} style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.18)",
              transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)",
            }} />
          ))}
          <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>
            {usedCount}/{cards.length}
          </span>
        </div>
      </div>

      {/* Input */}
      {submitted ? (
        <div style={{
          padding: "18px 20px",
          border: "1px solid rgba(134,239,172,0.2)",
          borderRadius: "10px",
          background: "rgba(134,239,172,0.02)",
          fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8c0b0",
          marginBottom: "14px",
        }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>
            COMMITTED — {usedCount}/{cards.length} WOVEN
          </div>
          {sentence}
        </div>
      ) : (
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)}
          placeholder="Weave all the patterns into one sentence..."
          rows={difficulty === "fulldrift" ? 5 : 4}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", color: "#f0ecff",
            fontSize: "17px", lineHeight: "1.75",
            fontFamily: "'Georgia', serif", fontStyle: sentence ? "italic" : "normal",
            padding: "16px 18px", resize: "vertical", outline: "none",
            transition: "border-color 0.2s", marginBottom: "12px",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
          autoFocus
        />
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
        {!submitted && (
          <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{
            ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3,
          }}>COMMIT ⌘↵</button>
        )}
        <button onClick={handleDeal} style={S.btnGhost}
          onMouseEnter={e => { e.target.style.color = "#a090c0"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={e => { e.target.style.color = "#5a5070"; e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
        >NEW DEAL ↺</button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{
              padding: "12px 14px", marginBottom: "8px",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "7px", opacity: 1 - i * 0.12,
            }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#8878c0", padding: "2px 5px", border: "1px solid rgba(74,63,107,0.3)", borderRadius: "3px" }}>
                  {DIFFICULTY_CONFIGS[h.difficulty]?.label}
                </span>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#7060a0" }}>
                  {h.usedCount}/{h.cards.length}
                </span>
              </div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.65" }}>
                {h.sentence}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


function SpatialForge() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealSpatial());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 16)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealSpatial()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial words force the brain to render three-dimensional space. When the brain is modeling geometry instead of logic, awareness naturally widens.
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave the spatial phrases into one sentence..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SPATIAL_BANK_NAMES.map(name => {
            const bank = SPATIAL_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}



const COMBINED_POOLS = {
  temporal: {
    label: "Temporal Drift",
    color: "#A78BFA",
    short: "TIME",
    items: ["and I might not remember exactly when","at some point — maybe now, maybe earlier","and it could have been yesterday or a year ago","by the time I noticed","before I even realized","somewhere between then and now","as if time had folded over on itself","in that space where minutes don't quite work the same way","as though it had always been that way","I might find myself wondering when that began","in a time that felt like no particular time","somewhere before the moment I became aware of it","by the time it registered it had already been happening","not recently and not long ago — just at some point","as if the whole thing existed outside of any clock","between one breath and the next, though I couldn't say which","the timing of it was the last thing I could have described"],
  },
  qualifier: {
    label: "Soft Qualifier",
    color: "#67E8F9",
    short: "QUAL",
    items: ["it felt like","it seemed like","almost like","in a way","somehow","sort of","it was as though","there was something about it that","it had this quality of","without quite knowing why","for reasons I can't entirely explain","you could almost say","if you could imagine","it was one of those things where","not quite, but close to"],
  },
  nominal: {
    label: "Nominalization",
    color: "#86EFAC",
    short: "NOM",
    items: ["awareness","understanding","comfort","curiosity","realization","clarity","recognition","connection","transformation","relaxation","trust","openness","wisdom","presence","relief","expansion","belonging","possibility","acceptance","integration"],
  },
  verb: {
    label: "Unspecified Verb",
    color: "#FCD34D",
    short: "VERB",
    items: ["notice","sense","realize","become aware","allow","discover","settle","drift","ease","shift","wonder","perceive","absorb","move","open","let","develop","find","process","remember"],
  },
  indirect: {
    label: "Indirect Frame",
    color: "#C084FC",
    short: "INDIR",
    items: ["there was a","a kind of","something like a","I noticed what might have been a","a quiet","without deciding to, I found a","the [state] wasn't loud — just present","there was something that felt like","a [state] arrived that I hadn't expected","it was almost as if a"],
  },
  confusion: {
    label: "Confusion Fragment",
    color: "#F9A8D4",
    short: "CONF",
    items: ["the time you left behind wasn't there when you didn't see it","what didn't occur hasn't always happened before you didn't know","the part that knew before it learned is still learning what it knew","if you were to notice what you'd notice if you weren't noticing","the silence and the time it took to not say it are the same weight","the thing that keeps changing is the only thing that hasn't moved","if you stopped trying to understand this, you'd understand it","what hasn't been decided is making every decision","by the time you notice you've already arrived","the gap between thoughts is where the thinking happens"],
  },
  sensory: {
    label: "Sensory Detail",
    color: "#FB923C",
    short: "SENSE",
    items: [
      "cold smooth glass", "pale dusty window", "dark worn floorboard",
      "warm rough brick", "damp earthy smell", "faint metallic hum",
      "soft grey carpet", "bright cracked plaster", "muffled distant voices",
      "cool still air", "heavy amber afternoon light", "sharp cold door handle",
      "matte white ceiling", "grainy dark wood", "hollow echoing corridor",
      "warm dry paper smell", "shiny black wet pavement", "weathered pale stone",
    ],
  },
  witness: {
    label: "Mundane Witness",
    color: "#94A3B8",
    short: "WIT",
    items: ["the fluorescent light was humming just slightly too loud","there was a half-empty cup nobody claimed","the door didn't quite close all the way","the clock on the wall was three minutes fast","a plant in the corner that had seen better days","nobody sat in the chair closest to the door","the window was open just enough to move the papers","one of the ceiling tiles was slightly off-center","someone had written something and not erased it","his left shoe was untied the entire time"],
  },
};

const POOL_KEYS = Object.keys(COMBINED_POOLS);

const DIFFICULTY_CONFIGS = {
  standard:  { count: 3, label: "STANDARD",  desc: "3 patterns from 3 sections" },
  advanced:  { count: 5, label: "ADVANCED",  desc: "5 patterns from 5 sections" },
  fulldrift: { count: 8, label: "FULL DRIFT", desc: "one from every section" },
};

function dealCombined(difficulty) {
  if (difficulty === "fulldrift") {
    return POOL_KEYS.map(k => ({
      poolKey: k,
      phrase: pick(COMBINED_POOLS[k].items),
      color: COMBINED_POOLS[k].color,
      short: COMBINED_POOLS[k].short,
      label: COMBINED_POOLS[k].label,
    }));
  }
  const count = DIFFICULTY_CONFIGS[difficulty].count;
  const shuffled = [...POOL_KEYS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(k => ({
    poolKey: k,
    phrase: pick(COMBINED_POOLS[k].items),
    color: COMBINED_POOLS[k].color,
    short: COMBINED_POOLS[k].short,
    label: COMBINED_POOLS[k].label,
  }));
}

// ─────────────────────────────────────────────
// COMBINED GENERATOR COMPONENT
// ─────────────────────────────────────────────

function CombinedGenerator() {
  const [difficulty, setDifficulty] = useState("standard");
  const [cards, setCards] = useState(() => dealCombined("standard"));
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState(Array(8).fill(false));
  const [showDetection, setShowDetection] = useState(true);

  const updatedCards = cards.map(card => ({
    ...card,
    used: showDetection && sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 18)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    setVisible(Array(8).fill(false));
    cards.forEach((_, i) => {
      setTimeout(() => setVisible(v => { const n = [...v]; n[i] = true; return n; }), i * 100);
    });
  }, [cards]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount, difficulty }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible(Array(8).fill(false));
    setTimeout(() => { setCards(dealCombined(difficulty)); setSentence(""); }, 150);
  }, [sentence, cards, usedCount, difficulty]);

  const handleDifficulty = (d) => {
    setDifficulty(d);
    setCards(dealCombined(d));
    setSentence("");
    setSubmitted(false);
    setVisible(Array(8).fill(false));
  };

  return (
    <>
      {/* Difficulty selector */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "12px" }}>
          DIFFICULTY
        </div>
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          {Object.entries(DIFFICULTY_CONFIGS).map(([key, cfg]) => (
            <button key={key} onClick={() => handleDifficulty(key)} style={{
              padding: "8px 14px",
              background: difficulty === key ? "rgba(124,58,237,0.3)" : "transparent",
              border: `1px solid ${difficulty === key ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "6px",
              color: difficulty === key ? "#c4a8f0" : "#4a4060",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace" }}>{cfg.label}</div>
              <div style={{ fontSize: "9px", color: difficulty === key ? "#8060b0" : "#2a2535", marginTop: "2px" }}>{cfg.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detection toggle */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setShowDetection(d => !d)} style={{
          fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace",
          color: showDetection ? "#6b5ea8" : "#2a2535",
          background: "transparent", border: "none", cursor: "pointer",
        }}>
          {showDetection ? "● DETECTION ON" : "○ DETECTION OFF"}
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {cards.map((card, i) => {
          const isUsed = updatedCards[i]?.used;
          return (
            <div key={`${card.phrase}-${i}`} style={{
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
            }}>
              <div style={{
                border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px", padding: "10px 16px",
                background: isUsed ? `linear-gradient(135deg, ${card.color}15, ${card.color}05)` : "rgba(255,255,255,0.01)",
                display: "flex", gap: "12px", alignItems: "flex-start",
                transition: "all 0.3s",
              }}>
                <div style={{ minWidth: "48px" }}>
                  <div style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: card.color, marginBottom: "2px" }}>
                    {card.short} {isUsed ? "✓" : ""}
                  </div>
                </div>
                <div style={{ fontSize: "17px", fontStyle: "italic", color: isUsed ? "#e8e0d0" : "#6a6078", lineHeight: "1.45", flex: 1 }}>
                  "{card.phrase}"
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
          {cards.map((_, i) => (
            <div key={i} style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.18)",
              transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)",
            }} />
          ))}
          <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>
            {usedCount}/{cards.length}
          </span>
        </div>
      </div>

      {/* Input */}
      {submitted ? (
        <div style={{
          padding: "18px 20px",
          border: "1px solid rgba(134,239,172,0.2)",
          borderRadius: "10px",
          background: "rgba(134,239,172,0.02)",
          fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8c0b0",
          marginBottom: "14px",
        }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>
            COMMITTED — {usedCount}/{cards.length} WOVEN
          </div>
          {sentence}
        </div>
      ) : (
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)}
          placeholder="Weave all the patterns into one sentence..."
          rows={difficulty === "fulldrift" ? 5 : 4}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", color: "#f0ecff",
            fontSize: "17px", lineHeight: "1.75",
            fontFamily: "'Georgia', serif", fontStyle: sentence ? "italic" : "normal",
            padding: "16px 18px", resize: "vertical", outline: "none",
            transition: "border-color 0.2s", marginBottom: "12px",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
          autoFocus
        />
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
        {!submitted && (
          <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{
            ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3,
          }}>COMMIT ⌘↵</button>
        )}
        <button onClick={handleDeal} style={S.btnGhost}
          onMouseEnter={e => { e.target.style.color = "#a090c0"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={e => { e.target.style.color = "#5a5070"; e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
        >NEW DEAL ↺</button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{
              padding: "12px 14px", marginBottom: "8px",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "7px", opacity: 1 - i * 0.12,
            }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#8878c0", padding: "2px 5px", border: "1px solid rgba(74,63,107,0.3)", borderRadius: "3px" }}>
                  {DIFFICULTY_CONFIGS[h.difficulty]?.label}
                </span>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#7060a0" }}>
                  {h.usedCount}/{h.cards.length}
                </span>
              </div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.65" }}>
                {h.sentence}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


function SpatialForge() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealSpatial());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 16)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealSpatial()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial words force the brain to render three-dimensional space. When the brain is modeling geometry instead of logic, awareness naturally widens.
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave the spatial phrases into one sentence..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SPATIAL_BANK_NAMES.map(name => {
            const bank = SPATIAL_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}



const HAKALAU_BANKS = {
  "Spatial": {
    color: "#67E8F9",
    short: "SPACE",
    desc: "Natural phrases that carry spatial geometry — the brain renders the space and the field widens without being asked to.",
    items: [
      "there's something about the size of this room",
      "the whole place seems to open up when you",
      "I remember the space between us just kind of",
      "you could feel how far back the room went",
      "the distance between here and the window",
      "something about the way the space sits around you",
      "the whole background of the place just kind of settles",
      "there was this depth to it, like the room went further than it should",
      "the air between things had its own weight somehow",
      "it opened up in all directions without making a big deal of it",
      "the edges of the place just kind of dissolved",
      "there was a lot of room around the actual words",
    ],
  },
  "Conjunctions": {
    color: "#C084FC",
    short: "CONJ",
    desc: "Natural connective phrases that carry multiple fields of attention at once — narrow focus can't hold them all.",
    items: [
      "and while that's going on you also kind of notice",
      "at the same time there's this other thing where",
      "even while you're thinking about that there's still",
      "and without really meaning to you also start to",
      "the whole time that was happening there was also",
      "and while part of you is following the words",
      "even as that's settling in, the whole room is",
      "and somewhere in the background of all that",
      "while the conversation kept going there was also this",
      "and at the same time the whole thing just kind of",
      "even while the foreground stays, the rest of it",
      "and you're tracking that while also noticing",
    ],
  },
  "Temporal": {
    color: "#A78BFA",
    short: "TIME",
    desc: "Casual time phrases that dissolve the timestamp — a mind without a sense of when naturally widens spatially.",
    items: [
      "and I couldn't tell you when exactly that shifted",
      "at some point in there — I'm not sure when",
      "it could've been five minutes, could've been twenty",
      "somewhere in the middle of all that",
      "before I even really noticed it had changed",
      "and by the time I thought to check the time",
      "at some point it just stopped feeling like waiting",
      "I genuinely couldn't tell you how long that was",
      "somewhere between sitting down and looking up again",
      "it's one of those things where the time just kind of goes",
      "and the when of it was the last thing I could've told you",
      "at some point that wasn't recent and wasn't long ago",
    ],
  },
  "Observer Shift": {
    color: "#86EFAC",
    short: "OBS",
    desc: "Casual moves from first to third person — the listener becomes an observer of experience rather than the subject of it.",
    items: [
      "and you know how it is when someone just kind of",
      "most people in that situation would find themselves",
      "it's one of those things where a person just",
      "anyone who's been there knows that feeling where",
      "and you get to a point where the whole thing just",
      "people tend to find, without trying to, that",
      "it's the kind of thing where you don't decide it happens",
      "most people don't notice when it shifts — it just does",
      "and a person gets to that place where the thinking quiets",
      "you know that feeling where you stop being in your head",
      "it's just what happens when the room gets that kind of quiet",
      "and anyone sitting there long enough would find",
    ],
  },
};

const HAKALAU_BANK_NAMES = Object.keys(HAKALAU_BANKS);

function dealHakalau() {
  const shuffled = [...HAKALAU_BANK_NAMES].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.4 ? 4 : 3;
  return shuffled.slice(0, count).map(name => ({
    bank: name,
    phrase: pick(HAKALAU_BANKS[name].items),
    color: HAKALAU_BANKS[name].color,
    short: HAKALAU_BANKS[name].short,
  }));
}


function SpatialForge() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealSpatial());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 16)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealSpatial()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial words force the brain to render three-dimensional space. When the brain is modeling geometry instead of logic, awareness naturally widens.
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave the spatial phrases into one sentence..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SPATIAL_BANK_NAMES.map(name => {
            const bank = SPATIAL_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}



const HAKALAU_BANKS = {
  "Spatial": {
    color: "#67E8F9",
    short: "SPACE",
    desc: "Natural phrases that carry spatial geometry — the brain renders the space and the field widens without being asked to.",
    items: [
      "there's something about the size of this room",
      "the whole place seems to open up when you",
      "I remember the space between us just kind of",
      "you could feel how far back the room went",
      "the distance between here and the window",
      "something about the way the space sits around you",
      "the whole background of the place just kind of settles",
      "there was this depth to it, like the room went further than it should",
      "the air between things had its own weight somehow",
      "it opened up in all directions without making a big deal of it",
      "the edges of the place just kind of dissolved",
      "there was a lot of room around the actual words",
    ],
  },
  "Conjunctions": {
    color: "#C084FC",
    short: "CONJ",
    desc: "Natural connective phrases that carry multiple fields of attention at once — narrow focus can't hold them all.",
    items: [
      "and while that's going on you also kind of notice",
      "at the same time there's this other thing where",
      "even while you're thinking about that there's still",
      "and without really meaning to you also start to",
      "the whole time that was happening there was also",
      "and while part of you is following the words",
      "even as that's settling in, the whole room is",
      "and somewhere in the background of all that",
      "while the conversation kept going there was also this",
      "and at the same time the whole thing just kind of",
      "even while the foreground stays, the rest of it",
      "and you're tracking that while also noticing",
    ],
  },
  "Temporal": {
    color: "#A78BFA",
    short: "TIME",
    desc: "Casual time phrases that dissolve the timestamp — a mind without a sense of when naturally widens spatially.",
    items: [
      "and I couldn't tell you when exactly that shifted",
      "at some point in there — I'm not sure when",
      "it could've been five minutes, could've been twenty",
      "somewhere in the middle of all that",
      "before I even really noticed it had changed",
      "and by the time I thought to check the time",
      "at some point it just stopped feeling like waiting",
      "I genuinely couldn't tell you how long that was",
      "somewhere between sitting down and looking up again",
      "it's one of those things where the time just kind of goes",
      "and the when of it was the last thing I could've told you",
      "at some point that wasn't recent and wasn't long ago",
    ],
  },
  "Observer Shift": {
    color: "#86EFAC",
    short: "OBS",
    desc: "Casual moves from first to third person — the listener becomes an observer of experience rather than the subject of it.",
    items: [
      "and you know how it is when someone just kind of",
      "most people in that situation would find themselves",
      "it's one of those things where a person just",
      "anyone who's been there knows that feeling where",
      "and you get to a point where the whole thing just",
      "people tend to find, without trying to, that",
      "it's the kind of thing where you don't decide it happens",
      "most people don't notice when it shifts — it just does",
      "and a person gets to that place where the thinking quiets",
      "you know that feeling where you stop being in your head",
      "it's just what happens when the room gets that kind of quiet",
      "and anyone sitting there long enough would find",
    ],
  },
};

const HAKALAU_BANK_NAMES = Object.keys(HAKALAU_BANKS);

function dealHakalau() {
  const shuffled = [...HAKALAU_BANK_NAMES].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.4 ? 4 : 3;
  return shuffled.slice(0, count).map(name => ({
    bank: name,
    phrase: pick(HAKALAU_BANKS[name].items),
    color: HAKALAU_BANKS[name].color,
    short: HAKALAU_BANKS[name].short,
  }));
}

// ─────────────────────────────────────────────
// HAKALAU ENGINE
// ─────────────────────────────────────────────

function HakalauEngine() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealHakalau());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 18)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealHakalau()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial, conjunctive, and temporal language that induces wide peripheral awareness through the act of processing it.
      </p>
      <p style={{ fontSize: "12px", color: "#7060a0", fontFamily: "monospace", letterSpacing: "1px", textAlign: "center", marginBottom: "20px" }}>
        ALPHA STATE — outward, wide, peripheral
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave these into something a real person would actually say..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}
              onMouseEnter={e => { e.target.style.color = "#a090c0"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.target.style.color = "#c0b0e0"; e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
            >NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {[

            ["Alpha vs Theta", "Hakalau is alpha: outward, wide, eyes open, still in the room. Theta is the deeper trance state — inward, imagery-dominant, boundary between self and environment dissolves. The rest of this app trains theta induction. Hakalau trains the alpha state — useful for salespeople, coaches, anyone who needs to stay calibrated in a live conversation."],
            ["Why the phrases work", "The phrases sound conversational but carry geometry, multiplicity, and temporal looseness simultaneously. The brain widens its attentional field to process them — not because it was told to, but because that's what the processing requires. The listener never knows a technique was used."],
          ].map(([title, desc]) => (
            <div key={title} style={{ padding: "14px 16px", border: "1px solid rgba(103,232,249,0.15)", borderRadius: "8px", background: "rgba(103,232,249,0.03)" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px" }}>{title.toUpperCase()}</div>
              <p style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.75", margin: 0 }}>{desc}</p>
            </div>
          ))}
          {HAKALAU_BANK_NAMES.map(name => {
            const bank = HAKALAU_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}


function SpatialForge() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealSpatial());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 16)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealSpatial()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial words force the brain to render three-dimensional space. When the brain is modeling geometry instead of logic, awareness naturally widens.
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave the spatial phrases into one sentence..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SPATIAL_BANK_NAMES.map(name => {
            const bank = SPATIAL_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}





// ─────────────────────────────────────────────
// COMBINED GENERATOR DATA
// ─────────────────────────────────────────────


const SPATIAL_BANKS = {
  "Volume & Dimension": {
    color: "#67E8F9",
    short: "VOL",
    desc: "Words that force the brain to model size and three-dimensional space.",
    items: ["the vastness of","the expanse of","the hollow of","the depth of","the breadth of","the width of","the entirety of","the fullness of","the openness of","the emptiness beyond","the volume of","the immensity of","the reach of","the span of","the magnitude of"],
  },
  "Distance & Position": {
    color: "#C084FC",
    short: "DIST",
    desc: "Words that place things in spatial relation to each other and to the listener.",
    items: ["in the distance","surrounding you","somewhere behind","far beyond","just on the edge of","spreading outward from","at the periphery of","further than","closer than you expected","somewhere between here and","drifting away from","extending past","radiating outward","hovering just beyond","receding into"],
  },
  "Background & Field": {
    color: "#86EFAC",
    short: "FIELD",
    desc: "Words that shift attention from foreground to background — from focus to field.",
    items: ["in the background","beyond the foreground","at the edges of awareness","in the wider field","outside the point of focus","in the soft periphery","where attention has not yet settled","in the space between","beyond what is being looked at","where the gaze softens","in the ambient layer","past the boundary of focus","where things blur gently","in the wider surround","where near becomes far"],
  },
  "Expansion & Softening": {
    color: "#FCD34D",
    short: "EXP",
    desc: "Words that describe awareness or attention opening outward rather than narrowing.",
    items: ["expanding outward","widening gently","softening at the edges","opening in all directions","releasing its hold on any single point","allowing the field to grow","letting the edges breathe","spreading without effort","dissolving the boundary between","allowing the periphery to become vivid","relaxing the focus until","broadening without trying","growing past its usual edges","widening until near and far feel equal","softening into the whole"],
  },
  "Pronominal Shift": {
    color: "#F9A8D4",
    short: "SHIFT",
    desc: "Moving between you / one / we creates dissociation — the listener becomes an observer of a general experience rather than the target.",
    items: ["you might notice, and as one becomes aware","a person in this moment could find","we can observe how easily","one begins to realize","as you settle, one can sense","and anyone in this space might","we tend to find that","one notices, as you do now","a mind like yours — like any mind — will","you and one are the same thing here","as one drifts, you follow naturally","what you feel, one recognizes immediately","we arrive at the same place","anyone paying attention would find","one simply allows what you are already doing"],
  },
};

const SPATIAL_BANK_NAMES = Object.keys(SPATIAL_BANKS);

function dealSpatial() {
  const shuffled = [...SPATIAL_BANK_NAMES].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.4 ? 4 : 3;
  return shuffled.slice(0, count).map(name => ({
    bank: name,
    phrase: pick(SPATIAL_BANKS[name].items),
    color: SPATIAL_BANKS[name].color,
    short: SPATIAL_BANKS[name].short,
  }));
}

const COMBINED_POOLS = {
  temporal: {
    label: "Temporal Drift",
    color: "#A78BFA",
    short: "TIME",
    items: ["and I might not remember exactly when","at some point — maybe now, maybe earlier","and it could have been yesterday or a year ago","by the time I noticed","before I even realized","somewhere between then and now","as if time had folded over on itself","in that space where minutes don't quite work the same way","as though it had always been that way","I might find myself wondering when that began","in a time that felt like no particular time","somewhere before the moment I became aware of it","by the time it registered it had already been happening","not recently and not long ago — just at some point","as if the whole thing existed outside of any clock","between one breath and the next, though I couldn't say which","the timing of it was the last thing I could have described"],
  },
  qualifier: {
    label: "Soft Qualifier",
    color: "#67E8F9",
    short: "QUAL",
    items: ["it felt like","it seemed like","almost like","in a way","somehow","sort of","it was as though","there was something about it that","it had this quality of","without quite knowing why","for reasons I can't entirely explain","you could almost say","if you could imagine","it was one of those things where","not quite, but close to"],
  },
  nominal: {
    label: "Nominalization",
    color: "#86EFAC",
    short: "NOM",
    items: ["awareness","understanding","comfort","curiosity","realization","clarity","recognition","connection","transformation","relaxation","trust","openness","wisdom","presence","relief","expansion","belonging","possibility","acceptance","integration"],
  },
  verb: {
    label: "Unspecified Verb",
    color: "#FCD34D",
    short: "VERB",
    items: ["notice","sense","realize","become aware","allow","discover","settle","drift","ease","shift","wonder","perceive","absorb","move","open","let","develop","find","process","remember"],
  },
  indirect: {
    label: "Indirect Frame",
    color: "#C084FC",
    short: "INDIR",
    items: ["there was a","a kind of","something like a","I noticed what might have been a","a quiet","without deciding to, I found a","the [state] wasn't loud — just present","there was something that felt like","a [state] arrived that I hadn't expected","it was almost as if a"],
  },
  confusion: {
    label: "Confusion Fragment",
    color: "#F9A8D4",
    short: "CONF",
    items: ["the time you left behind wasn't there when you didn't see it","what didn't occur hasn't always happened before you didn't know","the part that knew before it learned is still learning what it knew","if you were to notice what you'd notice if you weren't noticing","the silence and the time it took to not say it are the same weight","the thing that keeps changing is the only thing that hasn't moved","if you stopped trying to understand this, you'd understand it","what hasn't been decided is making every decision","by the time you notice you've already arrived","the gap between thoughts is where the thinking happens"],
  },
  sensory: {
    label: "Sensory Detail",
    color: "#FB923C",
    short: "SENSE",
    items: [
      "cold smooth glass", "pale dusty window", "dark worn floorboard",
      "warm rough brick", "damp earthy smell", "faint metallic hum",
      "soft grey carpet", "bright cracked plaster", "muffled distant voices",
      "cool still air", "heavy amber afternoon light", "sharp cold door handle",
      "matte white ceiling", "grainy dark wood", "hollow echoing corridor",
      "warm dry paper smell", "shiny black wet pavement", "weathered pale stone",
    ],
  },
  witness: {
    label: "Mundane Witness",
    color: "#94A3B8",
    short: "WIT",
    items: ["the fluorescent light was humming just slightly too loud","there was a half-empty cup nobody claimed","the door didn't quite close all the way","the clock on the wall was three minutes fast","a plant in the corner that had seen better days","nobody sat in the chair closest to the door","the window was open just enough to move the papers","one of the ceiling tiles was slightly off-center","someone had written something and not erased it","his left shoe was untied the entire time"],
  },
};

const POOL_KEYS = Object.keys(COMBINED_POOLS);

const DIFFICULTY_CONFIGS = {
  standard:  { count: 3, label: "STANDARD",  desc: "3 patterns from 3 sections" },
  advanced:  { count: 5, label: "ADVANCED",  desc: "5 patterns from 5 sections" },
  fulldrift: { count: 8, label: "FULL DRIFT", desc: "one from every section" },
};

function dealCombined(difficulty) {
  if (difficulty === "fulldrift") {
    return POOL_KEYS.map(k => ({
      poolKey: k,
      phrase: pick(COMBINED_POOLS[k].items),
      color: COMBINED_POOLS[k].color,
      short: COMBINED_POOLS[k].short,
      label: COMBINED_POOLS[k].label,
    }));
  }
  const count = DIFFICULTY_CONFIGS[difficulty].count;
  const shuffled = [...POOL_KEYS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(k => ({
    poolKey: k,
    phrase: pick(COMBINED_POOLS[k].items),
    color: COMBINED_POOLS[k].color,
    short: COMBINED_POOLS[k].short,
    label: COMBINED_POOLS[k].label,
  }));
}

// ─────────────────────────────────────────────
// COMBINED GENERATOR COMPONENT
// ─────────────────────────────────────────────

function CombinedGenerator() {
  const [difficulty, setDifficulty] = useState("standard");
  const [cards, setCards] = useState(() => dealCombined("standard"));
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState(Array(8).fill(false));
  const [showDetection, setShowDetection] = useState(true);

  const updatedCards = cards.map(card => ({
    ...card,
    used: showDetection && sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 18)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    setVisible(Array(8).fill(false));
    cards.forEach((_, i) => {
      setTimeout(() => setVisible(v => { const n = [...v]; n[i] = true; return n; }), i * 100);
    });
  }, [cards]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount, difficulty }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible(Array(8).fill(false));
    setTimeout(() => { setCards(dealCombined(difficulty)); setSentence(""); }, 150);
  }, [sentence, cards, usedCount, difficulty]);

  const handleDifficulty = (d) => {
    setDifficulty(d);
    setCards(dealCombined(d));
    setSentence("");
    setSubmitted(false);
    setVisible(Array(8).fill(false));
  };

  return (
    <>
      {/* Difficulty selector */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", marginBottom: "12px" }}>
          DIFFICULTY
        </div>
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          {Object.entries(DIFFICULTY_CONFIGS).map(([key, cfg]) => (
            <button key={key} onClick={() => handleDifficulty(key)} style={{
              padding: "8px 14px",
              background: difficulty === key ? "rgba(124,58,237,0.3)" : "transparent",
              border: `1px solid ${difficulty === key ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "6px",
              color: difficulty === key ? "#c4a8f0" : "#4a4060",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", fontFamily: "monospace" }}>{cfg.label}</div>
              <div style={{ fontSize: "9px", color: difficulty === key ? "#8060b0" : "#2a2535", marginTop: "2px" }}>{cfg.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detection toggle */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setShowDetection(d => !d)} style={{
          fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace",
          color: showDetection ? "#6b5ea8" : "#2a2535",
          background: "transparent", border: "none", cursor: "pointer",
        }}>
          {showDetection ? "● DETECTION ON" : "○ DETECTION OFF"}
        </button>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        {cards.map((card, i) => {
          const isUsed = updatedCards[i]?.used;
          return (
            <div key={`${card.phrase}-${i}`} style={{
              transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              opacity: visible[i] ? 1 : 0,
              transform: visible[i] ? "translateY(0) scale(1)" : "translateY(10px) scale(0.97)",
            }}>
              <div style={{
                border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px", padding: "10px 16px",
                background: isUsed ? `linear-gradient(135deg, ${card.color}15, ${card.color}05)` : "rgba(255,255,255,0.01)",
                display: "flex", gap: "12px", alignItems: "flex-start",
                transition: "all 0.3s",
              }}>
                <div style={{ minWidth: "48px" }}>
                  <div style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: card.color, marginBottom: "2px" }}>
                    {card.short} {isUsed ? "✓" : ""}
                  </div>
                </div>
                <div style={{ fontSize: "17px", fontStyle: "italic", color: isUsed ? "#e8e0d0" : "#6a6078", lineHeight: "1.45", flex: 1 }}>
                  "{card.phrase}"
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
          {cards.map((_, i) => (
            <div key={i} style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.18)",
              transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)",
            }} />
          ))}
          <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>
            {usedCount}/{cards.length}
          </span>
        </div>
      </div>

      {/* Input */}
      {submitted ? (
        <div style={{
          padding: "18px 20px",
          border: "1px solid rgba(134,239,172,0.2)",
          borderRadius: "10px",
          background: "rgba(134,239,172,0.02)",
          fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8c0b0",
          marginBottom: "14px",
        }}>
          <div style={{ fontSize: "8px", letterSpacing: "3px", fontFamily: "monospace", color: "#86EFAC", marginBottom: "8px", opacity: 0.6 }}>
            COMMITTED — {usedCount}/{cards.length} WOVEN
          </div>
          {sentence}
        </div>
      ) : (
        <textarea
          value={sentence}
          onChange={e => setSentence(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)}
          placeholder="Weave all the patterns into one sentence..."
          rows={difficulty === "fulldrift" ? 5 : 4}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", color: "#f0ecff",
            fontSize: "17px", lineHeight: "1.75",
            fontFamily: "'Georgia', serif", fontStyle: sentence ? "italic" : "normal",
            padding: "16px 18px", resize: "vertical", outline: "none",
            transition: "border-color 0.2s", marginBottom: "12px",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(167,139,250,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
          autoFocus
        />
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
        {!submitted && (
          <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{
            ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3,
          }}>COMMIT ⌘↵</button>
        )}
        <button onClick={handleDeal} style={S.btnGhost}
          onMouseEnter={e => { e.target.style.color = "#a090c0"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={e => { e.target.style.color = "#5a5070"; e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
        >NEW DEAL ↺</button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={S.divider}>— PREVIOUS —</div>
          {history.map((h, i) => (
            <div key={i} style={{
              padding: "12px 14px", marginBottom: "8px",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: "7px", opacity: 1 - i * 0.12,
            }}>
              <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#8878c0", padding: "2px 5px", border: "1px solid rgba(74,63,107,0.3)", borderRadius: "3px" }}>
                  {DIFFICULTY_CONFIGS[h.difficulty]?.label}
                </span>
                <span style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: "#7060a0" }}>
                  {h.usedCount}/{h.cards.length}
                </span>
              </div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#8878a8", lineHeight: "1.65" }}>
                {h.sentence}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


function SpatialForge() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealSpatial());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 16)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealSpatial()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial words force the brain to render three-dimensional space. When the brain is modeling geometry instead of logic, awareness naturally widens.
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave the spatial phrases into one sentence..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SPATIAL_BANK_NAMES.map(name => {
            const bank = SPATIAL_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}



const HAKALAU_BANKS = {
  "Spatial": {
    color: "#67E8F9",
    short: "SPACE",
    desc: "Natural phrases that carry spatial geometry — the brain renders the space and the field widens without being asked to.",
    items: [
      "there's something about the size of this room",
      "the whole place seems to open up when you",
      "I remember the space between us just kind of",
      "you could feel how far back the room went",
      "the distance between here and the window",
      "something about the way the space sits around you",
      "the whole background of the place just kind of settles",
      "there was this depth to it, like the room went further than it should",
      "the air between things had its own weight somehow",
      "it opened up in all directions without making a big deal of it",
      "the edges of the place just kind of dissolved",
      "there was a lot of room around the actual words",
    ],
  },
  "Conjunctions": {
    color: "#C084FC",
    short: "CONJ",
    desc: "Natural connective phrases that carry multiple fields of attention at once — narrow focus can't hold them all.",
    items: [
      "and while that's going on you also kind of notice",
      "at the same time there's this other thing where",
      "even while you're thinking about that there's still",
      "and without really meaning to you also start to",
      "the whole time that was happening there was also",
      "and while part of you is following the words",
      "even as that's settling in, the whole room is",
      "and somewhere in the background of all that",
      "while the conversation kept going there was also this",
      "and at the same time the whole thing just kind of",
      "even while the foreground stays, the rest of it",
      "and you're tracking that while also noticing",
    ],
  },
  "Temporal": {
    color: "#A78BFA",
    short: "TIME",
    desc: "Casual time phrases that dissolve the timestamp — a mind without a sense of when naturally widens spatially.",
    items: [
      "and I couldn't tell you when exactly that shifted",
      "at some point in there — I'm not sure when",
      "it could've been five minutes, could've been twenty",
      "somewhere in the middle of all that",
      "before I even really noticed it had changed",
      "and by the time I thought to check the time",
      "at some point it just stopped feeling like waiting",
      "I genuinely couldn't tell you how long that was",
      "somewhere between sitting down and looking up again",
      "it's one of those things where the time just kind of goes",
      "and the when of it was the last thing I could've told you",
      "at some point that wasn't recent and wasn't long ago",
    ],
  },
  "Observer Shift": {
    color: "#86EFAC",
    short: "OBS",
    desc: "Casual moves from first to third person — the listener becomes an observer of experience rather than the subject of it.",
    items: [
      "and you know how it is when someone just kind of",
      "most people in that situation would find themselves",
      "it's one of those things where a person just",
      "anyone who's been there knows that feeling where",
      "and you get to a point where the whole thing just",
      "people tend to find, without trying to, that",
      "it's the kind of thing where you don't decide it happens",
      "most people don't notice when it shifts — it just does",
      "and a person gets to that place where the thinking quiets",
      "you know that feeling where you stop being in your head",
      "it's just what happens when the room gets that kind of quiet",
      "and anyone sitting there long enough would find",
    ],
  },
};

const HAKALAU_BANK_NAMES = Object.keys(HAKALAU_BANKS);

function dealHakalau() {
  const shuffled = [...HAKALAU_BANK_NAMES].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.4 ? 4 : 3;
  return shuffled.slice(0, count).map(name => ({
    bank: name,
    phrase: pick(HAKALAU_BANKS[name].items),
    color: HAKALAU_BANKS[name].color,
    short: HAKALAU_BANKS[name].short,
  }));
}

// ─────────────────────────────────────────────
// HAKALAU ENGINE
// ─────────────────────────────────────────────

function HakalauEngine() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealHakalau());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 18)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealHakalau()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial, conjunctive, and temporal language that induces wide peripheral awareness through the act of processing it.
      </p>
      <p style={{ fontSize: "12px", color: "#7060a0", fontFamily: "monospace", letterSpacing: "1px", textAlign: "center", marginBottom: "20px" }}>
        ALPHA STATE — outward, wide, peripheral
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave these into something a real person would actually say..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}
              onMouseEnter={e => { e.target.style.color = "#a090c0"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.target.style.color = "#c0b0e0"; e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
            >NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {[

            ["Alpha vs Theta", "Hakalau is alpha: outward, wide, eyes open, still in the room. Theta is the deeper trance state — inward, imagery-dominant, boundary between self and environment dissolves. The rest of this app trains theta induction. Hakalau trains the alpha state — useful for salespeople, coaches, anyone who needs to stay calibrated in a live conversation."],
            ["Why the phrases work", "The phrases sound conversational but carry geometry, multiplicity, and temporal looseness simultaneously. The brain widens its attentional field to process them — not because it was told to, but because that's what the processing requires. The listener never knows a technique was used."],
          ].map(([title, desc]) => (
            <div key={title} style={{ padding: "14px 16px", border: "1px solid rgba(103,232,249,0.15)", borderRadius: "8px", background: "rgba(103,232,249,0.03)" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px" }}>{title.toUpperCase()}</div>
              <p style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.75", margin: 0 }}>{desc}</p>
            </div>
          ))}
          {HAKALAU_BANK_NAMES.map(name => {
            const bank = HAKALAU_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}


function SpatialForge() {
  const [subView, setSubView] = useState("practice");
  const [cards, setCards] = useState(() => dealSpatial());
  const [sentence, setSentence] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([false,false,false,false]);

  const updatedCards = cards.map(card => ({
    ...card,
    used: sentence.toLowerCase().includes(card.phrase.toLowerCase().slice(0, 16)),
  }));
  const usedCount = updatedCards.filter(c => c.used).length;

  useEffect(() => {
    if (subView !== "practice") return;
    setVisible([false,false,false,false]);
    cards.forEach((_, i) => setTimeout(() => setVisible(v => { const n=[...v]; n[i]=true; return n; }), i*120));
  }, [cards, subView]);

  const handleDeal = useCallback(() => {
    if (sentence.trim()) setHistory(h => [{ sentence, cards, usedCount }, ...h].slice(0, 6));
    setSubmitted(false);
    setVisible([false,false,false,false]);
    setTimeout(() => { setCards(dealSpatial()); setSentence(""); }, 150);
  }, [sentence, cards, usedCount]);

  return (
    <>
      <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", textAlign: "center", marginBottom: "8px", lineHeight: "1.65" }}>
        Spatial words force the brain to render three-dimensional space. When the brain is modeling geometry instead of logic, awareness naturally widens.
      </p>

      <div style={{ ...S.tabBar, marginBottom: "20px" }}>
        <Tab label="PRACTICE" active={subView==="practice"} onClick={() => setSubView("practice")} />
        <Tab label="ALL BANKS" active={subView==="banks"} onClick={() => setSubView("banks")} />
      </div>

      {subView === "practice" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cards.map((card, i) => {
              const isUsed = updatedCards[i]?.used;
              return (
                <div key={`${card.phrase}-${i}`} style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", opacity: visible[i] ? 1 : 0, transform: visible[i] ? "translateY(0)" : "translateY(12px)" }}>
                  <div style={{ border: `1px solid ${isUsed ? card.color : "rgba(255,255,255,0.12)"}`, borderRadius: "8px", padding: "12px 16px", background: isUsed ? `linear-gradient(135deg, ${card.color}18, ${card.color}06)` : "rgba(255,255,255,0.02)", transition: "all 0.3s" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: card.color, marginBottom: "5px" }}>{card.short} {isUsed ? "✓" : ""}</div>
                    <div style={{ fontSize: "16px", fontStyle: "italic", color: isUsed ? "#f0ecff" : "#a090c0", lineHeight: "1.45", transition: "color 0.3s" }}>"{card.phrase}"</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
              {cards.map((_, i) => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: updatedCards[i]?.used ? updatedCards[i].color : "rgba(255,255,255,0.12)", transition: "all 0.3s", transform: updatedCards[i]?.used ? "scale(1.4)" : "scale(1)" }} />)}
              <span style={{ fontSize: "10px", color: "#7060a0", marginLeft: "8px", fontFamily: "monospace" }}>{usedCount}/{cards.length}</span>
            </div>
          </div>

          {submitted ? (
            <div style={{ padding: "18px 20px", border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", background: "rgba(103,232,249,0.03)", fontSize: "17px", lineHeight: "1.8", fontStyle: "italic", color: "#c8e8f0", marginBottom: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px", opacity: 0.6 }}>COMMITTED — {usedCount}/{cards.length}</div>
              {sentence}
            </div>
          ) : (
            <textarea value={sentence} onChange={e => setSentence(e.target.value)} onKeyDown={e => e.key === "Enter" && e.metaKey && sentence.trim() && setSubmitted(true)} placeholder="Weave the spatial phrases into one sentence..." rows={4} style={{ ...S.textarea, fontStyle: sentence ? "italic" : "normal", marginBottom: "12px" }} onFocus={e => e.target.style.borderColor = "rgba(103,232,249,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"} autoFocus />
          )}

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
            {!submitted && <button onClick={() => sentence.trim() && setSubmitted(true)} disabled={!sentence.trim()} style={{ ...S.btnPrimary, opacity: sentence.trim() ? 1 : 0.3 }}>COMMIT ⌘↵</button>}
            <button onClick={handleDeal} style={S.btnGhost}>NEW DEAL ↺</button>
          </div>

          {history.length > 0 && (
            <div>
              <div style={S.divider}>— PREVIOUS —</div>
              {history.map((h, i) => (
                <div key={i} style={{ padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "7px", opacity: 1 - i*0.12 }}>
                  <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>{h.cards.map((c,j) => <span key={j} style={{ fontSize: "8px", letterSpacing: "2px", fontFamily: "monospace", color: c.color, padding: "2px 5px", border: `1px solid ${c.color}30`, borderRadius: "3px" }}>{c.short}</span>)}</div>
                  <div style={{ fontSize: "15px", fontStyle: "italic", color: "#9080b0", lineHeight: "1.6" }}>{h.sentence}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {subView === "banks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SPATIAL_BANK_NAMES.map(name => {
            const bank = SPATIAL_BANKS[name];
            return (
              <div key={name}>
                <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: bank.color }}>{bank.short}</span>
                  <span style={{ fontSize: "17px", color: "#d8c8f0" }}>{name}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic", margin: "0 0 10px", lineHeight: "1.5" }}>{bank.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {bank.items.map((item, i) => <span key={i} style={{ padding: "4px 10px", border: `1px solid ${bank.color}25`, borderRadius: "4px", background: `${bank.color}07`, fontSize: "13px", fontStyle: "italic", color: "#a090c0" }}>{item}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}





// ─────────────────────────────────────────────
// HAKALAU TRAINER
// ─────────────────────────────────────────────

const HAKALAU_PHASES = [
  {
    id: "anchor",
    title: "Find Your Anchor Point",
    duration: 0,
    color: "#67E8F9",
    instruction: "Choose a single point slightly above eye level — a spot on a wall, a corner, anything fixed. Rest your eyes there. Don't stare hard. Just let them land.",
    cue: "Soft gaze. Not intense. Just resting.",
  },
  {
    id: "expand",
    title: "Expand Without Moving",
    duration: 30,
    color: "#86EFAC",
    instruction: "Keep your eyes on the anchor. Without moving them, begin to notice what exists to the left and right of it. Don't look. Just allow. The peripheral field is already there — you're simply letting it come forward.",
    cue: "Eyes still. Everything else widening.",
  },
  {
    id: "above",
    title: "Include Above and Below",
    duration: 30,
    color: "#C084FC",
    instruction: "Still on the anchor. Now expand vertically — floor, ceiling, the full arc of the room above and below. You're not scanning. You're holding everything simultaneously without focusing on any of it.",
    cue: "Wide. Still. The whole room present.",
  },
  {
    id: "deepen",
    title: "Let the Periphery Come Alive",
    duration: 45,
    color: "#FCD34D",
    instruction: "Stay wide. Notice that movement at the edges of your vision becomes more vivid. Colors may shift slightly. The central point becomes almost unimportant — it's just an anchor, not an object. You're seeing the field, not the target.",
    cue: "Edges vivid. Center soft. Whole room.",
  },
  {
    id: "hold",
    title: "Hold the State",
    duration: 60,
    color: "#F9A8D4",
    instruction: "Stay here. Breathe normally. Notice that thinking has become quieter — not absent, just further away. You're present, calm, tracking everything without focusing on anything. This is the state. Learn what it feels like from the inside.",
    cue: "Present. Wide. Calm. Remember this.",
  },
];

function HakalauTrainer() {
  const [phase, setPhase] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [running, timeLeft]);

  useEffect(() => {
    if (running && timeLeft === 0) {
      const currentIdx = HAKALAU_PHASES.findIndex(p => p.id === phase);
      if (currentIdx < HAKALAU_PHASES.length - 1) {
        const next = HAKALAU_PHASES[currentIdx + 1];
        setPhase(next.id);
        setTimeLeft(next.duration);
      } else {
        setRunning(false);
        setComplete(true);
      }
    }
  }, [timeLeft, running, phase]);

  const startSession = () => {
    const first = HAKALAU_PHASES[0];
    setPhase(first.id);
    setTimeLeft(first.duration || 15);
    setRunning(true);
    setComplete(false);
  };

  const currentPhase = HAKALAU_PHASES.find(p => p.id === phase);
  const phaseIndex = HAKALAU_PHASES.findIndex(p => p.id === phase);

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p style={{ fontSize: "14px", color: "#9080b0", fontStyle: "italic", lineHeight: "1.7", marginBottom: "0" }}>
          Hakalau is a wide, peripheral awareness state — calm, present, and receptive. Useful before any conversation where you want to stay out of your own head and fully in the room.
        </p>
      </div>

      {!running && !complete && phase === null && (
        <>
          <div style={{ border: "1px solid rgba(103,232,249,0.2)", borderRadius: "10px", padding: "20px", background: "rgba(103,232,249,0.04)", marginBottom: "20px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "4px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "14px" }}>WHAT YOU'RE TRAINING</div>
            {[
              ["Alpha state", "Wide peripheral awareness, calm, present. Critical faculty steps back without going offline."],
              ["For salespeople", "Stay in this state during conversations. You read the room, track the person, stay loose."],
              ["Not trance", "You're still present and tracking. This is outward and wide. Trance is inward and deep. Different tools."],
              ["Duration", "Five phases, roughly three minutes total. Practice daily until you can enter it in seconds."],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "#67E8F9", fontSize: "12px", paddingTop: "2px" }}>◈</span>
                <div>
                  <span style={{ fontSize: "14px", color: "#c8e8f0" }}>{title} — </span>
                  <span style={{ fontSize: "14px", color: "#8878a8", fontStyle: "italic" }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={startSession} style={S.btnPrimary}>BEGIN SESSION →</button>
          </div>
        </>
      )}

      {running && currentPhase && (
        <div style={{ textAlign: "center" }}>
          {/* Phase progress */}
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "24px" }}>
            {HAKALAU_PHASES.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: i < phaseIndex ? "#67E8F9" : i === phaseIndex ? currentPhase.color : "rgba(255,255,255,0.12)",
                  transition: "all 0.3s",
                }} />
                {i < HAKALAU_PHASES.length - 1 && <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.09)" }} />}
              </div>
            ))}
          </div>

          {/* Phase title */}
          <div style={{ fontSize: "10px", letterSpacing: "4px", fontFamily: "monospace", color: currentPhase.color, marginBottom: "8px" }}>
            PHASE {phaseIndex + 1} OF {HAKALAU_PHASES.length}
          </div>
          <div style={{ fontSize: "20px", color: "#d8c8f0", marginBottom: "20px" }}>{currentPhase.title}</div>

          {/* Timer */}
          {currentPhase.duration > 0 && (
            <div style={{
              width: "90px", height: "90px", borderRadius: "50%",
              border: `3px solid ${currentPhase.color}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 0 24px ${currentPhase.color}30`,
            }}>
              <span style={{ fontSize: "28px", fontFamily: "monospace", color: currentPhase.color }}>{timeLeft}</span>
            </div>
          )}

          {/* Instruction */}
          <div style={{ padding: "18px 20px", border: `1px solid ${currentPhase.color}25`, borderRadius: "10px", background: `${currentPhase.color}06`, marginBottom: "16px", textAlign: "left" }}>
            <p style={{ fontSize: "15px", color: "#c8b8e0", lineHeight: "1.8", margin: 0 }}>{currentPhase.instruction}</p>
          </div>

          {/* Cue */}
          <div style={{ fontSize: "14px", fontStyle: "italic", color: currentPhase.color, opacity: 0.7, marginBottom: "24px" }}>
            {currentPhase.cue}
          </div>

          {/* Manual advance for first phase */}
          {currentPhase.duration === 0 && (
            <button onClick={() => { const next = HAKALAU_PHASES[1]; setPhase(next.id); setTimeLeft(next.duration); }} style={S.btnPrimary}>
              READY →
            </button>
          )}
        </div>
      )}

      {complete && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "16px" }}>SESSION COMPLETE</div>
          <p style={{ fontSize: "15px", color: "#9080b0", fontStyle: "italic", lineHeight: "1.75", marginBottom: "24px" }}>
            Remember what that felt like from the inside — the wideness, the quiet, the room present without being focused on. That's the state. Practice returning to it until you can find it in seconds, mid-conversation, without breaking eye contact.
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button onClick={startSession} style={S.btnPrimary}>AGAIN →</button>
            <button onClick={() => { setPhase(null); setComplete(false); }} style={S.btnGhost}>RESET</button>
          </div>
        </div>
      )}

      {/* Guide toggle */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px", marginTop: "32px" }}>
        <div onClick={() => setShowGuide(g => !g)} style={{ fontSize: "10px", letterSpacing: "4px", fontFamily: "monospace", color: "#7060a0", textAlign: "center", cursor: "pointer", marginBottom: showGuide ? "16px" : "0" }}>
          — {showGuide ? "HIDE" : "SHOW"} GUIDE —
        </div>
        {showGuide && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "14px 16px", border: "1px solid rgba(103,232,249,0.15)", borderRadius: "8px", background: "rgba(103,232,249,0.04)" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#67E8F9", marginBottom: "8px" }}>ALPHA vs THETA — THE DISTINCTION</div>
              <p style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.75", margin: 0 }}>
                Hakalau produces an alpha state — wide, peripheral, outward. You're present in the room, tracking everything, critical faculty quiet but online. Useful for salespeople, coaches, anyone who needs to stay calibrated in a live conversation.
              </p>
              <p style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.75", margin: "12px 0 0" }}>
                The trance patterns in the rest of this app target theta — inward, deep, imagery-dominant, boundary between self and environment softens. This is what you guide someone else into. Different state, different direction, different tools.
              </p>
            </div>
            <div style={{ padding: "14px 16px", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "8px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "monospace", color: "#7060a0", marginBottom: "8px" }}>HOW TO USE IT IN A CONVERSATION</div>
              <p style={{ fontSize: "14px", color: "#8878a8", lineHeight: "1.75", margin: 0 }}>
Enter a calm, wide state before the conversation starts. Your internal state sets the tone for the room. The patterns come more naturally when you're settled.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
const NAV_ALL = [
  { id: "drift", label: "DRIFT" },
  { id: "confusion", label: "CONFUSION" },
  { id: "commands", label: "COMMANDS" },
  { id: "influence", label: "INFLUENCE" },
  { id: "metaphor", label: "METAPHOR" },
  { id: "indirect", label: "INDIRECT" },
  { id: "sensory", label: "SENSORY" },
  { id: "combined", label: "COMBINE" },
];

export default function App() {
  const [active, setActive] = useState("guide");


  const titles = {
    guide:     ["◈ DRIFT ◈", "How to Use Drift", "Start here. Plain-language guide to every section."],
    drift:     ["◈ DRIFT ◈", "Drift Engine", "Pick your language pattern cards and write one natural sentence."],
    drift:     ["◈ DRIFT ◈", "Drift", "Language patterns for connection, rapport, and clear communication."],
    confusion: ["◈ DRIFT ◈", "Confusion Forge", "Language that opens new ways of thinking."],
    commands:  ["◈ DRIFT ◈", "Embedded Commands", "Gentle language that guides without pressure."],
    influence: ["◈ DRIFT ◈", "Communication Principles", "Six principles of connection, trust, and ethical persuasion."],
    metaphor:  ["◈ DRIFT ◈", "Metaphor Forge", "Build vivid language that makes complex ideas land."],
    indirect:  ["◈ DRIFT ◈", "Indirect Framing", "Describe experiences in ways that resonate naturally."],
    sensory:   ["◈ DRIFT ◈", "Sensory Stacker", "Stack until the listener is in the room."],
    combined:  ["◈ DRIFT ◈", "Combined Generator", "All patterns. One sentence. Three difficulty levels."],
    drift:     ["◈ DRIFT ◈", "Drift Engine", "Six banks. Pick your cards. One sentence."],

  };

  const [eyebrow, title, sub] = titles[active] || titles.drift;

  return (
    <div style={S.page}>
      <div style={S.glow} />
      <div style={S.container}>
        <div style={S.eyebrow}>{eyebrow}</div>
        <h1 style={S.h1}>{title}</h1>
        <p style={S.sub}>{sub}</p>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <button onClick={() => setActive("guide")} style={{
            width: "70%",
            padding: "13px 0",
            background: active === "guide" ? "rgba(34,211,238,0.25)" : "rgba(34,211,238,0.08)",
            border: `2px solid ${active === "guide" ? "rgba(34,211,238,0.7)" : "rgba(34,211,238,0.3)"}`,
            borderRadius: "8px",
            color: active === "guide" ? "#67E8F9" : "#4a9aa8",
            fontSize: "11px", letterSpacing: "4px", fontFamily: "monospace",
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: active === "guide" ? "0 0 16px rgba(34,211,238,0.2)" : "none",
          }}>
            GUIDE
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", marginBottom: "28px" }}>
          {NAV_ALL.filter(n => n.id !== "guide").map(n => (
            <Tab key={n.id} label={n.label} active={active===n.id} onClick={() => setActive(n.id)} />
          ))}
        </div>

        {/* Content */}
        {active === "guide" && <Guide />}
        {active === "drift" && <DriftEngine />}
        {active === "confusion" && <ConfusionForge />}
        {active === "commands" && <EmbeddedCommands />}
        {active === "influence" && <InfluencePrinciples />}
        {active === "metaphor" && <MetaphorForge />}
        {active === "indirect" && <IndirectFraming />}
        {active === "sensory" && <SensoryStacker />}
        {active === "combined" && <CombinedGenerator />}
      </div>
      <style>{`textarea::placeholder, input::placeholder { color: #6050a0; font-style: italic; } * { -webkit-font-smoothing: antialiased; }`}</style>
    </div>
  );
}
