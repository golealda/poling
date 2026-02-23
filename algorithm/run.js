import { solution as p1 } from "./problem1.js";
import { solution as p2 } from "./problem2.js";
import { solution as p3 } from "./problem3.js";

console.log("=== Problem 1 ===");
console.log(p1("()"));
console.log(p1("()[]{}"));
console.log(p1("(]"));
console.log(p1("([)]"));
console.log(p1("{[]}"));

console.log("\n=== Problem 2 ===");
console.log(p2("abcabcbb"));
console.log(p2("bbbbb"));
console.log(p2("pwwkew"));
console.log(p2(""));

console.log("\n=== Problem 3 ===");
console.log(p3([1, 2, 2, 1], [2, 2]));
console.log(p3([4, 9, 5], [9, 4, 9, 8, 4]));