package datastructure.binarytree;



public class PreOrder<T extends Comparable<T>> implements SearchMethod<T> {

    @Override
    public void search(NodeIF<T> node, CommandForNode<T> command) {
        if (node == null) return;

        command.action(node);

        search(node.getLeft(), command);

        search(node.getRight(), command);
    }
}