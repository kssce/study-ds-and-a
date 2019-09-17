package datastructure.binarytree;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class NodeInfo<T extends Comparable<T>> {
    private Node<T> parentNode;
    private Node<T> node;
    private T data;
    private int direction;
}
