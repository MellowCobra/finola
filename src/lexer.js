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
        this.line = 0
        this.start = 0
    }

    // ** Get the next token from input
    // ** Main functionality of the Lexer
    getNextToken() {
        // Skip whitespace characters
        if (this.isWhitespace(this.currentChar())) {
            this.skipWhitespace()
        }

        let currChar = this.currentChar()

        if (this.isAlphabetic(currChar)) {
            return identifier()
        } else if (this.isNumeric(currChar)) {
            return number()
        } else if (currChar === '+') {
        } else if (currChar === '-') {
        } else if (currChar === '/') {
        } else if (currChar === '*') {
        } else if (currChar === '!') {
        } else if (currChar === '=') {
        } else if (currChar === '>') {
        } else if (currChar === '>') {
        } else if (currChar === '\0') {
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
            return this.text[this.start]
        }

        this.start++
        return this.text[this.start]
    }

    /* Return the current character pointed to by the source pointer */
    currentChar() {
        if (this.start < 0 || this.isAtEnd()) {
            return '\0'
        }

        return this.text[this.start]
    }

    /* Look one character ahead of the source pointer */
    peek() {
        if (this.isAtEnd()) {
            return null
        }

        return this.text[this.start + 1]
    }

    /* Determine if we are at the end of the input */
    isAtEnd() {
        return this.start >= this.text.length - 1
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
            this.advance()
        }
    }

    /* Collect until non-alphanumeric characters and return ID token */
    identifier() {}

    /* Collect until non-numeric characters and return NUM token */
    number() {
        // NOTE: though integers and floats are lumped under a single NUM token type,
        // the semantics analyzer will handle the different types
    }

    //#endregion
}

export default new Lexer()
