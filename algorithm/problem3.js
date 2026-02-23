function solution(nums1, nums2) {
  if (nums1.length < nums2.length) [nums1, nums2] = [nums2, nums1];

  const set1 = new Set(nums1);
  const result = [];

  for (const num of nums2) {
    if (set1.has(num)) {
      result.push(num);
      set1.delete(num);
    }
  }

  return result;
}

export { solution };
