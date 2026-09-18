const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {
  console, Math, Date, JSON, Number, String, Array, Object, parseInt, isFinite,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
};
vm.createContext(ctx);
["world", "data", "rng", "engine", "sim", "career"].forEach(function (f) {
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
console.log(JSON.stringify(rows, null, 2));
