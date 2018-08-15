import { Lexer } from './lexer'
import TokenType from './tokenType'
import Expression from './ast/Expression.ast.js'
import { NodeType } from './ast/Module.ast.js'
import Module from './ast/Module.ast.js'

export class Parser {
    constructor(arg) {
        arg = arg || ''
        this.init(arg)
    }

    init(arg) {
        this.lexer = typeof arg === 'string' ? new Lexer(arg) : arg

        this.currentToken = this.lexer.getNextToken()
    }

    // ** Parses the token stream and returns an AST
    // ** Main interface of the Parser
    parse() {
        return this.module()
    }

    //#region Parsing Functions

    module() {
        this.consume(TokenType.MODULE)
        const nodeList = this.node_list()
        return new Module.Module(nodeList)
    }

    node_list() {
        this.consume(TokenType.LCB)

        const nodes = []
        if (!this.match(this.currentToken, TokenType.RCB)) {
            nodes.push(this.node())

            while (!this.match(this.currentToken, TokenType.RCB)) {
                nodes.push(this.node())
            }
        }

        this.consume(TokenType.RCB)

        return nodes
    }

    node() {
        const funcDeclaration = this.function_decl()

        return new Module.Node(NodeType.FUNC, funcDeclaration)
    }

    function_decl() {
        this.consume(TokenType.FUNC)

        const name = this.currentToken
        this.consume(TokenType.ID)

        const parameters = this.param_list()
        const block = this.block()

        return new Expression.FunctionDeclaration(name, parameters, block)
    }

    param_list() {
        this.consume(TokenType.LPR)

        const parameters = []
        if (!this.match(this.currentToken, TokenType.RPR)) {
            parameters.push(this.param())

            while (this.match(this.currentToken, TokenType.COMMA)) {
                this.consume(TokenType.COMMA)
                parameters.push(this.param())
            }
        }

        this.consume(TokenType.RPR)
        return parameters
    }

    param() {
        const name = this.currentToken
        this.consume(TokenType.ID)
        this.consume(TokenType.COLON)

        const type = this.currentToken
        this.consume([
            TokenType.INT_T,
            TokenType.LONG_T,
            TokenType.FLOAT_T,
            TokenType.DOUBLE_T,
            TokenType.BOOL_T,
        ])

        return new Expression.VariableDeclaration(name, type, null)
    }

    block() {
        this.consume(TokenType.LCB)

        const expressions = []
        while (!this.match(this.currentToken, TokenType.RCB)) {
            expressions.push(this.expression())
        }

        this.consume(TokenType.RCB)

        return new Expression.Block(expressions)
    }

    expression() {
        if (this.match(this.currentToken, TokenType.LET)) {
            return this.var_decl()
        } else if (this.match(this.currentToken, TokenType.LCB)) {
            return this.block()
        } else if (this.match(this.currentToken, TokenType.FUNC)) {
            return this.function_decl()
        } else {
            return this.logic_or()
        }
    }

    var_decl() {
        this.consume(TokenType.LET)

        const id = this.currentToken
        this.consume(TokenType.ID)

        this.consume(TokenType.COLON)

        const type = this.currentToken
        this.consume([
            TokenType.INT_T,
            TokenType.LONG_T,
            TokenType.FLOAT_T,
            TokenType.DOUBLE_T,
            TokenType.BOOL_T,
        ])

        this.consume(TokenType.EQ)

        const value = this.expression

        return new Expression.VariableDeclaration(id, type, value)
    }

    logic_or() {
        let expr = this.logic_and()

        while (this.match(this.currentToken, TokenType.OR)) {
            const operator = this.currentToken
            this.consume(TokenType.OR)

            const right = this.logic_and()

            expr = new Expression.Logical(expr, operator, right)
        }

        return expr
    }

    logic_and() {
        let expr = this.equality()

        while (this.match(this.currentToken, TokenType.AND)) {
            const operator = this.currentToken
            this.consume(TokenType.AND)

            const right = this.equality()

            expr = new Expression.Logical(expr, operator, right)
        }

        return expr
    }

    equality() {
        let expr = this.comparison()

        while (this.match(this.currentToken, [TokenType.NE, TokenType.EE])) {
            const operator = this.currentToken
            this.consume([TokenType.NE, TokenType.EE])

            const right = this.comparison()

            expr = new Expression.Logical(expr, operator, right)
        }

        return expr
    }

    comparison() {
        let expr = this.factor()

        while (
            this.match(this.currentToken, [
                TokenType.GT,
                TokenType.GE,
                TokenType.LT,
                TokenType.LE,
            ])
        ) {
            const operator = this.currentToken
            this.consume([
                TokenType.GT,
                TokenType.GE,
                TokenType.LT,
                TokenType.LE,
            ])

            const right = this.factor()

            expr = new Expression.Logical(expr, operator, right)
        }

        return expr
    }

    factor() {
        let expr = this.term()

        while (
            this.match(this.currentToken, [TokenType.MINUS, TokenType.PLUS])
        ) {
            const operator = this.currentToken
            this.consume([TokenType.MINUS, TokenType.PLUS])

            const right = this.term()

            expr = new Expression.Binary(expr, operator, right)
        }

        return expr
    }

    term() {
        let expr = this.power()

        while (
            this.match(this.currentToken, [TokenType.STAR, TokenType.SLASH])
        ) {
            const operator = this.currentToken
            this.consume([TokenType.STAR, TokenType.SLASH])

            const right = this.power()

            expr = new Expression.Binary(expr, operator, right)
        }

        return expr
    }

    power() {
        let expr = this.unary()

        while (this.match(this.currentToken, TokenType.CARET)) {
            this.consume(TokenType.CARET)

            const exp = this.unary()

            expr = new Expression.Power(expr, exp)
        }

        return expr
    }

    unary() {
        if (this.match(this.currentToken, [TokenType.BANG, TokenType.MINUS])) {
            const operator = this.currentToken
            this.consume([TokenType.BANG, TokenType.MINUS])

            const operand = this.primary()
            return new Expression.Unary(operator, operand)
        }

        return this.primary()
    }

    //    primary            → NUM
    //                        | BOOL
    //                        | LPR expression RPR
    //                        | IDENTIFIER
    //                        ;
    primary() {
        if (this.match(this.currentToken, [TokenType.NUM, TokenType.BOOL])) {
            const literal = this.currentToken
            this.consume([TokenType.NUM, TokenType.BOOL])

            return new Expression.Literal(literal)
        } else if (this.match(this.currentToken, TokenType.ID)) {
            const id = this.currentToken
            this.consume(TokenType.ID)

            return new Expression.Variable(id)
        } else if (this.match(this.currentToken, TokenType.LPR)) {
            this.consume(TokenType.LPR)
            const expr = this.expression()
            this.consume(TokenType.RPR)

            return expr
        } else {
            throw new Error(
                `Expect expression at line ${this.currentToken.line}:${
                    this.currentToken.start
                }`
            )
        }
    }

    //#endregion Parsing Functions

    //#region Utility Functions

    match(token, types) {
        if (token == null || types == null) {
            return false
        }

        if (Array.isArray(types)) {
            return types.indexOf(token.type) !== -1
        }

        return token.type === types
    }

    consume(types) {
        const match = Array.isArray(types)
            ? types.indexOf(this.currentToken.type) !== -1
            : types === this.currentToken.type

        if (this.currentToken.type === TokenType.NULLCHAR) {
            if (match) {
                return
            } else {
                throw new Error(
                    `Unexpected end of input at ${this.currentToken.line}:${
                        this.currentToken.start
                    }`
                )
            }
        }

        if (match) {
            this.currentToken = this.lexer.getNextToken()
        } else {
            const acceptable = Array.isArray(types)
                ? types.join(' | ')
                : types.lexeme
            throw new Error(
                `Expected [ ${acceptable} ] but got "${
                    this.currentToken.type
                }" at ${this.currentToken.line}:${this.currentToken.start}`
            )
        }
    }

    //#endregion Utility Functions
}

export default new Parser()
