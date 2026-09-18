function hashStr(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngInt(rnd, a, b) {
  return a + Math.floor(rnd() * (b - a + 1));
}

function rngPick(rnd, arr) {
  return arr[Math.floor(rnd() * arr.length)];
}

function poisson(lambda, rnd) {
  lambda = Math.max(0, Number(lambda) || 0);
  if (lambda === 0) return 0;
  if (lambda > 40) return Math.max(0, Math.round(lambda + (rnd() - 0.5) * Math.sqrt(lambda)));
  var L = Math.exp(-lambda), k = 0, p = 1;
  do {
    k++;
    p *= rnd();
  } while (p > L);
  return k - 1;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
