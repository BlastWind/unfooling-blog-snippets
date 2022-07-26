import naiveStringMatch from "../naive";
describe("naiveStringMatch", () => {
  test("returns nothing when pattern is empty", () => {
    expect(naiveStringMatch("zxcvrtqw", "")).toStrictEqual([]);
  });
  test("returns nothing when input is empty", () => {
    expect(naiveStringMatch("", "a")).toStrictEqual([]);
  });
  test("return 0 if input str same as pattern", () => {
    expect(naiveStringMatch("asdfasdf", "asdfasdf")).toStrictEqual([0]);
  });
  test("recognizes overlapping patterns", () => {
    expect(naiveStringMatch("aaaa", "aa")).toStrictEqual([0, 1, 2]);
  });
});
