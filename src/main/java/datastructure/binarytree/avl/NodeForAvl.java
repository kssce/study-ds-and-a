package datastructure.binarytree.avl;

import datastructure.binarytree.Node;
import datastructure.binarytree.NodeIF;
import lombok.Getter;
import lombok.Setter;

import static lib.Constant.LEFT;
import static lib.Constant.RIGHT;

@Getter
@Setter
public class NodeForAvl<T extends Comparable<T>> implements NodeIF {
    private NodeForAvl<T> left;
    private NodeForAvl<T> right;
    T data;
    int height;

    public NodeForAvl(T data) {
        this.data = data;
        left = right = null;
        height = 1;
    }

    public void setNodeByDirection (int direction, NodeForAvl<T> node) {
        if (direction == LEFT) {
            left = node;
        } else if (direction == RIGHT) {
            right = node;
        }
    }
}
