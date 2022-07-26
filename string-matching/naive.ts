// Given input string s and pattern p, find all occurences of p in s, overlaps allowed
const naiveStringMatch = (s: string, p: string) => {
  const pLen = p.length;
  const sLen = s.length;
  const occurences: number[] = [];
  if(pLen === 0 || sLen === 0) return occurences;
  for (let i = 0; i < sLen - pLen + 1; i++)
    if (s.substring(i, i + pLen) === p) occurences.push(i);
  return occurences;
};


export default naiveStringMatch;
