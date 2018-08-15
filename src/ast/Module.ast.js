class Module {
    constructor(nodeList) {
        this.nodeList = nodeList || []
    }
}

export const NodeType = Object.freeze({
    FUNC: 'function',
    MEM: 'memory',
})

class Node {
    constructor(type, value) {
        this.type = type
        this.value = value
    }
}

export default {
    Module,
    Node,
}
