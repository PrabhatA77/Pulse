import type { DemoSnippet } from "./types";

export const demoData: DemoSnippet[] = [
  {
    title: "prime_check.py",
    language: "python",
    code: `def is_prime(n):
    if n < 2:
        return False

    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1

    return True`,
    analysis: {
      status: "PASSED",
      timeComplexity: "O(√n)",
      spaceComplexity: "O(1)",
      insight:
        "Checks divisibility only up to the square root of n, making it an efficient primality test.",
    },
  },
  {
    title: "gcd.cpp",
    language: "cpp",
    code: `int gcd(int a, int b) {
    while (b) {
        int t = b;
        b = a % b;
        a = t;
    }
    return a;
}`,
    analysis: {
      status: "PASSED",
      timeComplexity: "O(log(min(a,b)))",
      spaceComplexity: "O(1)",
      insight:
        "Uses the Euclidean algorithm to compute the greatest common divisor efficiently.",
    },
  },
];
