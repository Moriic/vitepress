## BeanFactory

### BeanFactory与ApplicationContext

- BeanFactory 是 ApplicationContext 父接口
- BeanFactory 是 Spring 的核心容器，ApplicationContext 实行组合了它的功能

![image-20230907145512134](https://raw.githubusercontent.com/Moriic/picture/main/image/1711358859_0.png)

getBean 由 BeanFactory 实现

```java
public Object getBean(String name) throws BeansException {
    this.assertBeanFactoryActive();
    return this.getBeanFactory().getBean(name);
}
```

