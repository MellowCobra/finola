import lexer from '../src/lexer.js'
import { Lexer } from '../src/lexer.js'

describe('Lexer::constructor', () => {
    test('default lexer instance is configured correctly', () => {
        expect(lexer).toEqual({
            text: '\0',
            line: 0,
            start: 0,
            currentChar: '\0',
        })
    })

    test('init(...) reinitializes lexer correctly', () => {
        lexer.init('1 + 2;')

        expect(lexer).toEqual({
            text: '1 + 2;\0',
            line: 0,
            start: 0,
            currentChar: '1',
        })
    })

    test('instantiating with `new` and no arguments defaults to correct settings', () => {
        const lexer = new Lexer()

        expect(lexer).toEqual({
            text: '\0',
            line: 0,
            start: 0,
            currentChar: '\0',
        })
    })

    test('instantiating with `new` and source string configures correctly', () => {
        const lexer = new Lexer('1 + 2;')

        expect(lexer).toEqual({
            text: '1 + 2;\0',
            line: 0,
            start: 0,
            currentChar: '1',
        })
    })

    test('instantiating with `new` and source string with nullchar configures correctly', () => {
        const lexer = new Lexer('1 + 2;\0')

        expect(lexer).toEqual({
            text: '1 + 2;\0',
            line: 0,
            start: 0,
            currentChar: '1',
        })
    })

    test('instantiating with bad args throws an error', () => {
        function instantiate() {
            new Lexer({ foo: 'bar' })
        }

        expect(instantiate).toThrowError()
    })
})
