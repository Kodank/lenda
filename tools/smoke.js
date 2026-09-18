const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {
  console, Math, Date, JSON, Number, String, Array, Object, parseInt, isFinite,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
};
vm.createContext(ctx);
["world", "more_clubs", "data", "rng", "engine", "sim", "career"].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, "js", f + ".js"), "utf8"), ctx);
});

function run(pos, clubId, side) {
  const s = ctx.newCareer({ name: "TESTE", number: 9, foot: "D", nation: "br", pos: pos, pace: "normal" });
  ctx.signAcademy(s, clubId);
  let guard = 0;
  while (!s.retired && s.age < 40 && guard++ < 40) {
    if (!s.seasons.length) {
      const bak = s.pace;
      s.pace = "intensa";
      ctx.advance(s);
      s.pace = bak;
      continue;
    }
    ctx.applyChoice(s, ctx.pickEvent(s), side);
    ctx.advance(s);
  }
  s.retired = true;
  const sc = ctx.finalScore(s);
  return {
    pos, club: clubId, age: s.age, ovr: s.ovr, peak: s.peakOvr,
    apps: s.career.apps, g: s.career.goals, a: s.career.assists, cs: s.career.cs,
    caps: s.caps, ntG: s.ntGoals, trophies: s.career.trophies.length, awards: s.awards,
    ver: ctx.verdict(s, sc), score: sc.total, clubs: ctx.clubAppsMap(s).map(function (c) { return c.id; })
  };
}

const rows = [
  run("ATA", "ava", "a"),
  run("ATA", "fla", "a"),
  run("ATA", "fla", "b"),
  run("MEI", "pal", "a"),
  run("ZAG", "san", "a"),
  run("GOL", "cea", "a")
];

/* Academy offers: always home nation, distinct, random across seeds */
function assertAcademy(nation) {
  const s1 = ctx.newCareer({ name: "A", number: 9, foot: "D", nation: nation, pos: "ATA", pace: "normal" });
  const s2 = ctx.newCareer({ name: "B", number: 9, foot: "D", nation: nation, pos: "ATA", pace: "normal" });
  // force different seeds if newCareer uses same seed from name/nation
  s2.seed = (s1.seed + 7919) >>> 0;
  s2.rndI = 0;
  const a = ctx.academyOffers(s1);
  const b = ctx.academyOffers(s2);
  if (!a.length) throw new Error("no offers for " + nation);
  a.forEach(function (o) {
    if (o.club.nation !== nation) throw new Error("foreign academy offer " + o.club.id + " for " + nation);
  });
  const ids = a.map(function (o) { return o.club.id; });
  if (new Set(ids).size !== ids.length) throw new Error("duplicate academy clubs " + ids);
  if (a.length > 3) throw new Error("too many offers");
  const byNation = ctx.CLUBS.filter(function (c) { return c.nation === nation; });
  if (byNation.length >= 3 && a.length !== 3) throw new Error("expected 3 offers for " + nation + " got " + a.length);
  console.log("academy", nation, "n=" + a.length, ids.join(","), "alt=", b.map(function (o) { return o.club.id; }).join(","));
}
["br","ar","en","ng","sn","uy","jp"].forEach(assertAcademy);

/* Trophy names not generic for major leagues */
["premier","laliga","seriea","bundesliga","ligue1","brasileirao","fa_cup","copa_br","copa_rey"].forEach(function (id) {
  const m = ctx.trophyOf(id);
  if (/Liga nacional|Copa nacional/.test(m.name) && id !== "copa") throw new Error("generic trophy name for " + id + ": " + m.name);
  console.log("trophy", id, m.name, m.img);
});

console.log(JSON.stringify(rows, null, 2));
