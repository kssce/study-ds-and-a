package datastructure.binarytree;

public interface NodeIF <T extends Comparable<T>> {
    public NodeIF<T> getLeft();
    public NodeIF<T> getRight();
    public T getData();
}