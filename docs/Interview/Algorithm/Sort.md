# 排序算法

![sort](https://raw.githubusercontent.com/Moriic/picture/main/image/1727444994_0.png)

## 希尔排序

希尔排序是基于插入排序的以下两点性质而提出改进方法的，每次取出 gap 间隔的子数组进行插入排序，直到 gap = 1

例如数组：`[61, 109, 149, 111, 34, 2, 24, 119, 122, 27]`

1. gap = size / 2 = 5：小数组为 [61, 2]、[109, 24]、[149, 119]、[111, 122]、[34, 27]。**对小数组进行插入排序**：[2, 61]、[24, 109]、[119, 149]、[111, 122]、[27, 34]，结果为：`[2, 24, 119, 111, 27, 61, 109, 149, 122, 34]`。
2. gap = gap / 2 = 2：小数组为 [2, 119, 27, 109, 122]`、`[24, 111, 61, 149, 34]，排序后：[2, 27, 109, 119, 122]`、`[24, 34, 61, 111, 149]，结果为：`[2, 24, 27, 34, 109, 61, 119, 111, 122, 149]`
3. gap = 1：直接插入排序

```c
void shellsort(int arr[], int n) {
    int gap, i, j, temp;

    for(gap = n/2; gap > 0; gap /= 2){
   		for(i = gap; i < n; i++){
   			for(j = i - gap; j >= 0 && arr[j] > arr[j+gap]; j -= gap) {
                temp = arr[j];
                arr[j] = arr[j+gap];
                arr[j+gap] = temp;
            }
   		}    
    }
}
```

## 归并排序

```java
public class MergeSort implements IArraySort {

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        if (arr.length < 2) {
            return arr;
        }
        int middle = (int) Math.floor(arr.length / 2);

        int[] left = Arrays.copyOfRange(arr, 0, middle);
        int[] right = Arrays.copyOfRange(arr, middle, arr.length);

        return merge(sort(left), sort(right));
    }

    protected int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0;
        while (left.length > 0 && right.length > 0) {
            if (left[0] <= right[0]) {
                result[i++] = left[0];
                left = Arrays.copyOfRange(left, 1, left.length);
            } else {
                result[i++] = right[0];
                right = Arrays.copyOfRange(right, 1, right.length);
            }
        }

        while (left.length > 0) {
            result[i++] = left[0];
            left = Arrays.copyOfRange(left, 1, left.length);
        }

        while (right.length > 0) {
            result[i++] = right[0];
            right = Arrays.copyOfRange(right, 1, right.length);
        }

        return result;
    }

}
```

## 快速排序

```java
public class QuickSort implements IArraySort {

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        return quickSort(arr, 0, arr.length - 1);
    }

    private int[] quickSort(int[] arr, int left, int right) {
        if (left < right) {
            int partitionIndex = partition(arr, left, right);
            quickSort(arr, left, partitionIndex - 1);
            quickSort(arr, partitionIndex + 1, right);
        }
        return arr;
    }

    private int partition(int[] arr, int left, int right) {
        // 设定基准值（pivot）
        int pivot = left;
        int index = pivot + 1;
        for (int i = index; i <= right; i++) {
            if (arr[i] < arr[pivot]) {
                swap(arr, i, index);
                index++;
            }
        }
        swap(arr, pivot, index - 1);
        return index - 1;
    }

    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

最坏情况下：如果数组已经是**有序的**或**逆序的**，则每次选取的枢轴都无法有效分割数组。比如对一个已经升序排列的数组进行快速排序：`[1,2,3,4,5]`，递归树是一个斜树，需要 n - 1 次递归，因此最坏时间复杂度为 O(n^2);

## 堆排序

##### 算法步骤：

1. 创建一个堆 H[0……n-1]；
2. 把堆首（最大值）和堆尾互换；
3. 把堆的尺寸缩小 1，并调用 shift_down(0)，目的是把新的数组顶端数据调整到相应位置；
4. 重复步骤 2，直到堆的尺寸为 1。

```java
public class HeapSort implements IArraySort {

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        int len = arr.length;

        buildMaxHeap(arr, len);

        for (int i = len - 1; i > 0; i--) {
            swap(arr, 0, i);
            len--;
            heapify(arr, 0, len);
        }
        return arr;
    }

    private void buildMaxHeap(int[] arr, int len) {
        for (int i = (int) Math.floor(len / 2); i >= 0; i--) {
            heapify(arr, i, len);
        }
    }

    private void heapify(int[] arr, int i, int len) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int largest = i;

        if (left < len && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < len && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != i) {
            swap(arr, i, largest);
            heapify(arr, largest, len);
        }
    }

    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

}
```

