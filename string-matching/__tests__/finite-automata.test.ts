import {
  stringMatcher,
  buildTransitionFunction,
  suffix,
  prefix,
} from "../finite-automata";
describe("stringMatcher", () => {
  test("returns nothing when pattern is empty", () => {
    expect(stringMatcher("zxcvrtqw", "")).toStrictEqual([]);
  });
  test("returns nothing when input is empty", () => {
    expect(stringMatcher("", "a")).toStrictEqual([]);
  });
  test("return 0 if input str same as pattern", () => {
    expect(stringMatcher("asdfasdf", "asdfasdf")).toStrictEqual([0]);
  });
  test("recognizes overlapping patterns", () => {
    expect(stringMatcher("aaaa", "aa")).toStrictEqual([0, 1, 2]);
  });
  test("recognizes overlapping patterns", () => {
    expect(stringMatcher("aabababbab", "bab")).toStrictEqual([2, 4, 7]);
  });
  test("works with words not in vocabulary", () => {
    expect(stringMatcher("zx", "bs")).toStrictEqual([]);
  });
  test("works with combinations of words in and out of vocabulary", () => {
    expect(stringMatcher("zbsx", "bs")).toStrictEqual([1]);
  });
  test("works with combinations of words in and out of vocabulary", () => {
    expect(stringMatcher("xsb", "bs")).toStrictEqual([]);
  });
});

describe("buildTransitionFunction", () => {
  test("builds one element pattern", () => {
    expect(buildTransitionFunction("a")).toStrictEqual([{ a: 1 }, { a: 1 }]);
  });
  test("builds two element pattern", () => {
    expect(buildTransitionFunction("ab")).toStrictEqual([
      { a: 1, b: 0 },
      { a: 1, b: 2 },
      { a: 1, b: 0 },
    ]);
  });
  test("builds repeated element pattern", () => {
    expect(buildTransitionFunction("aaaaa")).toStrictEqual([
      { a: 1 },
      { a: 2 },
      { a: 3 },
      { a: 4 },
      { a: 5 },
      { a: 5 },
    ]);
  });
  test("builds pattern with no significant fallback", () => {
    expect(buildTransitionFunction("abc")).toStrictEqual([
      { a: 1, b: 0, c: 0 },
      {
        a: 1,
        b: 2,
        c: 0,
      },
      { a: 1, b: 0, c: 3 },
      { a: 1, b: 0, c: 0 },
    ]);
  });
  test("builds pattern with significant fallback", () => {
    expect(buildTransitionFunction("aabcaabd")).toStrictEqual([
      { a: 1, b: 0, c: 0, d: 0 },
      { a: 2, b: 0, c: 0, d: 0 },
      { a: 2, b: 3, c: 0, d: 0 },
      { a: 1, b: 0, c: 4, d: 0 },
      { a: 5, b: 0, c: 0, d: 0 },
      { a: 6, b: 0, c: 0, d: 0 },
      { a: 2, b: 7, c: 0, d: 0 },
      { a: 1, b: 0, c: 4, d: 8 }, // significant fallback here: We get to fall back to having matched "aabc" if we match a "c" instead of the ideal "d"
      { a: 1, b: 0, c: 0, d: 0 },
    ]);
  });
});
describe("suffix", () => {
  test("if suffixLen 0 then empty returned", () => {
    expect(suffix("a", 0)).toBe("");
  });
  test("returns str when suffixLen === str.length", () => {
    const str = "aasf";
    expect(suffix(str, str.length)).toBe(str);
  });
  test("suffixLen 4 on len 5 str", () => {
    const str = "aasdf";
    expect(suffix(str, 4)).toBe("asdf");
  });
});
describe("prefix", () => {
  test("if prefix 0 then empty returned", () => {
    expect(prefix("asdf", 0)).toBe("");
  });
  test("if str length prefix length then str returned", () => {
    expect(prefix("asdf", 4)).toBe("asdf");
  });
  test("prefix len 1 on len 4 str", () => {
    expect(prefix("asdf", 1)).toBe("a");
  });
  test("prefix len 3 on len 4 str", () => {
    expect(prefix("asdf", 3)).toBe("asd");
  });
});
