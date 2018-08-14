// primary
class Literal {
    constructor(value) {
        this.value = value
    }
}

// primary
class Variable {
    constructor(identifier) {
        this.identifier = identifier
    }
}

// unary
class Unary {
    constructor(operator, operand) {
        this.operator = operator
        this.operand = operand
    }
}

// power
class Power {
    constructor(base, exp) {
        this.base = base
        this.exp = exp
    }
}

// factor, term
class Binary {
    constructor(left, operator, right) {
        this.left = left
        this.operator = operator
        this.right = right
    }
}

// logic_or, logic_and, equality, comparison
class Logical {
    constructor(left, operator, right) {
        this.left = left
        this.operator = operator
        this.right = right
    }
}

const Expression = {
    Binary,
    Literal,
    Logical,
    Power,
    Unary,
    Variable,
}

export default Expression
