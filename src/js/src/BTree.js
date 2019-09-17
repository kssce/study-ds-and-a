const M = 5;

function initChild (list) {
  const len = list.length;
  for (let i = 0 ; i < len ; i ++) {
    list[i] = null;
  }
}

function BTreeNode () {
  this._data = Array(M); // 노드 내의 데이터
  this._pChild = Array(M + 1); // 자식 노드
  this._isLeaf = true;
  this._dataCnt = 0;

  initChild(this._data);
  initChild(this._pChild);
}
BTreeNode.prototype.getData = function() {
  return this._data;
};
BTreeNode.prototype.getChild = function() {
  return this._pChild;
};
BTreeNode.prototype.isLeaf = function() {
  return this._isLeaf;
};
BTreeNode.prototype.getDataCnt = function() {
  return this._dataCnt;
};
BTreeNode.prototype.setData = function(data) {
  this._data = data;
};
BTreeNode.prototype.getChild = function(pChild) {
  this._pChild = pChild;
};
BTreeNode.prototype.isLeaf = function(isLeaf) {
  this._isLeaf = isLeaf;
};
BTreeNode.prototype.getDataCnt = function(dataCnt) {
  this._dataCnt = dataCnt;
};
console.log('!!!!!!!!!!!');