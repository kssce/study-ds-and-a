package datastructure.binarytree;



public class InOrder<T extends Comparable<T>> implements SearchMethod<T> {

    @Override
    public void search(NodeIF<T> node, CommandForNode<T> command) {
        if (node == null) return;

        search(node.getLeft(), command);

        command.action(node);

        search(node.getRight(), command);
    }
}
