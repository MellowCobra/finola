export class Lexer {
    constructor(program) {
        // If there is no program, default to empty string
        program = program || ''
        this.init(program)
    }

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
        this.currentChar = this.text[this.start]
    }
}

export default new Lexer()
