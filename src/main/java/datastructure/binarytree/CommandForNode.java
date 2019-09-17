package datastructure.binarytree;

public interface CommandForNode <T extends Comparable<T>> {
    public void action(NodeIF<T> node);
}
