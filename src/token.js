export class Token {
    constructor(type, lexeme, line, start) {
        this.type = type
        this.lexeme = lexeme
        this.line = line
        this.start = start
    }
}
