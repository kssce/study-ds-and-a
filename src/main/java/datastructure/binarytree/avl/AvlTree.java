package datastructure.binarytree.avl;


import datastructure.binarytree.CommandForNode;
import datastructure.binarytree.CommandPrint;
import datastructure.binarytree.SearchMethod;
import lib.Constant;

public class AvlTree<T extends Comparable<T>> {
    private NodeForAvl<T> root;
    private SearchMethod<T> strategyToSearch;
    private final int LEFT = Constant.LEFT, RIGHT = Constant.RIGHT, NONE = Constant.NONE;

    public void setSearchMethod (SearchMethod strategyToSearch) {
        this.strategyToSearch = strategyToSearch;
    }

    public AvlTree () { this.root = null; }

    public void insert (T data) {
        root = insertProc(root, data);
    }

    public void delete (T data) {
        root = deleteProc(root, data);
    }

    public void print () {
        CommandForNode commandPrint = new CommandPrint();
        this.strategyToSearch.search(root, commandPrint);
    }


    private NodeForAvl<T> insertProc (NodeForAvl<T> node, T data) {
        if (node == null) return new NodeForAvl<T>(data); // empty root or leaf node

        if (data.compareTo(node.getData()) > 0) { // data > node.data
            node.setRight(insertProc(node.getRight(), data));

        } else if (data.compareTo(node.getData()) < 0) { // node.data > data
            node.setLeft(insertProc(node.getLeft(), data));

        } else { // node.data == data
            System.out.println("같은 값은 삽입할 수 없습니다.");
            return node;
        }

        // 위 루틴이 끝나면 이전 자식 노드의 높이가 갱신된 상태. 따라서 최근 자식의 높이 중 큰 것을 취해 자신의 위치를(1) 더하여 높이 갱신
        node.setHeight(Math.max(height(node.getLeft()), height(node.getRight())) + 1);

        return rebalance(node);
    }

    private NodeForAvl<T> deleteProc (NodeForAvl<T> node, T data) {
        if (node == null) return node; // empty root or leaf node
        
        NodeForAvl<T> left = node.getLeft();
        NodeForAvl<T> right = node.getRight();
        NodeForAvl<T> temp = null;

        if (data.compareTo(node.getData()) < 0) { // data < node.data
            node.setLeft(deleteProc(left, data));

        } else if (data.compareTo(node.getData()) > 0) { // data > node.data
            node.setRight(deleteProc(right, data));

        } else { // found
            if (left == null && right == null) {
                System.out.println("Removing a leaf node.");
                return null;
            }

            if (left == null) {
                System.out.println("Removing the right child node");
                temp = node.getRight();
                node = null;
                return temp;

            } else if (right == null) {
                System.out.println("Removing the left child node");
                temp = node.getLeft();
                node = null;
                return temp;
            }

            System.out.println("Removing item with the children.");
            NodeForAvl<T> tempNode = getLeftMax(node.getLeft());
            node.setData(tempNode.getData());
            node.setLeft(deleteProc(node.getLeft(), tempNode.getData()));
        }

        node.setHeight(Math.max(height(node.getLeft()), height(node.getRight())) + 1);
        return rebalance(node);
    }

    private int height (NodeForAvl<T> node) {
        if (node == null) return 0;
        return node.getHeight();
    }

    private NodeForAvl<T> rebalance (NodeForAvl<T> node) {
        int balance = getBalance(node);

        if (balance > 1) {
            if (getBalance(node.getLeft()) < 0) { // LR
                System.out.println("LR: rotateLeft " + node.getLeft().getData());
                node.setLeft(rotateLeft(node.getLeft()));
            }
            System.out.println("LL: rotateRight " + node.getData());
            return rotateRight(node);
        }

        if (balance < -1) {
            if (getBalance(node.getRight()) > 0) { // RL
                System.out.println("RL: rotateRight " + node.getRight().getData());
                node.setRight(rotateRight(node.getRight()));
            }
            System.out.println("RR: rotateLeft " + node.getData());
            return rotateLeft(node);
        }

        return node;
    }

    private int getBalance (NodeForAvl<T> node) {
        if (node == null) return 0;
        return height(node.getLeft()) - height(node.getRight());
    }

    private NodeForAvl<T> rotateLeft(NodeForAvl<T> parentNode) {
        NodeForAvl<T> newParentNode = parentNode.getRight();
        NodeForAvl<T> nullNode = newParentNode.getLeft();

        newParentNode.setLeft(parentNode);
        parentNode.setRight(nullNode);

        parentNode.setHeight(Math.max(height(parentNode.getLeft()), height(parentNode.getRight())) + 1);
        newParentNode.setHeight(Math.max(height(newParentNode.getLeft()), height(newParentNode.getRight())) + 1);
        return newParentNode;
    }

    private NodeForAvl<T> rotateRight(NodeForAvl<T> parentNode) {
        NodeForAvl<T> newParentNode = parentNode.getLeft();
        NodeForAvl<T> nullNode = newParentNode.getRight();

        newParentNode.setRight(parentNode);
        parentNode.setLeft(nullNode);

        parentNode.setHeight(Math.max(height(parentNode.getLeft()), height(parentNode.getRight())) + 1);
        newParentNode.setHeight(Math.max(height(newParentNode.getLeft()), height(newParentNode.getRight())) + 1);
        return newParentNode;
    }

    private NodeForAvl<T> getLeftMax (NodeForAvl<T> root) {
        NodeForAvl<T> parent = root;
        NodeForAvl<T> node = root;

        while (node.getRight() != null) {
            parent = node;
            node = node.getRight();
        }

        parent.setRight(node.getLeft());
        node.setLeft(null);
        return node;
    }
}
