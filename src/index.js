/**
 *    //////                      //     ///
 *   //      ()  / ///     ///   //       //
 *   ////        //  //  //  //  //    /////
 *   //      //  //  //  //  //  //  //  ////
 *   //      //  //  //   ///    //   ///  //
 *
 * Compiler and REPL for the Finola Programming Language
 *
 * MIT License
 *  Copyright (c) 2018 Grayson M. Dubois
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

if (process.argv.length > 2) {
    // If the an argument is passed in, attempt to compile it as a source file

    const filename = process.argv[2]
    readFile(filename, compile)
} else {
    // If no extra argument passed in, start the REPL

    const greeting = `
   //////                      //     ///
   //      ()  / ///     ///   //       //
   ////        //  //  //  //  //    /////
   //      //  //  //  //  //  //  //  ////
   //      //  //  //   ///    //   ///  //

   Copyright (c) 2018 Grayson Dubois
`
    console.log(greeting)
    const readline = require('readline')
    const rl = readline.createInterface(process.stdin, process.stdout)
    rl.setPrompt('>> ')
    rl.prompt()
    rl.on('line', function(line) {
        console.log(line)
        if (line === 'quit') {
            rl.close()
        } else if (line === 'help') {
            console.log('type `quit` to exit')
        }
        rl.prompt()
    }).on('close', function() {
        process.exit(0)
    })
}

// Compile the input program
function compile(program) {
    console.log('program:', program)
}

// Read the contents of the input file and pass it to the callback
function readFile(filename, cb) {
    const fs = require('fs')
    fs.readFile(filename, { encoding: 'UTF-8' }, function(err, data) {
        if (err) {
            console.error(err)
            process.exit(1)
        } else {
            cb(data)
        }
    })
}
