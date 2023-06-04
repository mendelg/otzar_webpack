//this is actually Map

export default class AVLTree {
    constructor() {
        this.root = new Map();
    }
    has(node, key) {
        return this.root.has(key.toString());
    }
    get(node, key) {
        return this.root.get(key.toString());
    }
    set(node, key, data) {
        this.root.set(key.toString(), data);
        return this;
    }
    insert(node, key, data) {
        this.root.set(key.toString(), data);
        return this.root;
    }

    delete(root, key) {
        this.root.delete(key.toString());
        return this;
    }
}