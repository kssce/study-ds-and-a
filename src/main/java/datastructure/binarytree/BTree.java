package datastructure.binarytree;


import lib.Constant;

// Binary Search Tree (Not BTree)
public class BTree<T extends Comparable<T>> {
    private Node<T> root;
    private SearchMethod strategyToSearch;
    private final int LEFT = Constant.LEFT, RIGHT = Constant.RIGHT, NONE = Constant.NONE;

    public void setSearchMethod (SearchMethod strategyToSearch) {
        this.strategyToSearch = strategyToSearch;
    }

    public BTree () { this.root = null; }

    public BTree (T data) { this.root = new Node<T>(data); }

    public boolean add (T data) {
        NodeInfo<T> nodeInfo = findNode(data);
        return linkNode(nodeInfo);
    }

    public void print () {
        CommandForNode commandPrint = new CommandPrint();
        this.strategyToSearch.search(this.root, commandPrint);
    }

    private NodeInfo<T> findNode (T data) {
        Node<T> parent = null;
        Node<T> node = getRoot(data);
        int DIRECTION = NONE;

        while(node != null) {
            T treeData = node.getData();

            if (treeData.compareTo(data) > 0) {
                parent = node;
                node = node.getLeft();
                DIRECTION = LEFT;

            } else if (treeData.compareTo(data) < 0) {
                parent = node;
                node = node.getRight();
                DIRECTION = RIGHT;

            } else {
                break;
            }
        }
        NodeInfo<T> nodeInfo = new NodeInfo<T>(parent, node, data, DIRECTION);
        return nodeInfo;
    }

    private Node<T> getRoot (T data) {
        if (this.root == null) {
            this.root = new Node<T>(data);
        }
        return this.root;
    }

    private boolean linkNode (NodeInfo<T> nodeInfo) {
        Node<T> parent = nodeInfo.getParentNode();
        T data = nodeInfo.getData();
        Node<T> node = new Node<T>(data);

        switch (nodeInfo.getDirection()) {
            case LEFT:
                parent.setLeft(node);
                return true;
            case RIGHT:
                parent.setRight(node);
                return true;
            default:
                return false;
        }
    }

    public void del (T data) {
        NodeInfo<T> nodeInfo = findNode(data);
        Node<T> node = nodeInfo.getNode();

        if (node == null) {
            System.out.println("삭제: " + data + "는(은) 트리에 존재하지 않습니다.");
            return;
        }

        linkNodeForDel(nodeInfo);
    }

    private void linkNodeForDel (NodeInfo<T> nodeInfo) {
        Node<T> node = nodeInfo.getNode();
        Node<T> parent = nodeInfo.getParentNode();
        int direction = nodeInfo.getDirection();

        Node<T> left = node.getLeft();
        Node<T> right = node.getRight();

        if (left != null && right != null) {
            Node<T> leftMaxNode = getLeftMax(left);

            if (parent != null) {
                parent.setNodeByDirection(direction, leftMaxNode);
            }
            if (left != leftMaxNode) {
                leftMaxNode.setLeft(left);
            }
            leftMaxNode.setRight(right);
            if (node == this.root) this.root = leftMaxNode;

        } else if (left != null) {
            if (parent != null) {
                parent.setNodeByDirection(direction, left);
            } else { // case root
                this.root = left;
            }

        } else if (right != null){
            if (parent != null) {
                parent.setNodeByDirection(direction, right);
            } else { // case root
                this.root = right;
            }

        } else {
            if (this.root == node) {
                this.root = null;

            } else if (direction == LEFT) {
                if (parent != null) {
                    parent.setLeft(null);
                }

            } else if (direction == RIGHT) {
                if (parent != null) {
                    parent.setRight(null);
                }

            }
        }
    }

    private Node<T> getLeftMax (Node<T> root) {
        Node<T> parent = root;
        Node<T> node = root;

        while (node.getRight() != null) {
            parent = node;
            node = node.getRight();
        }

        parent.setRight(node.getLeft());
        node.setLeft(null);
        return node;
    }
}
