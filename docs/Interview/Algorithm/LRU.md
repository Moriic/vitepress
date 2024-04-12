# Algorithm

## LRU

LRU(Least Recently Used)：缓存淘汰策略，使用最近使用的数据

### 代码实现

```java
package temp;

import java.util.HashMap;
import java.util.LinkedHashMap;

public class Node {
    public int key, val;
    public Node next, prev;

    public Node(int k, int v) {
        key = k;
        val = v;
    }
}

class DoubleList {
    private Node head, tail;

    private int size;

    public DoubleList() {
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
        size = 0;
    }

    public void addLast(Node node) {
        node.prev = tail.prev;
        node.next = tail;
        node.prev.next = node;
        tail.prev = node;
        size++;
    }

    // 为什么使用双向链表，删除为O(1)
    public void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        size--;
    }

    public Node removeFirst() {
        if (head.next == tail) {
            return null;
        }
        Node first = head.next;
        remove(first);
        return first;
    }

    public int getSize() {
        return size;
    }
}

class LRUCache {
    // key -> Node(key,val)
    private HashMap<Integer, Node> map;
    // Node(k1,v1) <-> Node(k2,v2)
    private DoubleList cache;
    private int capacity;

    LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>();
        cache = new DoubleList();
    }

    // 将某个key提升为最近使用: remove + addLast
    private void makeRecently(int key) {
        Node node = map.get(key);
        cache.remove(node);
        cache.addLast(node);
    }

    private void addRecently(int key, int val) {
        Node node = new Node(key, val);
        cache.addLast(node);
        map.put(key, node);
    }

    // 为什么同时存储key,val, 删除需要得到key,双向映射
    private void deleteKey(int key) {
        Node node = map.get(key);
        cache.remove(node);
        map.remove(key);
    }


    // 删除最久未使用的元素
    private void removeLeastRecently() {
        Node node = cache.removeFirst();
        map.remove(node.key);
    }

    public int get(int key) {
        if (!map.containsKey(key)) {
            return -1;
        }
        makeRecently(key);
        return map.get(key).val;
    }

    public void put(int key, int val) {
        if (map.containsKey(key)) {
            deleteKey(key);
            addRecently(key, val);
            return;
        }
        if (capacity == cache.getSize()) {
            removeLeastRecently();
        }
        addRecently(key, val);
    }
}
```

```java
class LRUCache2 {
    LinkedHashMap<Integer, Integer> cache = new LinkedHashMap<>();
    int capacity;

    LRUCache2(int capacity) {
        this.capacity = capacity;
    }

    private void makeRecently(int key) {
        int val = cache.get(key);
        cache.remove(key);
        cache.put(key, val);
    }

    public int get(int key) {
        if (!cache.containsKey(key)) {
            return -1;
        }
        makeRecently(key);
        return cache.get(key);
    }

    public void put(int key, int val) {
        if (cache.containsKey(key)) {
            cache.put(key, val);
            makeRecently(key);
            return;
        }

        if (cache.size() >= capacity) {
            int oldestKey = cache.keySet().iterator().next();
            cache.remove(oldestKey);
        }
        cache.put(key, val);
    }
}
```

1. 为什么使用双向链表：需要保证删除操作的时间复杂度为 O(1)，双向链表可以直接获取前驱
2. 同时存储 key 和 val：删除最久未使用节点时，不仅要删除 Node，还要删除 map 的 key