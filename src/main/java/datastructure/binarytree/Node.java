package datastructure.binarytree;

import lib.Constant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Node <T extends Comparable<T>> implements NodeIF {
    private Node<T> left;
    private Node<T> right;
    T data;

    private final int LEFT = Constant.LEFT, RIGHT = Constant.RIGHT;

    public Node (T data) {
        this.data = data;
        left = right = null;
    }

    public void setNodeByDirection (int direction, Node<T> node) {
        if (direction == LEFT) {
            left = node;
        } else if (direction == RIGHT) {
            right = node;
        }
    }
}