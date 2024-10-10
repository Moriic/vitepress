# [算法模板]()

## 基础算法

### gcd / lcm

```java
public static int gcd(int a, int b){
    return b == 0 ? a : gcd(b, a % b);
}

public static int lcm(int a, int b){
    return a * b / gcd(a, b);
}
```

### 质数

- p 和 q 为两个正整数且互质，那么 px + qy 不能表示的最大正整数为 (p - 1) * (q - 1) -1
- 任何一个正整数都可以分解为有穷个质数幂之积，如 6936 = 2^3^ \* 3 \* 17^2^

```java
// 试除法
boolean isPrime(long x){
　　if (x < 2) return false;
　　for (long i = 2; i * i <= x; i++){
　　　　if (x % i == 0) return false;
　　}
　　return true;
}

// 分解质因数

```

### 二分

```java
public int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    return -1;
}

public int leftBinarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            right = mid - 1;   // 锁定左侧边界，收缩右侧边界
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    if (left < 0 || left >= nums.length)
        return -1;
    return nums[left] == target ? left : -1;
}

public int rightBinarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            left = mid + 1;  // 锁定右侧边界，收缩左侧边界
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid - 1;
        }
    }
    if (right < 0 || right >= nums.length) {
        return -1;
    }
    return nums[right] == target ? right : -1;
}


public static void main(String[] args) {
    int[] nums = new int[]{1, 2, 2, 2, 3};
    System.out.println(new TEMP().binarySearch(nums, 2));       // 2
    System.out.println(new TEMP().leftBinarySearch(nums, 2));   // 1
    System.out.println(new TEMP().rightBinarySearch(nums, 2));  // 3
}
```

### 位运算

```txt
求n的第k位数字: n >> k & 1
返回n的最后一位1：lowbit(n) = n & -n
```

### 双指针

## 数据结构

### 并查集

```java
class UF {
    // 连通分量个数
    private int count;
    // 存储一棵树
    private int[] parent;
    // 记录树的「重量」
    private int[] size;

    // n 为图中节点的个数
    public UF(int n) {
        this.count = n;
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    // 将节点 p 和节点 q 连通
    public void union(int p, int q) {
        int rootP = find(p);
        int rootQ = find(q);
        if (rootP == rootQ)
            return;

        // 小树接到大树下面，较平衡
        if (size[rootP] > size[rootQ]) {
            parent[rootQ] = rootP;
            size[rootP] += size[rootQ];
        } else {
            parent[rootP] = rootQ;
            size[rootQ] += size[rootP];
        }
        // 两个连通分量合并成一个连通分量
        count--;
    }

    // 判断节点 p 和节点 q 是否连通
    public boolean connected(int p, int q) {
        int rootP = find(p);
        int rootQ = find(q);
        return rootP == rootQ;
    }

    // 返回节点 x 的连通分量根节点
    private int find(int x) {
        while (parent[x] != x) {
            // 进行路径压缩
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    // 返回图中的连通分量个数
    public int count() {
        return count;
    }
}
```

## 图

### DFS & BFS

```java
int ans = 0;
boolean[][] visited;
int[][] dir = {
        {0, 1}, //right
        {1, 0}, //down
        {-1, 0}, //up
        {0, -1} //left
};

public void dfs(char[][] grid, int x, int y) {
    if (visited[x][y] || grid[x][y] == '0') {
        return;
    }
    visited[x][y] = true;
    for (int i = 0; i < 4; i++) {
        int nextX = x + dir[i][0];
        int nextY = y + dir[i][1];
        if (nextX >= 0 && nextX < grid.length && nextY >= 0 && nextY < grid[0].length && !visited[nextX][nextY] && grid[nextX][nextY] == '1') {
            dfs(grid, nextX, nextY);
        }
    }
}

public void bfs(char[][] grid, int x, int y) {
    visited[x][y] = true;
    LinkedList<int[]> queue = new LinkedList<>();
    queue.addLast(new int[]{x, y});
    while (!queue.isEmpty()) {
        int[] pop = queue.pop();
        for (int i = 0; i < 4; i++) {
            int nextX = pop[0] + dir[i][0];
            int nextY = pop[1] + dir[i][1];
            if (nextX >= 0 && nextX < grid.length && nextY >= 0 && nextY < grid[0].length && !visited[nextX][nextY] && grid[nextX][nextY] == '1') {
                queue.addLast(new int[]{nextX, nextY});
                visited[nextX][nextY] = true;
            }
        }
    }
}

public int numIslands(char[][] grid) {
    visited = new boolean[grid.length][grid[0].length];

    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (!visited[i][j] && grid[i][j] == '1') {
                ans++;
//                        dfs(grid, i, j);
                bfs(grid, i, j);
            }
        }
    }
    return ans;
}
```

### 拓扑排序

```java
public boolean canFinish(int numCourses, int[][] prerequisites) {
    int[] in = new int[numCourses];
    List<List<Integer>> map = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) {
        map.add(new ArrayList<>());
    }
    for (int[] prerequisite : prerequisites) {
        int v = prerequisite[0];
        int u = prerequisite[1];
        map.get(u).add(v);
        in[v]++;
    }
    int num = 0;
    Stack<Integer> stack = new Stack<>();
    for (int i = 0; i < numCourses; i++) {
        if (in[i] == 0) {
            stack.push(i);
            num++;
        }
    }
    while (!stack.isEmpty()) {
        int u = stack.pop();
        for (Integer v : map.get(u)) {
            in[v]--;
            if (in[v] == 0) {
                num++;
                stack.push(v);
            }
        }
    }
    return num == numCourses;
}
```

### Kruskal 最短路径算法

所谓最小生成树，就是图中若干边的集合（我们后文称这个集合为 `mst`，最小生成树的英文缩写），你要保证这些边：

1、包含图中的所有节点。

2、形成的结构是树结构（即不存在环）。

3、权重和最小。

有之前题目的铺垫，前两条其实可以很容易地利用 Union-Find 算法做到，关键在于第 3 点，如何保证得到的这棵生成树是权重和最小的。

这里就用到了贪心思路：

**将所有边按照权重从小到大排序，从权重最小的边开始遍历，如果这条边和 `mst` 中的其它边不会形成环，则这条边是最小生成树的一部分，将它加入 `mst` 集合；否则，这条边不是最小生成树的一部分，不要把它加入 `mst` 集合**。

```java
class Solution {
    int[] father;
    // 连通分量个数
    int count;

    int find(int u) {
        while (father[u] != u) {
            father[u] = father[father[u]];
            u = father[u];
        }
        return u;
    }

    void union(int u1, int u2) {
        u1 = find(u1);
        u2 = find(u2);
        if (u1 == u2) return;
        father[u1] = u2;
        count--;
    }

    boolean connected(int u1, int u2) {
        return father[u1] == u2;
    }

    public int minimumCost(int n, int[][] connections) {
        father = new int[n];
        for (int i = 0; i < n; i++) {
            father[i] = i;
        }
        count = n;

        Arrays.sort(connections, Comparator.comparingInt(a -> a[2]));
        int mst = 0;
        for (int[] connection : connections) {
            int u = connection[0] - 1;
            int v = connection[1] - 1;
            if (connected(u, v)) continue;
            union(u, v);
            mst += connection[2];
        }
        return count == 1 ? mst : -1;
    }
}
```

### Dijkstra 算法

计算 start 到其他节点的最短距离

```java
class State {
    // 图节点的 id
    int id;
    // 从 start 节点到当前节点的距离
    int distFromStart;

    State(int id, int distFromStart) {
        this.id = id;
        this.distFromStart = distFromStart;
    }
}

// 返回节点 from 到节点 to 之间的边的权重
int weight(int from, int to);

// 输入节点 s 返回 s 的相邻节点
List<Integer> adj(int s);

// 输入一幅图和一个起点 start，计算 start 到其他节点的最短距离
int[] dijkstra(int start, List<Integer>[] graph) {
    // 图中节点的个数
    int V = graph.length;
    // 记录最短路径的权重，你可以理解为 dp table
    // 定义：distTo[i] 的值就是节点 start 到达节点 i 的最短路径权重
    int[] distTo = new int[V];
    // 求最小值，所以 dp table 初始化为正无穷
    Arrays.fill(distTo, Integer.MAX_VALUE);
    // base case，start 到 start 的最短距离就是 0
    distTo[start] = 0;

    // 优先级队列，distFromStart 较小的排在前面
    Queue<State> pq = new PriorityQueue<>((a, b) -> {
        return a.distFromStart - b.distFromStart;
    });

    // 从起点 start 开始进行 BFS
    pq.offer(new State(start, 0));

    while (!pq.isEmpty()) {
        State curState = pq.poll();
        int curNodeID = curState.id;
        int curDistFromStart = curState.distFromStart;

        if (curDistFromStart > distTo[curNodeID]) {
            // 已经有一条更短的路径到达 curNode 节点了
            continue;
        }
        // 将 curNode 的相邻节点装入队列
        for (int nextNodeID : adj(curNodeID)) {
            // 看看从 curNode 达到 nextNode 的距离是否会更短
            int distToNextNode = distTo[curNodeID] + weight(curNodeID, nextNodeID);
            if (distTo[nextNodeID] > distToNextNode) {
                // 更新 dp table
                distTo[nextNodeID] = distToNextNode;
                // 将这个节点以及距离放入队列
                pq.offer(new State(nextNodeID, distToNextNode));
            }
        }
    }
    return distTo;
}
```

### floyd 算法

```java
// 算法结束后，d[a][b]表示a到b的最短距离
void floyd()
{
    // 初始化
    for (int i = 1; i <= n; i ++ )
        for (int j = 1; j <= n; j ++ )
            if (i == j) d[i][j] = 0;
   			else d[i][j] = INF;
    for (int k = 1; k <= n; k ++ )
        for (int i = 1; i <= n; i ++ )
            for (int j = 1; j <= n; j ++ )
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
}
```

## 最小栈

```java
class MinStack {
    private final Stack<Integer> stack;

    private final Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }

    public void push(int x) {
        stack.push(x);
        if (minStack.isEmpty() || x <= minStack.peek()) {
            minStack.push(x);
        }
    }

    public void pop() {
        if (stack.pop().equals(minStack.peek())) {
            minStack.pop();
        }
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }
}
```

## 排列组合问题(回溯)

两种解法：对于每个数字枚举选和不选(不适用去重和排列问题)，**对于每个位置枚举能选择的数字**

### 组合问题

- 对于组合问题，下一个数字不能和之前相同，因此需要从 start 开始
- 若数字可重复，start 与上一次回溯相同 i，不可重复为 i + 1
- 若需要去重(数组存在重复元素)，需要先排序数组，在回溯时添加判断 i > start && x [i] == x [i - 1]，第一个判断不是该层第一个节点，第二个判断去重

```java
List<List<Integer>> ans = new ArrayList<>();
List<Integer> path = new ArrayList<>();

void backTrace(int[] candidates, int target, int start, int sum) {
    if (target == sum) {
        ans.add(new ArrayList<>(path));
        return;
    }
    if (target < sum) {
        return;
    }
    for (int i = start; i < candidates.length; i++) {
        // 出现重复节点，同层的第一个节点已经被访问过，所以直接跳过
        if (i > start && candidates[i] == candidates[i - 1]) {
            continue;
        }
        path.add(candidates[i]);
        backTrace(candidates, target, i + 1, sum + candidates[i]);
        path.remove(path.size() - 1);
    }
}

public List<List<Integer>> combinationSum2(int[] candidates, int target) {
    Arrays.sort(candidates);
    backTrace(candidates, target, 0, 0);
    return new ArrayList<>(ans);
}
```

### 排列问题

- 对于排列问题，需要从 0 开始，并且添加判断
- 若需要去重(数组存在重复元素)，需要先排序数组，在回溯时添加判断 i > 0 && nums [i] == nums [i - 1] && ! visited [i - 1]，如果前一个“相同元素”未被使用过，则不使用当前元素。例如 [1 2 2'] 可能出现 [1 2 2'] 和 [1 2' 2] 的情况 如果“存在前一个相同元素” 且“未被使用过”, 当现有排列是 [1 2'] 时，原来的数组 [1 2 2'] 中 2’存在前一个元素 2 与其相同，且此时 2 未被访问过，跳过。[1 2 2'] 的排列先于 [1 2' 2] 存在，因此可以去除。

```java
List<List<Integer>> ans = new ArrayList<>();

List<Integer> path = new ArrayList<>();

boolean[] visited;

public List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);
    visited = new boolean[nums.length];
    backTrack(nums, 0);
    return ans;
}

public void backTrack(int[] nums, int cnt) {
    if (cnt == nums.length) {
        ans.add(new ArrayList<>(path));
        return;
    }

    for (int i = 0; i < nums.length; i++) {
        if (visited[i]) {
            continue;
        }
        if (i > 0 && nums[i] == nums[i - 1] && !visited[i - 1]) {
            continue;
        }
        visited[i] = true;
        path.add(nums[i]);
        backTrack(nums, cnt + 1);
        path.remove(path.size() - 1);
        visited[i] = false;
    }
}
```

### 子集问题(类似组合问题)

- 子集问题不需要选择完所有元素，因此每次回溯都会添加到结果集中
- 如需要去重，与组合问题一样添加判断 i > start && nums[i] == nums[i - 1]

```java
List<Integer> path = new ArrayList<>();

List<List<Integer>> ans = new ArrayList<>();

public List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);
    backTrack(nums, 0);
    return ans;
}

public void backTrack(int[] nums, int start) {
    ans.add(new ArrayList<>(path));

    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) {
            continue;
        }
        path.add(nums[i]);
        backTrack(nums, i + 1);
        path.remove(path.size() - 1);
    }
}
```

