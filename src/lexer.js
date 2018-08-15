import TokenType from './tokenType.js'
import Token from './token.js'

//#region Keywords
// Keywords is an object that acts as a dictionary where the keys are
// lexemes for finola keywords and the values are functions which generate
// the associated Token for said keywords. The default entry (stored at '_')
// is used for identifiers which do not match the other keywords
const Keywords = Object.freeze({
    true: (lexeme, line, start) =>
        new Token(TokenType.BOOL, lexeme, line, start),
    false: (lexeme, line, start) =>
        new Token(TokenType.BOOL, lexeme, line, start),
    return: (lexeme, line, start) =>
        new Token(TokenType.RETURN, lexeme, line, start),
    let: (lexeme, line, start) => new Token(TokenType.LET, lexeme, line, start),
    func: (lexeme, line, start) =>
        new Token(TokenType.FUNC, lexeme, line, start),
    module: (lexeme, line, start) =>
        new Token(TokenType.MODULE, lexeme, line, start),
    export: (lexeme, line, start) =>
        new Token(TokenType.EXPORT, lexeme, line, start),
    import: (lexeme, line, start) =>
        new Token(TokenType.IMPORT, lexeme, line, start),
    or: (lexeme, line, start) => new Token(TokenType.OR, lexeme, line, start),
    and: (lexeme, line, start) => new Token(TokenType.AND, lexeme, line, start),
    int: (lexeme, line, start) =>
        new Token(TokenType.INT_T, lexeme, line, start),
    long: (lexeme, line, start) =>
        new Token(TokenType.LONG_T, lexeme, line, start),
    float: (lexeme, line, start) =>
        new Token(TokenType.FLOAT_T, lexeme, line, start),
    double: (lexeme, line, start) =>
        new Token(TokenType.DOUBLE_T, lexeme, line, start),
    bool: (lexeme, line, start) =>
        new Token(TokenType.BOOL_T, lexeme, line, start),
    _: (lexeme, line, start) => new Token(TokenType.ID, lexeme, line, start),
})

//#endregion Keywords

//#region Lexer
export class Lexer {
    constructor(program) {
        // If there is no program, default to empty string
        program = program || ''
        this.init(program)
    }

    // Initialize the Lexer with a source program
    init(program) {
        // If program is not a string, then throw an error
        if (typeof program != 'string') {
            throw new Error('Argument to Lexer.init(...) must be a string')
        }

        // Append nullchar at the end of program if there is not one already
        program =
            program +
            (program.length === 0 || program[program.length - 1] !== '\0'
                ? '\0'
                : '')

        // Initialize Lexer props
        this.text = program
        this.line = 1
        this.start = 0
        this.position = 0
    }

    getAllTokens() {
        const tokens = []

        while (!this.isAtEnd()) {
            tokens.push(this.getNextToken())
        }

        tokens.push(new Token(TokenType.NULLCHAR, '\0', this.line, this.start))

        return tokens
    }

    // ** Get the next token from input
    // ** Main interface of the Lexer
    getNextToken() {
        // Skip whitespace characters
        if (this.isWhitespace(this.currentChar())) {
            this.skipWhitespace()
        }

        let currChar = this.currentChar()

        if (this.isAlphabetic(currChar)) {
            return this.identifier()
        } else if (this.isNumeric(currChar)) {
            return this.number()
        } else if (currChar === '=') {
            const start = this.start
            this.advance()

            if (this.currentChar() === '=') {
                this.advance()
                return new Token(TokenType.EE, '==', this.line, start)
            } else {
                return new Token(TokenType.EQ, '=', this.line, start)
            }
        } else if (currChar === '!') {
            const start = this.start
            this.advance()

            if (this.currentChar() === '=') {
                this.advance()
                return new Token(TokenType.NE, '!=', this.line, start)
            } else {
                return new Token(TokenType.BANG, '!', this.line, start)
            }
        } else if (currChar === '>') {
            const start = this.start
            this.advance()

            if (this.currentChar() === '=') {
                this.advance()
                return new Token(TokenType.GE, '>=', this.line, start)
            } else {
                return new Token(TokenType.GT, '>', this.line, start)
            }
        } else if (currChar === '<') {
            const start = this.start
            this.advance()

            if (this.currentChar() === '=') {
                this.advance()
                return new Token(TokenType.LE, '<=', this.line, start)
            } else {
                return new Token(TokenType.LT, '<', this.line, start)
            }
        } else if (currChar === '+') {
            const token = new Token(
                TokenType.PLUS,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '-') {
            const token = new Token(
                TokenType.MINUS,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '/') {
            const token = new Token(
                TokenType.SLASH,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '*') {
            const token = new Token(
                TokenType.STAR,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '.') {
            const token = new Token(
                TokenType.DOT,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '%') {
            const token = new Token(
                TokenType.MOD,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '^') {
            const token = new Token(
                TokenType.CARET,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '(') {
            const token = new Token(
                TokenType.LPR,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === ')') {
            const token = new Token(
                TokenType.RPR,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '{') {
            const token = new Token(
                TokenType.LCB,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '}') {
            const token = new Token(
                TokenType.RCB,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '[') {
            const token = new Token(
                TokenType.LSB,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === ']') {
            const token = new Token(
                TokenType.RSB,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === ':') {
            const token = new Token(
                TokenType.COLON,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === ',') {
            const token = new Token(
                TokenType.COMMA,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else if (currChar === '\0') {
            const token = new Token(
                TokenType.NULLCHAR,
                currChar,
                this.line,
                this.start
            )
            this.advance()
            return token
        } else {
            throw new Error(
                "Unrecognized token '" +
                    currChar +
                    "' at position " +
                    this.line +
                    ':' +
                    this.start
            )
        }
    }

    //#region Utility Function

    /* Advance the source pointer to the next character */
    advance() {
        if (this.isAtEnd()) {
            return this.text[this.position]
        }

        this.position++
        this.start++
        return this.text[this.position]
    }

    /* Return the current character pointed to by the source pointer */
    currentChar() {
        if (this.position < 0 || this.isAtEnd()) {
            return '\0'
        }

        return this.text[this.position]
    }

    /* Look one character ahead of the source pointer */
    peek() {
        if (this.isAtEnd()) {
            return null
        }

        return this.text[this.position + 1]
    }

    /* Determine if we are at the end of the input */
    isAtEnd() {
        return this.position >= this.text.length - 1
    }

    /* Determine if the character is a whitespace character */
    isWhitespace(char) {
        return ' \f\n\r\t\v\u00A0\u2028\u2029'.indexOf(char) !== -1
    }

    isNumeric(char) {
        return char >= '0' && char <= '9'
    }

    isAlphabetic(char) {
        return (
            char === '_' ||
            (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z')
        )
    }

    isAlphaNumeric(char) {
        return this.isNumeric(char) || this.isAlphabetic(char)
    }

    //#endregion Utility Functions

    //#region Lexing Functions

    /* Advance until the next non-whitespace character */
    skipWhitespace() {
        while (this.isWhitespace(this.currentChar())) {
            const currentChar = this.currentChar()

            this.advance()

            if (currentChar === '\n') {
                this.line++
                this.start = 0
            }
        }
    }

    /* Collect until non-alphanumeric characters and return ID token */
    identifier() {
        const characters = [this.currentChar()]
        const start = this.start

        this.advance()

        while (this.isAlphaNumeric(this.currentChar())) {
            characters.push(this.currentChar())
            this.advance()
        }

        const lexeme = characters.join('')

        // The Keywords object is a dictionary of keyword lexemes as keys
        // and functions to generate the associated token as values
        // If the current lexeme is a keyword, use its token generating function,
        // otherwise use the default ID token generator (stored in '_')
        const tokenGenerator = Keywords[lexeme] || Keywords._

        return tokenGenerator(lexeme, this.line, start)
    }

    /* Collect until non-numeric characters and return NUM token */
    number() {
        // NOTE: though integers and floats are lumped under a single NUM token type,
        // the semantics analyzer will handle the different types
        const characters = [this.currentChar()]
        const start = this.start

        this.advance()

        while (this.isNumeric(this.currentChar())) {
            characters.push(this.currentChar())
            this.advance()
        }

        if (this.currentChar() === '.') {
            characters.push(this.currentChar())
            this.advance()

            while (this.isNumeric(this.currentChar())) {
                characters.push(this.currentChar())
                this.advance()
            }
        }

        const lexeme = characters.join('')

        return new Token(TokenType.NUM, lexeme, this.line, start)
    }

    //#endregion
}
//#endregion Lexer

export default new Lexer()
