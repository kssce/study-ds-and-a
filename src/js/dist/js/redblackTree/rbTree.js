"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _treeNode = _interopRequireDefault(require("./treeNode"));

var _color = _interopRequireDefault(require("./color"));

var _createNode = _interopRequireDefault(require("./createNode"));

var _createLeafNode = _interopRequireDefault(require("./createLeafNode"));

var _iterator = _interopRequireDefault(require("./iterator"));

var _helper = require("./helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * constructor
 * Node of the red black tree
 * 1.Every node is either red or black
 * 2.Root and leaves are all black
 * 3.Every red node has black parent
 * 4.All simple paths from a node x to a descendant leaves of x has same black nodes
 */
var RbTree =
/*#__PURE__*/
function () {
  function RbTree() {
    _classCallCheck(this, RbTree);

    this.root = null;
  }
  /**
   * Complexity: O(1).
   *
   * param Node node Node.
   * return Node a copy of original node
   */


  _createClass(RbTree, [{
    key: "clone",
    value: function clone(node) {
      return new _treeNode["default"](node.key, node.value, node.left, node.right, node.color, node.parent);
    }
    /**
     * find value by node key
     */

  }, {
    key: "find",
    value: function find(input) {
      var key = (0, _helper.toNumber)(input);
      var node = this.root;

      while (node != null) {
        if (key < node.key) {
          node = node.left;
        } else if (key > node.key) {
          node = node.right;
        } else {
          return node.value;
        }
      }

      return null;
    }
  }, {
    key: "leftMostChild",
    value: function leftMostChild(node) {
      if ((0, _helper.isNilNode)(node)) {
        return null;
      }

      while (!(0, _helper.isNilNode)(node.left)) {
        node = node.left;
      }

      return node;
    }
  }, {
    key: "findNode",
    value: function findNode(key) {
      var node = this.root;

      while (node != null) {
        if (key < node.key) {
          node = node.left;
        } else if (key > node.key) {
          node = node.right;
        } else if (key === node.key) {
          return node;
        } else {
          return null;
        }
      }

      return null;
    }
  }, {
    key: "update",
    value: function update(key, value) {
      var node = this.findNode(key);
      node.value = value;
    }
    /**
     * Complexity: O(1).
     *       y                   x
     *      / \                 / \
     *     x  Gamma   ====>   alpha y
     *   /  \                      / \
     * alpha beta               beta Gamma
     * method
     * param Node node Node.
     * return Node
     */

  }, {
    key: "rotateRight",
    value: function rotateRight(node) {
      var y = node.left;

      if ((0, _helper.isNilNode)(y.right)) {
        node.left = (0, _createLeafNode["default"])(node);
      } else {
        node.left = y.right;
      }

      if (!(0, _helper.isNilNode)(y.right)) {
        y.right.parent = node;
      }

      y.parent = node.parent;

      if ((0, _helper.isNilNode)(node.parent)) {
        this.root = y;
      } else {
        if (node === node.parent.right) {
          node.parent.right = y;
        } else {
          node.parent.left = y;
        }
      }

      y.right = node;
      node.parent = y;
    }
    /**
     * Complexity: O(1).
     *       y                   x
     *      / \                 / \
     *     x  Gamma   <====   alpha y
     *   /  \                      / \
     * alpha beta               beta Gamma
     * method
     * param Node node Node.
     * return Node
     */

  }, {
    key: "rotateLeft",
    value: function rotateLeft(node) {
      var y = node.right; // console.log(y.left)

      if ((0, _helper.isNilNode)(y.left)) {
        node.right = (0, _createLeafNode["default"])(node);
      } else {
        node.right = y.left;
      }

      if (!(0, _helper.isNilNode)(y.left)) {
        y.left.parent = node;
      }

      y.parent = node.parent;

      if ((0, _helper.isNilNode)(node.parent)) {
        this.root = y;
      } else {
        if (node === node.parent.left) {
          node.parent.left = y;
        } else {
          node.parent.right = y;
        }
      }

      y.left = node;
      node.parent = y;
    }
    /**
     * param Node node Node.
     * Make the color of newly inserted nodes as RED and then perform standard BST insertion
     * If x is root, change color of node as BLACK (Black height +1).
     */

  }, {
    key: "insert",
    value: function insert(key, value) {
      var y = null;
      var x = this.root;
      var z = (0, _createNode["default"])(key, value);

      if (this.root == null) {
        this.root = z;
        z.color = _color["default"].BLACK;
        z.parent = null;
      } else {
        while (!(0, _helper.isNilNode)(x)) {
          y = x;

          if (z.key < x.key) {
            x = x.left;
          } else {
            x = x.right;
          }
        }

        z.parent = y; // current node parent is root

        if (z.key < y.key) {
          y.left = z;
        } else {
          y.right = z;
        } // y.right is now z


        z.left = (0, _createLeafNode["default"])(z);
        z.right = (0, _createLeafNode["default"])(z);
        z.color = _color["default"].RED;
        this.fixTree(z);
      }
    }
    /**
     * A method to fix RB TREE
     * when uncle is RED
     * Change color of parent and uncle as BLACK.
     * Color of grand parent as RED.
     * Change node = node’s grandparent, repeat steps 2 and 3 for new x.
     * ---------------------------------------------------------------
     * when uncle is BLACK
     * left_left_case
     * left_right_case
     * right_right_case
     * right_left_case
     */

  }, {
    key: "fixTree",
    value: function fixTree(node) {
      while (node.parent != null && node.parent.color === _color["default"].RED) {
        var uncle = null;

        if (node.parent === node.parent.parent.left) {
          uncle = node.parent.parent.right;

          if (uncle != null && uncle.color === _color["default"].RED) {
            node.parent.color = _color["default"].BLACK;
            uncle.color = _color["default"].BLACK;
            node.parent.parent.color = _color["default"].RED;
            node = node.parent.parent;
            continue;
          }

          if (node === node.parent.right) {
            // Double rotation needed
            node = node.parent;
            this.rotateLeft(node);
          }

          node.parent.color = _color["default"].BLACK;
          node.parent.parent.color = _color["default"].RED; // if the "else if" code hasn't executed, this
          // is a case where we only need a single rotation

          this.rotateRight(node.parent.parent);
        } else {
          uncle = node.parent.parent.left;

          if (uncle != null && uncle.color === _color["default"].RED) {
            node.parent.color = _color["default"].BLACK;
            uncle.color = _color["default"].BLACK;
            node.parent.parent.color = _color["default"].RED;
            node = node.parent.parent;
            continue;
          }

          if (node === node.parent.left) {
            // Double rotation needed
            node = node.parent;
            this.rotateRight(node);
          }

          node.parent.color = _color["default"].BLACK;
          node.parent.parent.color = _color["default"].RED; // if the "else if" code hasn't executed, this
          // is a case where we only need a single rotation

          this.rotateLeft(node.parent.parent);
        }
      }

      this.root.color = _color["default"].BLACK;
    }
    /**
     * return the height of a tree
     */

  }, {
    key: "findHeight",
    value: function findHeight(node) {
      if (node == null) {
        return -1;
      }

      var leftLen = this.findHeight(node.left);
      var rightLen = this.findHeight(node.right);

      if (leftLen > rightLen) {
        return leftLen + 1;
      }

      return rightLen + 1;
    }
    /**
     * print out current tree
     */

  }, {
    key: "print",
    value: function print() {
      var height = this.findHeight(this.root) + 1;
      this.printHelper(this.root, '__', height);
    }
  }, {
    key: "printHelper",
    value: function printHelper(node, indent, height) {
      // tree height
      var treeHeight = height;

      if (node == null) {
        return;
      }

      if (node === this.root) {
        console.log("".concat(node.key, " color: ").concat(node.color));
      }

      if (node.left != null) {
        var parentInfo = "( parent node ".concat(node.left.parent.key, ")");
        console.log("".concat(indent).concat(node.left.key, " color: ").concat(node.left.color, " ").concat(parentInfo));
      }

      if (node.right != null) {
        var _parentInfo = "( parent node ".concat(node.right.parent.key, ")");

        console.log("".concat(indent).concat(node.right.key, " color: ").concat(node.right.color, " ").concat(_parentInfo));
      }

      treeHeight -= 1;
      this.printHelper(node.left, indent + indent, treeHeight);
      this.printHelper(node.right, indent + indent, treeHeight);
    }
    /**
     * remove all nodes inside the tree
     */

  }, {
    key: "emptyTree",
    value: function emptyTree() {
      this.root = null;
    }
    /**
     * return the min node of a given tree
     */

  }, {
    key: "min",
    value: function min(node) {
      if (node == null || node === undefined) {
        return {};
      }

      while (!(0, _helper.isNilNode)(node.left)) {
        node = node.left;
      }

      return node;
    }
  }, {
    key: "minNode",
    value: function minNode() {
      var node = this.root;

      while (!(0, _helper.isNilNode)(node.left)) {
        node = node.left;
      }

      return node.getValue();
    }
  }, {
    key: "maxNode",
    value: function maxNode() {
      var node = this.root;

      while (!(0, _helper.isNilNode)(node.right)) {
        node = node.right;
      }

      return node.getValue();
    } // u 노드를 v 노드로 교체

  }, {
    key: "transplant",
    value: function transplant(u, v) {
      if (u.parent == null) {
        this.root = v;
      } else if (u === u.parent.left) {
        u.parent.left = v;
      } else {
        u.parent.right = v;
      }

      v.parent = u.parent;
    }
    /**
     * method
     * param Node node Node.
     * return Node
     */

  }, {
    key: "remove",
    value: function remove(key) {
      var z = this.findNode(key);

      if (z == null) {
        return;
      }

      var x;
      var y = z;
      var y_original_color = y.color;

      if ((0, _helper.isNilNode)(z.left)) {
        x = z.right;
        this.transplant(z, z.right);
      } else if ((0, _helper.isNilNode)(z.right)) {
        x = z.left;
        this.transplant(z, z.left);
      } else {
        y = this.min(z.right);
        y_original_color = y.color;
        x = y.right;

        if (y.parent === z) {
          x.parent = y;
        } else {
          this.transplant(y, y.right);
          y.right = z.right;
          y.right.parent = y;
        }

        this.transplant(z, y);
        y.left = z.left;
        y.left.parent = y;
        y.color = z.color;
      }

      if (y_original_color === _color["default"].BLACK) {
        this.removeFix(x);
      }
    }
    /**
     * a method to fix remove key
     */

  }, {
    key: "removeFix",
    value: function removeFix(node) {
      while (node !== this.root && node.color === _color["default"].BLACK) {
        if (node === node.parent.left) {
          var w = node.parent.right;

          if (w.color === _color["default"].RED) {
            w.color = _color["default"].BLACK;
            node.parent.color = _color["default"].RED;
            this.rotateLeft(node.parent);
            w = node.parent.right;
          }

          if (w.left.color === _color["default"].BLACK && w.right.color === _color["default"].BLACK) {
            w.color = _color["default"].RED;
            node = node.parent;
            continue;
          } else if (w.right.color === _color["default"].BLACK) {
            w.left.color = _color["default"].BLACK;
            w.color = _color["default"].RED;
            w = node.parent.right;
          }

          if (w.right.color === _color["default"].RED) {
            w.color = node.parent.color;
            node.parent.color = _color["default"].BLACK;
            w.right.color = _color["default"].BLACK;
            this.rotateLeft(node.parent);
            node = this.root;
          }
        } else {
          var _w = node.parent.left;

          if (_w.color === _color["default"].RED) {
            _w.color = _color["default"].BLACK;
            node.parent.color = _color["default"].RED;
            this.rotateRight(node.parent);
            _w = node.parent.left;
          }

          if (_w.right.color === _color["default"].BLACK && _w.left.color === _color["default"].BLACK) {
            _w.color = _color["default"].RED;
            node = node.parent;
          } else if (_w.left.color === _color["default"].BLACK) {
            _w.right.color = _color["default"].BLACK;
            _w.color = _color["default"].RED;
            this.rotateLeft(_w);
            _w = node.parent.left;
          }

          if (_w.left.color === _color["default"].RED) {
            _w.color = node.parent.color;
            node.parent.color = _color["default"].BLACK;
            _w.left.color = _color["default"].BLACK;
            this.rotateRight(node.parent);
            node = this.root;
          }
        }
      }

      node.color = _color["default"].BLACK;
    }
  }, {
    key: "inOrderSucc",
    value: function inOrderSucc(node) {
      if ((0, _helper.isNilNode)(node)) {
        return null;
      } // when a right child exist


      if (!(0, _helper.isNilNode)(node.right)) {
        return this.leftMostChild(node.right).getValue(); // Where no right child exists
      } else {
        // eslint-disable-line
        var curr = node;
        var p = node.parent; // if this node is not its parent's left child

        while (p != null && p.left !== curr) {
          curr = p;
          p = p.parent;
        } // when there is no successor


        if (p == null) {
          return null;
        }

        return p.getValue();
      }
    }
  }, {
    key: "toSortedArray",
    value: function toSortedArray() {
      var sortedArray = [];
      this.inOrder(this.root, sortedArray);
      return sortedArray;
    }
  }, {
    key: "toArrayPreOrder",
    value: function toArrayPreOrder() {
      var preOrderArray = [];
      this.preOrder(this.root, preOrderArray);
      return preOrderArray;
    }
  }, {
    key: "toArrayPostOrder",
    value: function toArrayPostOrder() {
      var postOrderArray = [];
      this.postOrder(this.root, postOrderArray);
      return postOrderArray;
    }
  }, {
    key: "inOrder",
    value: function inOrder(node, array) {
      if ((0, _helper.isNilNode)(node)) {
        return;
      }

      this.inOrder(node.left, array);
      array.push(node.getValue());
      this.inOrder(node.right, array);
    }
  }, {
    key: "preOrder",
    value: function preOrder(node, array) {
      if ((0, _helper.isNilNode)(node)) {
        return;
      }

      array.push(node.getValue());
      this.preOrder(node.left, array);
      this.preOrder(node.right, array);
    }
  }, {
    key: "postOrder",
    value: function postOrder(node, array) {
      if ((0, _helper.isNilNode)(node)) {
        return;
      }

      this.postOrder(node.left, array);
      this.postOrder(node.right, array);
      array.push(node.getValue());
    }
  }, {
    key: "createIterator",
    value: function createIterator() {
      return new _iterator["default"](this.root);
    }
  }]);

  return RbTree;
}();

var _default = RbTree;
exports["default"] = _default;