// Seed datasets for AI Career Hub. All content authored for this platform.
// Coding problems use a stdin -> stdout contract so that real execution via the
// online compiler can be validated deterministically against expected output.

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface TestCase {
  input: string;
  expected: string;
  hidden: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  companies: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starter: { python: string; javascript: string };
  tests: TestCase[];
  reward: number;
}

export interface AptMethod {
  name: string;
  steps: string;
}

export interface AptQuestion {
  id: string;
  category: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answerIndex: number;
  methods: AptMethod[];
}

export interface InterviewQ {
  id: string;
  company: string;
  role: string;
  category: "Technical" | "Behavioral" | "HR" | "System Design";
  question: string;
  sampleAnswer: string;
}

export interface Note {
  id: string;
  company: string;
  type: "Product" | "Service";
  strategy: string;
  topics: string[];
}

// ---------------------------------------------------------------------------
// CODING PROBLEMS
// ---------------------------------------------------------------------------

const pyStdinNote = "# Read input from standard input, print the answer to standard output.\n";
const jsStdinNote =
  "// Read input from standard input, print the answer to standard output.\nconst data = require('fs').readFileSync(0, 'utf8').trim().split('\\n');\n";

export const PROBLEMS: Problem[] = [
  {
    id: "sum-two",
    title: "Sum of Two Numbers",
    difficulty: "Easy",
    category: "Math",
    companies: ["TCS", "Infosys", "Wipro"],
    description:
      "Given two integers a and b on a single line separated by a space, output their sum.",
    inputFormat: "A single line containing two space-separated integers a and b.",
    outputFormat: "A single integer: the sum a + b.",
    examples: [{ input: "3 5", output: "8" }],
    constraints: ["-10^9 <= a, b <= 10^9"],
    starter: {
      python: pyStdinNote + "a, b = map(int, input().split())\n# your code here\nprint(a + b)\n",
      javascript:
        jsStdinNote + "const [a, b] = data[0].split(' ').map(Number);\nconsole.log(a + b);\n",
    },
    tests: [
      { input: "3 5", expected: "8", hidden: false },
      { input: "-10 4", expected: "-6", hidden: false },
      { input: "1000000000 1000000000", expected: "2000000000", hidden: true },
      { input: "0 0", expected: "0", hidden: true },
    ],
    reward: 50,
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    difficulty: "Easy",
    category: "Strings",
    companies: ["Cognizant", "Accenture"],
    description: "Read a string and print it reversed.",
    inputFormat: "A single line containing a string s (no spaces).",
    outputFormat: "The reversed string.",
    examples: [{ input: "hello", output: "olleh" }],
    constraints: ["1 <= |s| <= 10^4"],
    starter: {
      python: pyStdinNote + "s = input()\n# your code here\nprint(s[::-1])\n",
      javascript: jsStdinNote + "console.log(data[0].split('').reverse().join(''));\n",
    },
    tests: [
      { input: "hello", expected: "olleh", hidden: false },
      { input: "racecar", expected: "racecar", hidden: false },
      { input: "CareerHub", expected: "buHreeraC", hidden: true },
    ],
    reward: 50,
  },
  {
    id: "factorial",
    title: "Factorial",
    difficulty: "Easy",
    category: "Math",
    companies: ["Infosys", "Capgemini"],
    description: "Given a non-negative integer n, output n! (factorial of n).",
    inputFormat: "A single integer n.",
    outputFormat: "The value of n!.",
    examples: [{ input: "5", output: "120" }],
    constraints: ["0 <= n <= 20"],
    starter: {
      python:
        pyStdinNote +
        "n = int(input())\nf = 1\nfor i in range(2, n + 1):\n    f *= i\nprint(f)\n",
      javascript:
        jsStdinNote +
        "let n = Number(data[0]); let f = 1n;\nfor (let i = 2n; i <= BigInt(n); i++) f *= i;\nconsole.log(f.toString());\n",
    },
    tests: [
      { input: "5", expected: "120", hidden: false },
      { input: "0", expected: "1", hidden: false },
      { input: "10", expected: "3628800", hidden: true },
    ],
    reward: 60,
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    category: "Logic",
    companies: ["Amazon", "Microsoft"],
    description:
      "For numbers 1..n print 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for multiples of both, otherwise the number. Print one value per line.",
    inputFormat: "A single integer n.",
    outputFormat: "n lines following the FizzBuzz rules.",
    examples: [{ input: "5", output: "1\n2\nFizz\n4\nBuzz" }],
    constraints: ["1 <= n <= 1000"],
    starter: {
      python:
        pyStdinNote +
        "n = int(input())\nfor i in range(1, n + 1):\n    if i % 15 == 0: print('FizzBuzz')\n    elif i % 3 == 0: print('Fizz')\n    elif i % 5 == 0: print('Buzz')\n    else: print(i)\n",
      javascript:
        jsStdinNote +
        "let n = Number(data[0]); let out = [];\nfor (let i = 1; i <= n; i++) {\n  if (i % 15 === 0) out.push('FizzBuzz');\n  else if (i % 3 === 0) out.push('Fizz');\n  else if (i % 5 === 0) out.push('Buzz');\n  else out.push(i);\n}\nconsole.log(out.join('\\n'));\n",
    },
    tests: [
      { input: "5", expected: "1\n2\nFizz\n4\nBuzz", hidden: false },
      { input: "15", expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", hidden: true },
    ],
    reward: 70,
  },
  {
    id: "max-array",
    title: "Maximum in Array",
    difficulty: "Easy",
    category: "Arrays",
    companies: ["Wipro", "Zoho"],
    description: "Given an array of integers, output the maximum element.",
    inputFormat: "First line: integer n. Second line: n space-separated integers.",
    outputFormat: "The maximum element.",
    examples: [{ input: "5\n3 7 2 9 4", output: "9" }],
    constraints: ["1 <= n <= 10^5"],
    starter: {
      python:
        pyStdinNote +
        "n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))\n",
      javascript:
        jsStdinNote +
        "const arr = data[1].split(' ').map(Number);\nconsole.log(Math.max(...arr));\n",
    },
    tests: [
      { input: "5\n3 7 2 9 4", expected: "9", hidden: false },
      { input: "1\n-5", expected: "-5", hidden: false },
      { input: "4\n-3 -7 -1 -9", expected: "-1", hidden: true },
    ],
    reward: 70,
  },
  {
    id: "two-sum",
    title: "Two Sum (Indices)",
    difficulty: "Medium",
    category: "Arrays",
    companies: ["Google", "Amazon", "Adobe"],
    description:
      "Given an array of integers and a target, output the indices (0-based, space separated, smaller index first) of the two numbers that add up to target. Exactly one solution exists.",
    inputFormat:
      "First line: n and target. Second line: n space-separated integers.",
    outputFormat: "Two space-separated indices.",
    examples: [
      { input: "4 9\n2 7 11 15", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
    ],
    constraints: ["2 <= n <= 10^4", "Exactly one valid answer exists."],
    starter: {
      python:
        pyStdinNote +
        "n, target = map(int, input().split())\nnums = list(map(int, input().split()))\nseen = {}\nfor i, x in enumerate(nums):\n    if target - x in seen:\n        print(seen[target - x], i)\n        break\n    seen[x] = i\n",
      javascript:
        jsStdinNote +
        "const [n, target] = data[0].split(' ').map(Number);\nconst nums = data[1].split(' ').map(Number);\nconst seen = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  if (seen.has(target - nums[i])) { console.log(seen.get(target - nums[i]) + ' ' + i); break; }\n  seen.set(nums[i], i);\n}\n",
    },
    tests: [
      { input: "4 9\n2 7 11 15", expected: "0 1", hidden: false },
      { input: "3 6\n3 2 4", expected: "1 2", hidden: false },
      { input: "2 6\n3 3", expected: "0 1", hidden: true },
    ],
    reward: 120,
  },
  {
    id: "palindrome",
    title: "Palindrome Check",
    difficulty: "Easy",
    category: "Strings",
    companies: ["Infosys", "Mindtree"],
    description: "Output 'YES' if the given string is a palindrome, otherwise 'NO'.",
    inputFormat: "A single line string s (lowercase, no spaces).",
    outputFormat: "YES or NO.",
    examples: [{ input: "madam", output: "YES" }],
    constraints: ["1 <= |s| <= 10^4"],
    starter: {
      python: pyStdinNote + "s = input()\nprint('YES' if s == s[::-1] else 'NO')\n",
      javascript:
        jsStdinNote +
        "const s = data[0];\nconsole.log(s === s.split('').reverse().join('') ? 'YES' : 'NO');\n",
    },
    tests: [
      { input: "madam", expected: "YES", hidden: false },
      { input: "hello", expected: "NO", hidden: false },
      { input: "abcba", expected: "YES", hidden: true },
    ],
    reward: 60,
  },
  {
    id: "count-vowels",
    title: "Count Vowels",
    difficulty: "Easy",
    category: "Strings",
    companies: ["Accenture", "Cognizant"],
    description: "Count the number of vowels (a, e, i, o, u) in the given lowercase string.",
    inputFormat: "A single line string s.",
    outputFormat: "An integer count of vowels.",
    examples: [{ input: "education", output: "5" }],
    constraints: ["1 <= |s| <= 10^4"],
    starter: {
      python:
        pyStdinNote +
        "s = input()\nprint(sum(1 for c in s if c in 'aeiou'))\n",
      javascript:
        jsStdinNote +
        "const s = data[0];\nconsole.log((s.match(/[aeiou]/g) || []).length);\n",
    },
    tests: [
      { input: "education", expected: "5", hidden: false },
      { input: "rhythm", expected: "0", hidden: false },
      { input: "careerhub", expected: "4", hidden: true },
    ],
    reward: 60,
  },
  {
    id: "fibonacci",
    title: "Nth Fibonacci",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companies: ["Microsoft", "Flipkart"],
    description:
      "Output the Nth Fibonacci number where F(0)=0, F(1)=1. Use an iterative approach.",
    inputFormat: "A single integer n.",
    outputFormat: "The Nth Fibonacci number.",
    examples: [{ input: "10", output: "55" }],
    constraints: ["0 <= n <= 90"],
    starter: {
      python:
        pyStdinNote +
        "n = int(input())\na, b = 0, 1\nfor _ in range(n):\n    a, b = b, a + b\nprint(a)\n",
      javascript:
        jsStdinNote +
        "let n = Number(data[0]); let a = 0n, b = 1n;\nfor (let i = 0; i < n; i++) { [a, b] = [b, a + b]; }\nconsole.log(a.toString());\n",
    },
    tests: [
      { input: "10", expected: "55", hidden: false },
      { input: "0", expected: "0", hidden: false },
      { input: "20", expected: "6765", hidden: true },
    ],
    reward: 120,
  },
  {
    id: "gcd",
    title: "Greatest Common Divisor",
    difficulty: "Medium",
    category: "Math",
    companies: ["Amazon", "Oracle"],
    description: "Given two integers a and b, output their GCD using the Euclidean algorithm.",
    inputFormat: "A single line with two integers a and b.",
    outputFormat: "The GCD of a and b.",
    examples: [{ input: "48 36", output: "12" }],
    constraints: ["1 <= a, b <= 10^9"],
    starter: {
      python:
        pyStdinNote +
        "import math\na, b = map(int, input().split())\nprint(math.gcd(a, b))\n",
      javascript:
        jsStdinNote +
        "let [a, b] = data[0].split(' ').map(Number);\nconst gcd = (x, y) => y ? gcd(y, x % y) : x;\nconsole.log(gcd(a, b));\n",
    },
    tests: [
      { input: "48 36", expected: "12", hidden: false },
      { input: "17 5", expected: "1", hidden: false },
      { input: "100 1000", expected: "100", hidden: true },
    ],
    reward: 110,
  },
  {
    id: "second-largest",
    title: "Second Largest Element",
    difficulty: "Medium",
    category: "Arrays",
    companies: ["Zoho", "Paytm"],
    description:
      "Given n distinct integers, output the second largest element.",
    inputFormat: "First line: n. Second line: n space-separated integers.",
    outputFormat: "The second largest element.",
    examples: [{ input: "5\n10 5 20 8 15", output: "15" }],
    constraints: ["2 <= n <= 10^5", "All elements distinct."],
    starter: {
      python:
        pyStdinNote +
        "n = int(input())\narr = sorted(set(map(int, input().split())))\nprint(arr[-2])\n",
      javascript:
        jsStdinNote +
        "const arr = [...new Set(data[1].split(' ').map(Number))].sort((a,b)=>a-b);\nconsole.log(arr[arr.length - 2]);\n",
    },
    tests: [
      { input: "5\n10 5 20 8 15", expected: "15", hidden: false },
      { input: "2\n1 2", expected: "1", hidden: false },
      { input: "4\n-1 -5 -3 -2", expected: "-2", hidden: true },
    ],
    reward: 120,
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Hard",
    category: "Searching",
    companies: ["Google", "Meta", "Apple"],
    description:
      "Given a sorted array and a target, output the 0-based index of target, or -1 if not present.",
    inputFormat:
      "First line: n and target. Second line: n sorted space-separated integers.",
    outputFormat: "The index of target, or -1.",
    examples: [{ input: "5 7\n1 3 5 7 9", output: "3" }],
    constraints: ["1 <= n <= 10^6", "Array is sorted ascending."],
    starter: {
      python:
        pyStdinNote +
        "n, t = map(int, input().split())\narr = list(map(int, input().split()))\nlo, hi = 0, n - 1\nans = -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] == t: ans = mid; break\n    elif arr[mid] < t: lo = mid + 1\n    else: hi = mid - 1\nprint(ans)\n",
      javascript:
        jsStdinNote +
        "const [n, t] = data[0].split(' ').map(Number);\nconst arr = data[1].split(' ').map(Number);\nlet lo = 0, hi = n - 1, ans = -1;\nwhile (lo <= hi) { const mid = (lo + hi) >> 1; if (arr[mid] === t) { ans = mid; break; } else if (arr[mid] < t) lo = mid + 1; else hi = mid - 1; }\nconsole.log(ans);\n",
    },
    tests: [
      { input: "5 7\n1 3 5 7 9", expected: "3", hidden: false },
      { input: "5 4\n1 3 5 7 9", expected: "-1", hidden: false },
      { input: "6 11\n2 4 6 8 10 11", expected: "5", hidden: true },
    ],
    reward: 180,
  },
];

// ---------------------------------------------------------------------------
// APTITUDE QUESTIONS (with multiple solving methods)
// ---------------------------------------------------------------------------

export const APTITUDE: AptQuestion[] = [
  {
    id: "apt-pct-1",
    category: "Quantitative",
    topic: "Percentages",
    difficulty: "Easy",
    question: "What is 25% of 200?",
    options: ["25", "50", "75", "100"],
    answerIndex: 1,
    methods: [
      { name: "Fraction shortcut", steps: "25% = 1/4. So 200 ÷ 4 = 50." },
      { name: "Decimal method", steps: "25% = 0.25. So 0.25 × 200 = 50." },
      { name: "Unitary method", steps: "1% of 200 = 2, so 25% = 25 × 2 = 50." },
    ],
  },
  {
    id: "apt-pct-2",
    category: "Quantitative",
    topic: "Percentages",
    difficulty: "Medium",
    question:
      "A number increased by 20% gives 60. What is the original number?",
    options: ["48", "50", "52", "45"],
    answerIndex: 1,
    methods: [
      {
        name: "Equation method",
        steps: "x × 1.20 = 60 → x = 60 / 1.2 = 50.",
      },
      {
        name: "Reverse percentage",
        steps: "60 represents 120%. 1% = 60/120 = 0.5, so 100% = 50.",
      },
    ],
  },
  {
    id: "apt-ratio-1",
    category: "Quantitative",
    topic: "Ratio & Proportion",
    difficulty: "Medium",
    question:
      "Two numbers are in the ratio 3:5 and their sum is 64. What is the larger number?",
    options: ["24", "40", "36", "30"],
    answerIndex: 1,
    methods: [
      {
        name: "Parts method",
        steps: "Total parts = 3 + 5 = 8. Each part = 64/8 = 8. Larger = 5 × 8 = 40.",
      },
      {
        name: "Algebraic method",
        steps: "Let numbers be 3x and 5x. 8x = 64 → x = 8. Larger = 5(8) = 40.",
      },
    ],
  },
  {
    id: "apt-ti-1",
    category: "Quantitative",
    topic: "Time & Work",
    difficulty: "Medium",
    question:
      "A can do a work in 10 days and B in 15 days. Working together, how many days will they take?",
    options: ["5", "6", "7", "8"],
    answerIndex: 1,
    methods: [
      {
        name: "Rate addition",
        steps: "Rates: 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. So 6 days.",
      },
      {
        name: "LCM units method",
        steps:
          "LCM(10,15)=30 units. A=3 units/day, B=2 units/day, together=5. 30/5 = 6 days.",
      },
    ],
  },
  {
    id: "apt-speed-1",
    category: "Quantitative",
    topic: "Speed & Distance",
    difficulty: "Easy",
    question: "A car travels 150 km in 3 hours. What is its average speed?",
    options: ["45 km/h", "50 km/h", "55 km/h", "60 km/h"],
    answerIndex: 1,
    methods: [
      { name: "Formula", steps: "Speed = Distance / Time = 150 / 3 = 50 km/h." },
    ],
  },
  {
    id: "apt-si-1",
    category: "Quantitative",
    topic: "Simple Interest",
    difficulty: "Medium",
    question:
      "Find the simple interest on ₹2000 at 5% per annum for 2 years.",
    options: ["₹150", "₹200", "₹250", "₹300"],
    answerIndex: 1,
    methods: [
      {
        name: "SI formula",
        steps: "SI = P×R×T/100 = 2000×5×2/100 = ₹200.",
      },
      {
        name: "Per-year method",
        steps: "Yearly interest = 5% of 2000 = 100. For 2 years = 200.",
      },
    ],
  },
  {
    id: "apt-avg-1",
    category: "Quantitative",
    topic: "Averages",
    difficulty: "Easy",
    question: "The average of 4, 8, 12, and 16 is:",
    options: ["8", "10", "12", "14"],
    answerIndex: 1,
    methods: [
      {
        name: "Sum/count",
        steps: "(4+8+12+16)/4 = 40/4 = 10.",
      },
      {
        name: "AP shortcut",
        steps: "Evenly spaced numbers: average = (first + last)/2 = (4+16)/2 = 10.",
      },
    ],
  },
  {
    id: "apt-log-1",
    category: "Logical",
    topic: "Series",
    difficulty: "Medium",
    question: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    answerIndex: 1,
    methods: [
      {
        name: "Difference pattern",
        steps: "Differences: 4, 6, 8, 10, next is 12. 30 + 12 = 42.",
      },
      {
        name: "n(n+1) pattern",
        steps: "Terms are n(n+1): 1·2, 2·3, 3·4, 4·5, 5·6, 6·7 = 42.",
      },
    ],
  },
  {
    id: "apt-log-2",
    category: "Logical",
    topic: "Coding-Decoding",
    difficulty: "Medium",
    question: "If CAT is coded as 3-1-20, how is DOG coded?",
    options: ["4-15-7", "4-14-7", "3-15-7", "4-15-8"],
    answerIndex: 0,
    methods: [
      {
        name: "Position method",
        steps: "Each letter → alphabet position. D=4, O=15, G=7 → 4-15-7.",
      },
    ],
  },
  {
    id: "apt-verbal-1",
    category: "Verbal",
    topic: "Synonyms",
    difficulty: "Easy",
    question: "Choose the synonym of 'ABUNDANT':",
    options: ["Scarce", "Plentiful", "Empty", "Rare"],
    answerIndex: 1,
    methods: [
      {
        name: "Meaning",
        steps: "'Abundant' means existing in large quantity → 'Plentiful'.",
      },
    ],
  },
  {
    id: "apt-prob-1",
    category: "Quantitative",
    topic: "Probability",
    difficulty: "Medium",
    question: "A die is rolled. What is the probability of getting an even number?",
    options: ["1/6", "1/3", "1/2", "2/3"],
    answerIndex: 2,
    methods: [
      {
        name: "Favorable/total",
        steps: "Even outcomes {2,4,6} = 3. Total = 6. P = 3/6 = 1/2.",
      },
    ],
  },
  {
    id: "apt-perm-1",
    category: "Quantitative",
    topic: "Permutations",
    difficulty: "Hard",
    question: "In how many ways can the letters of the word 'CAT' be arranged?",
    options: ["3", "6", "9", "12"],
    answerIndex: 1,
    methods: [
      {
        name: "Factorial",
        steps: "3 distinct letters → 3! = 3 × 2 × 1 = 6.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// INTERVIEW QUESTIONS
// ---------------------------------------------------------------------------

export const INTERVIEW: InterviewQ[] = [
  {
    id: "iv-1",
    company: "Google",
    role: "SDE",
    category: "Technical",
    question: "Explain the difference between an array and a linked list.",
    sampleAnswer:
      "Arrays store elements in contiguous memory giving O(1) random access but O(n) insertion/deletion in the middle. Linked lists use nodes with pointers giving O(1) insertion/deletion when the node is known but O(n) access. Arrays have better cache locality; linked lists handle dynamic size without reallocation.",
  },
  {
    id: "iv-2",
    company: "Amazon",
    role: "SDE",
    category: "Behavioral",
    question: "Tell me about a time you handled a tight deadline.",
    sampleAnswer:
      "Use the STAR method. Situation: a project due in 3 days with scope creep. Task: deliver core features. Action: I prioritized must-haves, parallelized work, and communicated trade-offs early. Result: shipped on time with the critical path complete and documented the deferred items.",
  },
  {
    id: "iv-3",
    company: "Microsoft",
    role: "SDE",
    category: "Technical",
    question: "What is the time complexity of binary search and why?",
    sampleAnswer:
      "O(log n). Each comparison halves the remaining search space, so the number of steps is log base 2 of n. It requires a sorted array.",
  },
  {
    id: "iv-4",
    company: "TCS",
    role: "Systems Engineer",
    category: "HR",
    question: "Why do you want to join our company?",
    sampleAnswer:
      "Focus on alignment: mention the company's scale, learning opportunities, and how your skills match. Tie it to a genuine reason such as their training programs or the domains they work in.",
  },
  {
    id: "iv-5",
    company: "Meta",
    role: "SDE",
    category: "System Design",
    question: "How would you design a URL shortener?",
    sampleAnswer:
      "Discuss requirements (read-heavy, low latency), a base62 encoding of an auto-increment ID or hash, a key-value store (e.g., Redis + durable DB), collision handling, caching, and analytics. Mention scaling via sharding and a CDN for redirects.",
  },
  {
    id: "iv-6",
    company: "Adobe",
    role: "SDE",
    category: "Technical",
    question: "What is the difference between process and thread?",
    sampleAnswer:
      "A process is an independent program with its own memory space; a thread is a lightweight unit of execution within a process that shares memory. Threads are cheaper to create and communicate but require synchronization to avoid race conditions.",
  },
];

// ---------------------------------------------------------------------------
// STUDY NOTES
// ---------------------------------------------------------------------------

export const NOTES: Note[] = [
  {
    id: "note-google",
    company: "Google",
    type: "Product",
    strategy:
      "Heavy on Data Structures & Algorithms and System Design. Practice medium/hard problems, focus on clean code and complexity analysis. Behavioral rounds use Googleyness criteria.",
    topics: ["DSA", "System Design", "Big-O", "Behavioral"],
  },
  {
    id: "note-amazon",
    company: "Amazon",
    type: "Product",
    strategy:
      "DSA plus strong emphasis on the 16 Leadership Principles. Prepare STAR-format stories for behavioral rounds.",
    topics: ["DSA", "Leadership Principles", "OOP", "System Design"],
  },
  {
    id: "note-tcs",
    company: "TCS",
    type: "Service",
    strategy:
      "TCS NQT focuses on Aptitude (Quant, Logical, Verbal), basic coding, and email writing. Practice speed and accuracy in aptitude.",
    topics: ["Aptitude", "Verbal", "Basic Coding", "Email Writing"],
  },
  {
    id: "note-infosys",
    company: "Infosys",
    type: "Service",
    strategy:
      "Infosys assessment covers reasoning, quantitative aptitude, verbal, and pseudocode. The Power Programmer role adds advanced coding.",
    topics: ["Reasoning", "Quant", "Pseudocode", "Puzzles"],
  },
  {
    id: "note-microsoft",
    company: "Microsoft",
    type: "Product",
    strategy:
      "Focus on DSA, problem-solving, and system design for senior roles. Be ready to discuss past projects in depth.",
    topics: ["DSA", "System Design", "Projects", "OOP"],
  },
  {
    id: "note-wipro",
    company: "Wipro",
    type: "Service",
    strategy:
      "Wipro NLTH includes aptitude, essay writing, and coding. Communication skills matter in the final round.",
    topics: ["Aptitude", "Essay Writing", "Coding", "Communication"],
  },
];

export const SEED_VERSION = 1;
