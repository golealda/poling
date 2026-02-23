function solution(s) {
  let left = 0, maxLen = 0;
  const lastIndex = Array(128).fill(-1);

  for (let right = 0; right < s.length; right++) {

    const code = s.charCodeAt(right);

    if (lastIndex[code] >= left) {
      left = lastIndex[code] + 1;
    }

    lastIndex[code] = right;
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

export { solution };
