package datastructure.binarytree;

public class CommandPrint implements CommandForNode {

    @Override
    public void action(NodeIF node) {
        System.out.println(node.getData());
    }
}
