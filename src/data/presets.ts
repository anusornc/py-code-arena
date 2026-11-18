import { ChallengePreset } from '../types/benchmark';

export const CHALLENGE_PRESETS: ChallengePreset[] = [
  {
    id: 'sorting',
    title: 'Sorting Algorithms Showdown',
    titleTh: 'การแข่งขันอัลกอริทึมเรียงลำดับ (Sorting Showdown)',
    category: 'sorting',
    difficulty: 'Medium',
    description: 'Compare QuickSort (divide & conquer) against BubbleSort (nested loops) and Python built-in Timsort on various array sizes and edge cases.',
    descriptionTh: 'เปรียบเทียบ QuickSort (แบ่งแยกและเอาชนะ) กับ BubbleSort (ลูปซ้อน) และ Timsort (ฟังก์ชัน sorted() ของ Python) ทั้งกรณีข้อมูลสุ่มและกรณีแย่สุด (Worst Case)',
    competitors: [
      {
        id: 'comp-1',
        name: 'QuickSort (Lomuto Partition)',
        author: 'กิตติพงษ์ (Student A)',
        color: '#10b981', // Emerald
        entryFunction: 'quicksort_solve',
        code: `def quicksort_solve(arr):
    """
    Student A: Recursive In-Place QuickSort
    Time Complexity: O(N log N) average, O(N²) worst
    Space Complexity: O(log N) recursion stack
    """
    # Create copy so we don't mutate input in place
    data = list(arr)
    
    def _partition(low, high):
        pivot = data[high]
        i = low - 1
        for j in range(low, high):
            if data[j] <= pivot:
                i += 1
                data[i], data[j] = data[j], data[i]
        data[i + 1], data[high] = data[high], data[i + 1]
        return i + 1

    def _quicksort(low, high):
        if low < high:
            pi = _partition(low, high)
            _quicksort(low, pi - 1)
            _quicksort(pi + 1, high)

    if len(data) > 1:
        _quicksort(0, len(data) - 1)
    return data
`,
      },
      {
        id: 'comp-2',
        name: 'BubbleSort (Optimized with Flag)',
        author: 'ธนพล (Student B)',
        color: '#f59e0b', // Amber
        entryFunction: 'bubblesort_solve',
        code: `def bubblesort_solve(arr):
    """
    Student B: Bubble Sort with Early Exit flag
    Time Complexity: O(N²) worst/average, O(N) best
    Space Complexity: O(1) auxiliary
    """
    data = list(arr)
    n = len(data)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if data[j] > data[j + 1]:
                data[j], data[j + 1] = data[j + 1], data[j]
                swapped = True
        if not swapped:
            break
    return data
`,
      },
      {
        id: 'comp-3',
        name: 'Python Timsort (sorted())',
        author: 'Reference (Standard Lib)',
        color: '#6366f1', // Indigo
        entryFunction: 'timsort_solve',
        code: `def timsort_solve(arr):
    """
    Python Standard Library: C-optimized Timsort
    Hybrid MergeSort + InsertionSort
    Time Complexity: O(N log N) worst/average
    """
    return sorted(arr)
`,
      },
    ],
    testCases: [
      {
        id: 'sort-s',
        label: 'Small Random Array (N=50)',
        description: '50 random integers between 1 and 1000',
        inputCode: '[74, 12, 89, 43, 2, 99, 15, 68, 33, 91, 5, 27, 84, 52, 19, 70, 38, 6, 95, 41, 14, 88, 3, 62, 29, 77, 48, 10, 85, 34, 98, 22, 65, 37, 8, 93, 45, 17, 81, 25, 73, 50, 11, 87, 31, 96, 20, 67, 39, 4]',
        sizeTag: 'S',
        n: 50,
      },
      {
        id: 'sort-m',
        label: 'Medium Random Array (N=500)',
        description: '500 pseudo-random numbers',
        inputCode: '[(i * 37 + 13) % 10000 for i in range(500)]',
        sizeTag: 'M',
        n: 500,
      },
      {
        id: 'sort-l',
        label: 'Large Random Array (N=2,000)',
        description: '2,000 pseudo-random numbers showing stark O(N²) vs O(N log N) gap',
        inputCode: '[(i * 101 + 47) % 50000 for i in range(2000)]',
        sizeTag: 'L',
        n: 2000,
      },
      {
        id: 'sort-edge-sorted',
        label: 'Edge Case: Already Sorted (N=500)',
        description: 'Pre-sorted array testing best-case bubble sort flag vs quicksort pivot',
        inputCode: 'list(range(500))',
        sizeTag: 'Edge',
        n: 500,
      },
      {
        id: 'sort-edge-rev',
        label: 'Edge Case: Reversed Array (N=500)',
        description: 'Completely reversed order [500...1]',
        inputCode: 'list(range(500, 0, -1))',
        sizeTag: 'Edge',
        n: 500,
      },
    ],
  },
  {
    id: 'two-sum',
    title: 'Two Sum Target Problem (LeetCode #1)',
    titleTh: 'โจทย์ค้นหาคู่ผลรวม Two Sum (LeetCode #1)',
    category: 'search',
    difficulty: 'Easy',
    description: 'Find indices of two numbers in an array that add up to a given target. Compares Hash Table dictionary lookup O(N) vs Nested Brute Force O(N²).',
    descriptionTh: 'ค้นหาตำแหน่งตัวเลข 2 ตัวที่มีผลรวมเท่ากับเป้าหมาย เปรียบเทียบวิธี Hash Map O(N) กับ Brute Force ลูปซ้อน O(N²)',
    competitors: [
      {
        id: 'comp-1',
        name: 'Hash Map Lookup O(N)',
        author: 'วรรณวิภา (Student A)',
        color: '#10b981',
        entryFunction: 'two_sum',
        code: `def two_sum(nums, target):
    """
    Student A: Single-pass Hash Map Dictionary
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`,
      },
      {
        id: 'comp-2',
        name: 'Brute Force Nested Loop O(N²)',
        author: 'ภานุมาศ (Student B)',
        color: '#f43f5e',
        entryFunction: 'two_sum',
        code: `def two_sum(nums, target):
    """
    Student B: Brute Force nested checks
    Time Complexity: O(N²)
    Space Complexity: O(1)
    """
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
`,
      },
    ],
    testCases: [
      {
        id: 'ts-1',
        label: 'Small Array (N=10)',
        description: 'Target near the middle',
        inputCode: '[2, 7, 11, 15, 3, 6, 8, 12, 1, 9], 14',
        sizeTag: 'S',
        n: 10,
      },
      {
        id: 'ts-2',
        label: 'Medium Array (N=1,000)',
        description: 'Target made of elements near the end',
        inputCode: 'list(range(1, 1001)), 1997',
        sizeTag: 'M',
        n: 1000,
      },
      {
        id: 'ts-3',
        label: 'Large Array (N=5,000)',
        description: 'Stresses brute force worst-case search',
        inputCode: 'list(range(1, 5001)), 9999',
        sizeTag: 'L',
        n: 5000,
      },
    ],
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence Calculation',
    titleTh: 'การคำนวณลำดับฟีโบนักชี (Fibonacci)',
    category: 'math',
    difficulty: 'Easy',
    description: 'Calculate the N-th Fibonacci number. Compares Iterative DP O(N), Memoized Recursion O(N), and Matrix Exponentiation / Binet formula.',
    descriptionTh: 'หาค่าลำดับฟีโบนักชีตัวที่ N เปรียบเทียบแบบวนซ้ำ (Iterative O(N)), แบบจำค่า (Memoization), และแบบเรียกซ้ำธรรมดา (Naive O(2^N))',
    competitors: [
      {
        id: 'comp-1',
        name: 'Iterative DP O(N) Space O(1)',
        author: 'ณัฐชนน (Student A)',
        color: '#10b981',
        entryFunction: 'fib',
        code: `def fib(n):
    """
    Student A: Iterative constant-space bottom-up DP
    Time: O(N)
    Space: O(1)
    """
    if n <= 0: return 0
    if n == 1: return 1
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
`,
      },
      {
        id: 'comp-2',
        name: 'Recursion with Memoization',
        author: 'อริสา (Student B)',
        color: '#3b82f6',
        entryFunction: 'fib',
        code: `def fib(n):
    """
    Student B: Top-Down Recursion with Memoization Cache
    Time: O(N)
    Space: O(N) Call Stack + Dict
    """
    memo = {0: 0, 1: 1}
    def _helper(k):
        if k in memo:
            return memo[k]
        memo[k] = _helper(k - 1) + _helper(k - 2)
        return memo[k]
    return _helper(n)
`,
      },
      {
        id: 'comp-3',
        name: 'Naive Recursion O(2^N)',
        author: 'พิชญะ (Student C)',
        color: '#ef4444',
        entryFunction: 'fib',
        code: `def fib(n):
    """
    Student C: Naive Branching Recursion
    WARNING: Explodes exponentially O(2^N)!
    Safe only for N <= 30
    """
    if n <= 0: return 0
    if n == 1: return 1
    # Cap recursion to prevent browser freeze on large test cases
    if n > 28:
        # Fallback to prevent crash
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b
    return fib(n - 1) + fib(n - 2)
`,
      },
    ],
    testCases: [
      {
        id: 'fib-s',
        label: 'Base Case (N=10)',
        description: 'Small calculation',
        inputCode: '10',
        sizeTag: 'S',
        n: 10,
      },
      {
        id: 'fib-m',
        label: 'Moderate (N=25)',
        description: 'Noticeable difference in naive recursion branching',
        inputCode: '25',
        sizeTag: 'M',
        n: 25,
      },
      {
        id: 'fib-l',
        label: 'Large (N=500)',
        description: 'Tests big integer arithmetic efficiency',
        inputCode: '500',
        sizeTag: 'L',
        n: 500,
      },
    ],
  },
  {
    id: 'primes',
    title: 'Prime Numbers Generation',
    titleTh: 'การหาจำนวนเฉพาะ (Prime Number Generator)',
    category: 'math',
    difficulty: 'Medium',
    description: 'Find all prime numbers up to N. Sieve of Eratosthenes O(N log log N) vs Trial Division O(N * sqrt(N)).',
    descriptionTh: 'ค้นหาจำนวนเฉพาะทั้งหมดตั้งแต่ 1 ถึง N เปรียบเทียบตะแกรงเอราทอสเทนีส (Sieve of Eratosthenes) กับวิธีหารทดสอบ (Trial Division)',
    competitors: [
      {
        id: 'comp-1',
        name: 'Sieve of Eratosthenes',
        author: 'ชยุต (Student A)',
        color: '#10b981',
        entryFunction: 'find_primes',
        code: `def find_primes(n):
    """
    Student A: Sieve of Eratosthenes
    Time: O(N log log N)
    Space: O(N) boolean array
    """
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
        
    return [i for i in range(2, n + 1) if is_prime[i]]
`,
      },
      {
        id: 'comp-2',
        name: 'Trial Division O(N√N)',
        author: 'ปิยะวัฒน์ (Student B)',
        color: '#f59e0b',
        entryFunction: 'find_primes',
        code: `def find_primes(n):
    """
    Student B: Trial division for every odd candidate
    Time: O(N * sqrt(N))
    Space: O(1) auxiliary
    """
    if n < 2:
        return []
    primes = []
    
    for num in range(2, n + 1):
        is_p = True
        limit = int(num ** 0.5) + 1
        for d in range(2, limit):
            if num % d == 0:
                is_p = False
                break
        if is_p:
            primes.append(num)
            
    return primes
`,
      },
    ],
    testCases: [
      {
        id: 'primes-s',
        label: 'Primes up to N=1,000',
        description: 'First 168 primes',
        inputCode: '1000',
        sizeTag: 'S',
        n: 1000,
      },
      {
        id: 'primes-m',
        label: 'Primes up to N=15,000',
        description: 'Medium scale showing Sieve dominance',
        inputCode: '15000',
        sizeTag: 'M',
        n: 15000,
      },
      {
        id: 'primes-l',
        label: 'Primes up to N=60,000',
        description: 'High workload comparison',
        inputCode: '60000',
        sizeTag: 'L',
        n: 60000,
      },
    ],
  },
  {
    id: 'string-duplicates',
    title: 'Character Frequency & Unique Count',
    titleTh: 'การนับความถี่ตัวอักษรและค้นหาตัวซ้ำ (Frequency Map)',
    category: 'string',
    difficulty: 'Easy',
    description: 'Count frequencies in a large string. Compares Dict / Counter O(N) vs Repeated list.count() O(N²).',
    descriptionTh: 'นับความถี่และตัวอักษรที่ซ้ำกัน เปรียบเทียบ Dictionary O(N) กับการเรียก .count() ในลูปซ้ำ O(N²)',
    competitors: [
      {
        id: 'comp-1',
        name: 'Dict / Counter O(N)',
        author: 'ศศิธร (Student A)',
        color: '#10b981',
        entryFunction: 'count_freq',
        code: `def count_freq(text):
    """
    Student A: Single pass dictionary hash map
    Time: O(N)
    Space: O(K) where K is unique character count
    """
    counts = {}
    for char in text:
        counts[char] = counts.get(char, 0) + 1
    return counts
`,
      },
      {
        id: 'comp-2',
        name: 'Naive text.count() in Loop O(N²)',
        author: 'เกรียงศักดิ์ (Student B)',
        color: '#ef4444',
        entryFunction: 'count_freq',
        code: `def count_freq(text):
    """
    Student B: Calling .count() inside loop
    Time: O(N²) because .count() scans the whole text repeatedly
    """
    counts = {}
    for char in set(text):
        counts[char] = text.count(char)
    return counts
`,
      },
    ],
    testCases: [
      {
        id: 'str-s',
        label: 'Short Text (Length: 200)',
        description: 'Paragraph of text',
        inputCode: '"The quick brown fox jumps over the lazy dog repeatedly until performance matters." * 3',
        sizeTag: 'S',
        n: 200,
      },
      {
        id: 'str-m',
        label: 'Medium Text (Length: 5,000)',
        description: 'Repeated sentence',
        inputCode: '"abcdefghijklmnopqrstuvwxyz0123456789" * 150',
        sizeTag: 'M',
        n: 5400,
      },
      {
        id: 'str-l',
        label: 'Large Text (Length: 25,000)',
        description: 'Large workload testing linear vs quadratic scan',
        inputCode: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit." * 450',
        sizeTag: 'L',
        n: 25000,
      },
    ],
  },
  {
    id: 'custom',
    title: 'Custom Student Arena (Create Your Own)',
    titleTh: 'สร้างโจทย์แข่งขันเอง (Custom Code Arena)',
    category: 'custom',
    difficulty: 'Medium',
    description: 'Write or paste any Python functions you and your classmate wrote to benchmark them head-to-head.',
    descriptionTh: 'ใส่โค้ดที่คุณกับเพื่อนร่วมชั้นเขียนขึ้นมาเอง เพื่อเปรียบเทียบว่าใครเร็วกว่าและประหยัดแรมกว่า',
    competitors: [
      {
        id: 'comp-1',
        name: 'Student 1 Algorithm',
        author: 'นักศึกษา 1 (Me)',
        color: '#10b981',
        entryFunction: 'my_solution',
        code: `def my_solution(arr):
    # เขียนโค้ดหรืออัลกอริทึมของตนเองที่นี่
    return sorted(arr)
`,
      },
      {
        id: 'comp-2',
        name: 'Student 2 Algorithm',
        author: 'นักศึกษา 2 (Friend)',
        color: '#3b82f6',
        entryFunction: 'my_solution',
        code: `def my_solution(arr):
    # เขียนโค้ดของเพื่อนเพื่อนำมาประลองกัน
    res = list(arr)
    res.sort()
    return res
`,
      },
    ],
    testCases: [
      {
        id: 'custom-1',
        label: 'Test Case 1',
        description: 'Default test array',
        inputCode: '[19, 4, 88, 3, 22, 105, 7, 50, 1]',
        sizeTag: 'M',
        n: 10,
      },
      {
        id: 'custom-2',
        label: 'Test Case 2 (Larger)',
        description: 'Larger array',
        inputCode: '[(x * 13) % 100 for x in range(200)]',
        sizeTag: 'L',
        n: 200,
      },
    ],
  },
];
