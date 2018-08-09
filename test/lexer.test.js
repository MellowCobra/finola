import lexer from '../src/lexer.js'
import { Lexer } from '../src/lexer.js'

// Testing Lexer construction and initialization
describe('Lexer::constructor', () => {
    test('default lexer instance is configured correctly', () => {
        expect(lexer).toEqual({
            text: '\0',
            line: 0,
            start: 0,
        })
    })

    test('init(...) reinitializes lexer correctly', () => {
        lexer.init('1 + 2')

        expect(lexer).toEqual({
            text: '1 + 2\0',
            line: 0,
            start: 0,
        })
    })

    test('instantiating with `new` and empty string defaults to correct settings', () => {
        const lexer = new Lexer('')

        expect(lexer).toEqual({
            text: '\0',
            line: 0,
            start: 0,
        })
    })

    test('instantiating with `new` and no arguments defaults to correct settings', () => {
        const lexer = new Lexer()

        expect(lexer).toEqual({
            text: '\0',
            line: 0,
            start: 0,
        })
    })

    test('instantiating with `new` and source string configures correctly', () => {
        const lexer = new Lexer('1 + 2')

        expect(lexer).toEqual({
            text: '1 + 2\0',
            line: 0,
            start: 0,
        })
    })

    test('instantiating with `new` and source string with nullchar configures correctly', () => {
        const lexer = new Lexer('1 + 2\0')

        expect(lexer).toEqual({
            text: '1 + 2\0',
            line: 0,
            start: 0,
        })
    })

    test('instantiating with bad args throws an error', () => {
        function instantiate() {
            new Lexer({ foo: 'bar' }) // passing an object instead of a source string
        }

        expect(instantiate).toThrowError()
    })
})

describe('Lexer::advance', () => {
    let program
    let lexer

    beforeEach(() => {
        program = '1+2'
        lexer = new Lexer(program)
    })

    test('increments the source pointer and returns the next character', () => {
        const nextChar = lexer.advance()

        expect(lexer.start).toBe(1)
        expect(nextChar).toBe('+')
    })

    test('does not increment source pointer and returns nullchar when at the end of source', () => {
        lexer.start = 3 // The position of '\0' in the source text

        const nextChar = lexer.advance()

        expect(lexer.start).toBe(3)
        expect(nextChar).toBe('\0')
    })

    test('does not increment source pointer and returns nullchar when lexer is initialized with an empty string', () => {
        lexer = new Lexer('')

        const nextChar = lexer.advance()

        expect(lexer.start).toBe(0)
        expect(nextChar).toBe('\0')
    })
})

describe('Lexer::currentChar', () => {
    let program
    let lexer

    beforeEach(() => {
        program = '1+2'
        lexer = new Lexer(program)
    })

    test('returns the first character after lexer initialization', () => {
        expect(lexer.currentChar()).toBe('1')
    })

    test('returns second character after advance() is called once', () => {
        lexer.advance()

        expect(lexer.currentChar()).toBe('+')
    })

    test('returns nullchar if start is beyond the end of source text', () => {
        lexer.start = lexer.text.length

        expect(lexer.currentChar()).toBe('\0')
    })
})

describe('Lexer::peek', () => {
    let program
    let lexer

    beforeEach(() => {
        program = '1+2'
        lexer = new Lexer(program)
    })

    test('returns character immediately following source pointer', () => {
        expect(lexer.peek()).toBe('+')
    })

    test('returns null when source program is empty', () => {
        lexer = new Lexer('')

        console.log('this one')
        expect(lexer.peek()).toBeNull()
    })

    test('returns nullchar when source pointer is at last non-nullchar character', () => {
        lexer = new Lexer('1+2')
        lexer.start = 2

        expect(lexer.peek()).toBe('\0')
    })

    test('returns null when source pointer is on nullchar', () => {
        lexer = new Lexer('1+2')
        lexer.start = 3

        expect(lexer.peek()).toBeNull()
    })
})

describe('Lexer::isWhitespace', () => {
    test('returns true for space', () => {
        expect(lexer.isWhitespace(' ')).toBeTruthy()
    })

    test('returns true for tab', () => {
        expect(lexer.isWhitespace('\t')).toBeTruthy()
    })

    test('returns true for newline', () => {
        expect(lexer.isWhitespace('\n')).toBeTruthy()
    })

    test('returns false for alphabetic characters', () => {
        expect(lexer.isWhitespace('a')).toBeFalsy()
        expect(lexer.isWhitespace('A')).toBeFalsy()
        expect(lexer.isWhitespace('z')).toBeFalsy()
        expect(lexer.isWhitespace('Z')).toBeFalsy()
    })

    test('returns false for numeric characters', () => {
        expect(lexer.isWhitespace('0')).toBeFalsy()
        expect(lexer.isWhitespace('1')).toBeFalsy()
        expect(lexer.isWhitespace('9')).toBeFalsy()
    })
})

describe('Lexer::isNumeric', () => {
    test('returns true for numeric digits', () => {
        expect(lexer.isNumeric('0')).toBeTruthy()
        expect(lexer.isNumeric('1')).toBeTruthy()
        expect(lexer.isNumeric('9')).toBeTruthy()
    })

    test('returns false for alphabetic digits', () => {
        expect(lexer.isNumeric('a')).toBeFalsy()
        expect(lexer.isNumeric('A')).toBeFalsy()
        expect(lexer.isNumeric('z')).toBeFalsy()
        expect(lexer.isNumeric('Z')).toBeFalsy()
    })

    test('returns false for whitespace', () => {
        expect(lexer.isNumeric(' ')).toBeFalsy()
        expect(lexer.isNumeric('\t')).toBeFalsy()
        expect(lexer.isNumeric('\n')).toBeFalsy()
    })

    test('returns false for special characters', () => {
        expect(lexer.isNumeric('!')).toBeFalsy()
        expect(lexer.isNumeric('*')).toBeFalsy()
        expect(lexer.isNumeric('^')).toBeFalsy()
    })
})

describe('Lexer::isAlphabetic', () => {
    test('returns true for underscore "_"', () => {
        expect(lexer.isAlphabetic('_')).toBeTruthy()
    })

    test('returns true for alphabetic digits', () => {
        expect(lexer.isAlphabetic('a')).toBeTruthy()
        expect(lexer.isAlphabetic('A')).toBeTruthy()
        expect(lexer.isAlphabetic('z')).toBeTruthy()
        expect(lexer.isAlphabetic('Z')).toBeTruthy()
    })

    test('returns false for Alphabetic digits', () => {
        expect(lexer.isAlphabetic('0')).toBeFalsy()
        expect(lexer.isAlphabetic('1')).toBeFalsy()
        expect(lexer.isAlphabetic('9')).toBeFalsy()
    })

    test('returns false for whitespace', () => {
        expect(lexer.isAlphabetic(' ')).toBeFalsy()
        expect(lexer.isAlphabetic('\t')).toBeFalsy()
        expect(lexer.isAlphabetic('\n')).toBeFalsy()
    })

    test('returns false for special characters', () => {
        expect(lexer.isAlphabetic('!')).toBeFalsy()
        expect(lexer.isAlphabetic('*')).toBeFalsy()
        expect(lexer.isAlphabetic('^')).toBeFalsy()
    })
})

describe('Lexer::skipWhitespace', () => {
    let program
    let lexer

    beforeEach(() => {
        program = '1 + 2'
        lexer = new Lexer(program)
    })

    test('skips single space', () => {
        lexer.start = 1

        lexer.skipWhitespace()

        expect(lexer.start).toBe(2)
        expect(lexer.currentChar()).toBe('+')
    })

    test('skips single tab', () => {
        lexer = new Lexer('1\t+2')
        lexer.start = 1

        lexer.skipWhitespace()

        expect(lexer.start).toBe(2)
        expect(lexer.currentChar()).toBe('+')
    })

    test('skips single newline', () => {
        lexer = new Lexer(`1
+2`)
        lexer.start = 1

        lexer.skipWhitespace()

        expect(lexer.start).toBe(2)
        expect(lexer.currentChar()).toBe('+')
    })

    test('skips multiple whitespace characters', () => {
        lexer = new Lexer(`1    \t
  \t +2`)
        lexer.start = 1

        lexer.skipWhitespace()

        expect(lexer.start).toBe(11)
        expect(lexer.currentChar()).toBe('+')
    })
})

describe('Lexer::genNextToken', () => {
    let program
    let lexer

    beforeEach(() => {
        program = '1 + 2'
        lexer = new Lexer(program)
    })
})
