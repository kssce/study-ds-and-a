package datastructure.binarytree;


public interface SearchMethod<T extends Comparable<T>> {
    void search(NodeIF<T> root, CommandForNode<T> command);
}
