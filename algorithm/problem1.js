function solution(s) {
  const stack = [];

  for (const char of s) {
    if (char === '(') stack.push(')');
    else if (char === '{') stack.push('}');
    else if (char === '[') stack.push(']');
    else if (stack.pop() !== char) return false;
  }

  return stack.length === 0;
}

export { solution };
