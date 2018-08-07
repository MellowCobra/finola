/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n *    //////                      //     ///\n *   //      ()  / ///     ///   //       //\n *   ////        //  //  //  //  //    /////\n *   //      //  //  //  //  //  //  //  ////\n *   //      //  //  //   ///    //   ///  //\n *\n * Compiler and REPL for the Finola Programming Language\n *\n * MIT License\n *  Copyright (c) 2018 Grayson M. Dubois\n *\n *  Permission is hereby granted, free of charge, to any person obtaining a copy\n *  of this software and associated documentation files (the \"Software\"), to deal\n *  in the Software without restriction, including without limitation the rights\n *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n *  copies of the Software, and to permit persons to whom the Software is\n *  furnished to do so, subject to the following conditions:\n *\n *  The above copyright notice and this permission notice shall be included in all\n *  copies or substantial portions of the Software.\n *\n *  THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n *  SOFTWARE.\n */\n\nif (process.argv.length > 2) {\n    // If the an argument is passed in, attempt to compile it as a source file\n\n    const filename = process.argv[2]\n    readFile(filename, compile)\n} else {\n    // If no extra argument passed in, start the REPL\n\n    const greeting = `\n   //////                      //     ///\n   //      ()  / ///     ///   //       //\n   ////        //  //  //  //  //    /////\n   //      //  //  //  //  //  //  //  ////\n   //      //  //  //   ///    //   ///  //\n\n   Copyright (c) 2018 Grayson Dubois\n`\n    console.log(greeting)\n    const readline = __webpack_require__(/*! readline */ \"readline\")\n    const rl = readline.createInterface(process.stdin, process.stdout)\n    rl.setPrompt('>> ')\n    rl.prompt()\n    rl.on('line', function(line) {\n        console.log(line)\n        if (line === 'quit') {\n            rl.close()\n        } else if (line === 'help') {\n            console.log('type `quit` to exit')\n        }\n        rl.prompt()\n    }).on('close', function() {\n        process.exit(0)\n    })\n}\n\n// Compile the input program\nfunction compile(program) {\n    console.log('program:', program)\n}\n\n// Read the contents of the input file and pass it to the callback\nfunction readFile(filename, cb) {\n    const fs = __webpack_require__(/*! fs */ \"fs\")\n    fs.readFile(filename, { encoding: 'UTF-8' }, function(err, data) {\n        if (err) {\n            console.error(err)\n            process.exit(1)\n        } else {\n            cb(data)\n        }\n    })\n}\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "readline":
/*!***************************!*\
  !*** external "readline" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"readline\");\n\n//# sourceURL=webpack:///external_%22readline%22?");

/***/ })

/******/ });