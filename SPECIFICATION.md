# Finola Programming Language Specification

Copyright (c) Grayson Dubois 2018

### v0.1 - July 2018

## Contents:

-   [Introduction](#introduction)
-   [Notation](#notation)
-   [Context Free Grammar](#context-free-grammar)
-   [Compiler Implementation](#compiler-implementation)
-   [Types](#types)
    -   [Value Types](#value-types)
    -   [Collection Types](#collection-types)
-   [Expressions](#expressions)
    -   [Arithmetic Expressions](#arithmetic-expressions)
    -   [Boolean Expressions](#boolean-expressions)
-   [Variables](#variables)

# Introduction

This is the first specification document for the Finola programming language.

**Finola** is a general-purpose language that compiles down to [Web Assembly](https://webassembly.org/) modules. This language has two main purposes:

1.  Provides a simple high-level language in which web assembly modules can be written.
2.  Serves as an exercise in programming language design and compiler development.

For these reasons, the author welcomes any and all aspiring language designers to follow him on the journey of discovery that is the creation of this compiler. The Finola language will start with a small set of data types and control flow instructions but will grow alongside the author's experience and knowledge of compiler design.

Since Finola will compile down to Web Assembly, many decisions on control structure and data type implementations will be driven by Web Assembly specification.

# Notation

_**TODO:**_ I've always just kind of used my own form for my CFGs, but I suppose I will need to read more into proper use of Extended Backus-Nuar Form (EBNF) for this specification.

# Context-Free Grammar

    module             → expression
                       ;

    expression         → logic_or
                       ;

    logic_or           → logic_and ( OR logic_and )*
                       ;

    logic_and          → equality ( AND equality )*
                       ;

    equality           → comparison ( ( NE | EE ) comparison )*
                       ;

    comparison         → factor ( ( GT | GE | LT | LE ) factor )*
                       ;

    factor             → term ( ( MINUS | PLUS ) term )*
                       ;

    term               → power ( ( STAR | SLASH ) power )*
                       ;

    power              → unary ( ( CARET ) unary )*
                       ;

    unary              → ( BANG | MINUS ) primary
                       | primary
                       ;

    primary            → NUMBER
                       | TRUE
                       | FALSE
                       | LPR expression RPR
                       | IDENTIFIER
                       ;

# Compiler Implementation

The compiler for Finola will be implemented in JavaScript, running on [Google's V8 engine](https://developers.google.com/v8/). It will be available through npm so that Node.js developers who wish to use Finola can do so as easily as other node packages.

As the language matures, it may be necessary to migrate to an implementation language that supports lower-level control. If that is the case, the Finola compiler can be written as a [Node.js Addon in C++](https://nodejs.org/api/addons.html), and [node-gyp](https://github.com/nodejs/node-gyp) may be utilized so that the compiler is still accessible to the Node.js community.

Future considerations for integration include a [Webpack](https://webpack.js.org/) [Loader](https://webpack.js.org/contribute/writing-a-loader/) that compiles Finola modules to web assembly and bundles them accordingly into Webpack projects.

# Types

Finola has two categories of data types: Value Types and Collection Types
Value types store the most basic unit of data, such as integers and floats.
Collection types store collections of data, such as structs and arrays.

## Value Types

Finola has four value types. They each correspond to a value type in Web Assembly.
The four value types are listed below with a short description and their corresponding wasm types.

-   `Int` (32-bit integer) - i32
-   `Long` (64-bit integer) - i64
-   `Float` (32-bit floating point number) - f32
-   `Double` (64-bit floating point number) - f64
-   `Boolean` (32-bit integer 0 or 1) - i32

Future versions of Finola will support signed and unsigned versions of these types.

## Collection Types

In this initial version of the language, the only collection type Finola will support is an `Array`.
Array will be implemented as Linear Memory in Web Assembly. Strings will later be added as a special case of Array collection (where each item in Linear Memory is interpreted as an `Int` representing a Unicode Character).

# Expressions

Finola follows the principle of "everything is an expression." Any statement that can be executed in the language will return a result.

In the initial version of Finola, the only expressions that are supported are

-   Arithmetic
-   Boolean
-   Variable Declaration
-   Variable Expressions

In later iterations, the following Expressions will be added:

-   If-Else
-   For
-   While
-   Cond
-   Case
-   Function Declaration
-   Function Call

## Arithmetic Expressions

The following arithmetic expressions are supported:

-   `Addition` ( 1 `+` 2 )
-   `Subtraction` ( 1 `-` 2 )
-   `Multiplication` ( 1 `*` 2 )
-   `Division` ( 1 `/` 2 )
-   `Power` ( 1 `^` 2 )
-   `Negation` ( `-` 1 )

The following types can be included in arithmetic expressions:

-   Int
-   Long
-   Float
-   Double

If values of different types are included in the same arithmetic expression, they are coerced to the proper types according to the following rules:

-   **integer** and **floating-point**: If integer and floating point types are in the same expression, any integer value(s) will be coerced to the equivalent floating point value(s) prior to the expression evaluation.
-   **32-bit** and **64-bit**: If 32-bit and 64-bit types are in the same expression, any 32-bit value(s) will be coerced to the equivalent 64-bit value(s) prior to the expression evaluation.

## Boolean Expressions

The following boolean expressions are supported:

-   `Logical Or`
    -   true `or` false
-   `Logical And`
    -   true `and` false
-   `Equality`
    -   1 `==` 1
    -   1 `!=` 2
-   `Comparison`
    -   1 `<` 2
    -   2 `>` 1
    -   3 `<=` 3
    -   4 `>=` 4

Numeric value types may appear in boolean expressions. In that case, the numeric values are coerced to a boolean value according to the following rule:

    Any numeric value equal to 0 is false. Everything else is true.
