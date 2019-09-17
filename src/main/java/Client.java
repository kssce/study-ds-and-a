import datastructure.application.NumConv;
import datastructure.binarytree.*;
import datastructure.binarytree.avl.AvlTree;

public class Client {
    public static void main(String[] args) {
//        printBTree();
//        System.out.println("\n===========================\n");
//        printAvlTree();

        System.out.println(NumConv.convert(11, 16));
    }

    private static void printBTree() {
        BTree<Integer> tree = new BTree<Integer>();
        tree.add(100);
        tree.add(90);
        tree.add(95);
        tree.add(200);
        tree.add(210);
        tree.add(150);
        tree.add(140);
        tree.add(130);
        tree.add(160);
        tree.add(170);
        tree.add(165);
        tree.add(163);
        tree.add(167);
        tree.del(100);
        tree.del(12);
        tree.del(160);


        System.out.println("\n----------- [ Binary ] ------------\n");
        tree.setSearchMethod(new InOrder<Integer>());
        tree.print();
    }

    private static void printAvlTree() {
        AvlTree<Integer> tree = new AvlTree<Integer>();
        tree.insert(100);
        tree.insert(90);
        tree.insert(95);
        tree.insert(200);
        tree.insert(210);
        tree.insert(150);
        tree.insert(140);
        tree.insert(130);
        tree.insert(160);
        tree.insert(170);
        tree.insert(165);
        tree.insert(163);
        tree.insert(167);
        tree.delete(100);
        tree.delete(12);
        tree.delete(160);


        System.out.println("\n----------- [ Avl ] ------------\n");
        tree.setSearchMethod(new InOrder<Integer>());
        tree.print();
    }
}
