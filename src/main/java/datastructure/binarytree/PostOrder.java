package datastructure.binarytree;


public class PostOrder<T extends Comparable<T>> implements SearchMethod<T> {

    @Override
    public void search(NodeIF<T> node, CommandForNode<T> command) {
        if (node == null) return;

        search(node.getLeft(), command);

        search(node.getRight(), command);

        command.action(node);
    }
}
