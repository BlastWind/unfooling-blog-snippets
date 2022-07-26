const stringMatcher = (s: string, p: string) => {
  if (p.length === 0) return [];
  const transitionFunction = buildTransitionFunction(p);
  // console.log({ transitionFunction });
  const occurences = [];
  let q = 0;
  for (let i = 0; i < s.length; i++) {
    // transitionFunction's vocabulary (in other words, set of all possible actions) can't recognize input if it isn't in pattern
    if (!transitionFunction[q][s[i]]) {
      q = 0;
      continue;
    }
    q = transitionFunction[q][s[i]];
    if (q === p.length) {
      occurences.push(i - p.length + 1);
    }
  }
  return occurences;
};

// transitionFunction[0]["b"] = 1 represents that, accepting "b" at state 0 moves the automata to state 1
// This data structure corresponds to transitionFunction(0, "b") -> 1
type TransitionFunction = Array<Record<string, number>>;

const buildTransitionFunction = (p: string) => {
  const pLen = p.length;
  if (pLen === 0) return [];
  const table: TransitionFunction = Array.from({ length: pLen + 1 }, Object);
  const vocab: Set<string> = new Set(Array.from(p));
  // q is the current index along the spine
  for (let q = 0; q <= pLen; q++) {
    // Note that this is where this algorithm gets not so ideal: checking each char in the vocab is expensive!
    // Do we really need to check EACH char? KMP answers this
    vocab.forEach((char) => {
      const Pq = prefix(p, q);
      const PqA = Pq + char;
      // find longest suffix of PqA that is a prefix of P
      // We definitely will find a match that advances us into the next state, q + 1, think of this as why we start at q + 1, and not q
      for (let k = q + 1; k >= 0; k--) {
        const Pk = prefix(p, k);
        if (suffix(PqA, k) === Pk) {
          table[q][char] = k;
          break;
        }
      }
    });
  }
  return table;
};
// suffix of s, of length suffixLen
const suffix = (s: string, suffixLen: number) =>
  s.substring(s.length - suffixLen, s.length);

// prefix of s, of length prefixLen
const prefix = (s: string, prefixLen: number) => s.substring(0, prefixLen);

// If the new character scanned in the input string fails to move the automata forward,
// Potentially, the last few input characters happens to be a prefix of the input string
// As a simple example, for the pattern abc, say that I have scanned in "ab", then, if
// the next input character is "a", I fail to match, but, I can fall back to the state
// of having already matched "a"

// Formally, I can fall back to the longest prefix.
export { stringMatcher, buildTransitionFunction, suffix, prefix };
