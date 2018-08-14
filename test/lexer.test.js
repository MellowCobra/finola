import lexer from '../src/lexer.js'
import { Lexer } from '../src/lexer.js'
import { AssertionError } from 'assert'
import TokenType from '../src/tokenType.js'
import Token from '../src/token.js'

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

describe('Lexer::number', () => {
    let program
    let lexer

    beforeEach(() => {
        program = '2 + 42 + 3.14'
        lexer = new Lexer(program)
    })

    test('parses single digit numbers', () => {
        const number = lexer.number()

        expect(number).toEqual({
            type: 'NUMBER',
            lexeme: '2',
            line: 0,
            start: 0,
        })
    })

    test('parses multi-digit numbers', () => {
        lexer.start = 4

        const number = lexer.number()

        expect(number).toEqual({
            type: 'NUMBER',
            lexeme: '42',
            line: 0,
            start: 4,
        })
    })

    test('parses decimal numbers', () => {
        lexer.start = 9

        const number = lexer.number()

        expect(number).toEqual({
            type: 'NUMBER',
            lexeme: '3.14',
            line: 0,
            start: 9,
        })
    })

    test('after run, source pointer is at position after number', () => {
        lexer.start = 4
        lexer.number()

        expect(lexer.start).toBe(6)
    })
})

describe('Lexer::identifier', () => {
    let program
    let lexer

    beforeEach(() => {
        program = 'foo = _myFoo + foo1'
        lexer = new Lexer(program)
    })

    test('parses alphabetic identifier', () => {
        const id = lexer.identifier()

        expect(id).toEqual({
            type: 'IDENTIFIER',
            lexeme: 'foo',
            line: 0,
            start: 0,
        })
    })

    test('parses identifier with underscore', () => {
        lexer.start = 6

        const id = lexer.identifier()

        expect(id).toEqual({
            type: 'IDENTIFIER',
            lexeme: '_myFoo',
            line: 0,
            start: 6,
        })
    })

    test('parses identifier with number', () => {
        lexer.start = 15

        const id = lexer.identifier()

        expect(id).toEqual({
            type: 'IDENTIFIER',
            lexeme: 'foo1',
            line: 0,
            start: 15,
        })
    })
})

describe('Lexer::identifier (keywords)', () => {
    test('parses "return"', () => {
        const lexer = new Lexer('return')

        const keyword = lexer.identifier()

        expect(keyword).toEqual(new Token(TokenType.RETURN, 'return', 0, 0))
    })

    test('parses "let"', () => {
        const lexer = new Lexer('let')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'let',
            lexeme: 'let',
            line: 0,
            start: 0,
        })
    })

    test('parses "func"', () => {
        const lexer = new Lexer('func')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'func',
            lexeme: 'func',
            line: 0,
            start: 0,
        })
    })

    test('parses "module"', () => {
        const lexer = new Lexer('module')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'module',
            lexeme: 'module',
            line: 0,
            start: 0,
        })
    })

    test('parses "export"', () => {
        const lexer = new Lexer('export')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'export',
            lexeme: 'export',
            line: 0,
            start: 0,
        })
    })

    test('parses "import"', () => {
        const lexer = new Lexer('import')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'import',
            lexeme: 'import',
            line: 0,
            start: 0,
        })
    })

    test('parses "int"', () => {
        const lexer = new Lexer('int')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'int',
            lexeme: 'int',
            line: 0,
            start: 0,
        })
    })

    test('parses "long"', () => {
        const lexer = new Lexer('long')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'long',
            lexeme: 'long',
            line: 0,
            start: 0,
        })
    })

    test('parses "float"', () => {
        const lexer = new Lexer('float')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'float',
            lexeme: 'float',
            line: 0,
            start: 0,
        })
    })

    test('parses "double"', () => {
        const lexer = new Lexer('double')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'double',
            lexeme: 'double',
            line: 0,
            start: 0,
        })
    })

    test('parses "bool"', () => {
        const lexer = new Lexer('bool')

        const keyword = lexer.identifier()

        expect(keyword).toEqual({
            type: 'bool',
            lexeme: 'bool',
            line: 0,
            start: 0,
        })
    })
})

describe('Lexer::getNextToken', () => {
    const program =
        '_abcDEF12 123 true false + - * / % ^ ! . = == != > >= < <= ( ) { } [ ] : \0'
    const lexer = new Lexer(program)

    test('parses identifier', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: 'IDENTIFIER',
            lexeme: '_abcDEF12',
            line: 0,
            start: 0,
        })
    })

    test('parses number', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: 'NUMBER',
            lexeme: '123',
            line: 0,
            start: 10,
        })
    })

    test('parses "true"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: 'BOOLEAN',
            lexeme: 'true',
            line: 0,
            start: 14,
        })
    })

    test('parses "false"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: 'BOOLEAN',
            lexeme: 'false',
            line: 0,
            start: 19,
        })
    })

    test('parses "+"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '+',
            lexeme: '+',
            line: 0,
            start: 25,
        })
    })

    test('parses "-"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '-',
            lexeme: '-',
            line: 0,
            start: 27,
        })
    })

    test('parses "*"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '*',
            lexeme: '*',
            line: 0,
            start: 29,
        })
    })

    test('parses "/"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '/',
            lexeme: '/',
            line: 0,
            start: 31,
        })
    })

    test('parses "%"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '%',
            lexeme: '%',
            line: 0,
            start: 33,
        })
    })

    test('parses "^"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '^',
            lexeme: '^',
            line: 0,
            start: 35,
        })
    })

    test('parses "!"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '!',
            lexeme: '!',
            line: 0,
            start: 37,
        })
    })

    test('parses "."', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '.',
            lexeme: '.',
            line: 0,
            start: 39,
        })
    })

    test('parses "="', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '=',
            lexeme: '=',
            line: 0,
            start: 41,
        })
    })

    test('parses "=="', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '==',
            lexeme: '==',
            line: 0,
            start: 43,
        })
    })

    test('parses "!="', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '!=',
            lexeme: '!=',
            line: 0,
            start: 46,
        })
    })

    test('parses ">"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '>',
            lexeme: '>',
            line: 0,
            start: 49,
        })
    })

    test('parses ">="', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '>=',
            lexeme: '>=',
            line: 0,
            start: 51,
        })
    })

    test('parses "<"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '<',
            lexeme: '<',
            line: 0,
            start: 54,
        })
    })
    test('parses "<="', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '<=',
            lexeme: '<=',
            line: 0,
            start: 56,
        })
    })

    test('parses "("', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '(',
            lexeme: '(',
            line: 0,
            start: 59,
        })
    })

    test('parses ")"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: ')',
            lexeme: ')',
            line: 0,
            start: 61,
        })
    })

    test('parses "{"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '{',
            lexeme: '{',
            line: 0,
            start: 63,
        })
    })

    test('parses "}"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '}',
            lexeme: '}',
            line: 0,
            start: 65,
        })
    })

    test('parses "["', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '[',
            lexeme: '[',
            line: 0,
            start: 67,
        })
    })

    test('parses "]"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: ']',
            lexeme: ']',
            line: 0,
            start: 69,
        })
    })

    test('parses ":"', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: TokenType.COLON,
            lexeme: ':',
            line: 0,
            start: 71,
        })
    })

    test('parses nullchar', () => {
        const token = lexer.getNextToken()

        expect(token).toEqual({
            type: '\0',
            lexeme: '\0',
            line: 0,
            start: 73,
        })
    })
})

describe('Lexer::getAllTokens', () => {
    test('reads a simple expression', () => {
        const source = '1 + 2 - 3 * 5 / 8 ^ 13'
        const goal = [
            new Token(TokenType.NUM, '1', 0, 0),
            new Token(TokenType.PLUS, '+', 0, 2),
            new Token(TokenType.NUM, '2', 0, 4),
            new Token(TokenType.MINUS, '-', 0, 6),
            new Token(TokenType.NUM, '3', 0, 8),
            new Token(TokenType.STAR, '*', 0, 10),
            new Token(TokenType.NUM, '5', 0, 12),
            new Token(TokenType.SLASH, '/', 0, 14),
            new Token(TokenType.NUM, '8', 0, 16),
            new Token(TokenType.CARET, '^', 0, 18),
            new Token(TokenType.NUM, '13', 0, 20),
            new Token(TokenType.NULLCHAR, '\0', 0, 22),
        ]

        const lexer = new Lexer(source)

        const result = lexer.getAllTokens()

        expect(result).toEqual(goal)
    })

    test('reads variable declaration', () => {
        const source = 'let foo: int = 42'
        const goal = [
            new Token(TokenType.LET, 'let', 0, 0),
            new Token(TokenType.ID, 'foo', 0, 4),
            new Token(TokenType.COLON, ':', 0, 7),
            new Token(TokenType.INT_T, 'int', 0, 9),
            new Token(TokenType.EQ, '=', 0, 13),
            new Token(TokenType.NUM, '42', 0, 15),
            new Token(TokenType.NULLCHAR, '\0', 0, 17),
        ]

        const lexer = new Lexer(source)

        const result = lexer.getAllTokens()

        expect(result).toEqual(goal)
    })

    test('reads function declaration', () => {
        const source = 'func add(a, b) { a + b }'
        const goal = [
            new Token(TokenType.FUNC, 'func', 0, 0),
            new Token(TokenType.ID, 'add', 0, 5),
            new Token(TokenType.LPR, '(', 0, 8),
            new Token(TokenType.ID, 'a', 0, 9),
            new Token(TokenType.COMMA, ',', 0, 10),
            new Token(TokenType.ID, 'b', 0, 12),
            new Token(TokenType.RPR, ')', 0, 13),
            new Token(TokenType.LCB, '{', 0, 15),
            new Token(TokenType.ID, 'a', 0, 17),
            new Token(TokenType.PLUS, '+', 0, 19),
            new Token(TokenType.ID, 'b', 0, 21),
            new Token(TokenType.RCB, '}', 0, 23),
            new Token(TokenType.NULLCHAR, '\0', 0, 24),
        ]

        const lexer = new Lexer(source)

        const result = lexer.getAllTokens()

        expect(result).toEqual(goal)
    })

    test('reads a function export', () => {
        const source = 'export add'
        const goal = [
            new Token(TokenType.EXPORT, 'export', 0, 0),
            new Token(TokenType.ID, 'add', 0, 7),
            new Token(TokenType.NULLCHAR, '\0', 0, 10),
        ]

        const lexer = new Lexer(source)

        const result = lexer.getAllTokens()

        expect(result).toEqual(goal)
    })
})
