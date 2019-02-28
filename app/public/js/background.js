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
/******/ 	return __webpack_require__(__webpack_require__.s = 732);
/******/ })
/************************************************************************/
/******/ ({

/***/ 732:
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/_babel-loader@8.0.5@babel-loader/lib/index.js):\nSyntaxError: /Users/zhouminghui/WorkSpace/aelf-web-extension/app/web/background.js: Unexpected token (134:1)\n\n\u001b[0m \u001b[90m 132 | \u001b[39m}\u001b[0m\n\u001b[0m \u001b[90m 133 | \u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 134 | \u001b[39m\u001b[33m<<\u001b[39m\u001b[33m<<\u001b[39m\u001b[33m<<\u001b[39m\u001b[33m<\u001b[39m \u001b[33mHEAD\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m     | \u001b[39m \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 135 | \u001b[39m\u001b[33m===\u001b[39m\u001b[33m===\u001b[39m\u001b[33m=\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 136 | \u001b[39m\u001b[36mfunction\u001b[39m contractWhitelistCheck(options) {\u001b[0m\n\u001b[0m \u001b[90m 137 | \u001b[39m    \u001b[36mconst\u001b[39m {\u001b[0m\n    at Object.raise (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3831:17)\n    at Object.unexpected (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:5143:16)\n    at Object.jsxParseIdentifier (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3332:12)\n    at Object.jsxParseNamespacedName (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3342:23)\n    at Object.jsxParseElementName (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3353:21)\n    at Object.jsxParseOpeningElementAt (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3438:22)\n    at Object.jsxParseElementAt (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3471:33)\n    at Object.jsxParseElement (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3540:17)\n    at Object.parseExprAtom (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:3547:19)\n    at Object.parseExprSubscripts (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:5862:23)\n    at Object.parseMaybeUnary (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:5842:21)\n    at Object.parseExprOps (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:5729:23)\n    at Object.parseMaybeConditional (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:5702:23)\n    at Object.parseMaybeAssign (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:5647:21)\n    at Object.parseExpression (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:5595:23)\n    at Object.parseStatementContent (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:7378:23)\n    at Object.parseStatement (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:7243:17)\n    at Object.parseBlockOrModuleBlockBody (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:7810:25)\n    at Object.parseBlockBody (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:7797:10)\n    at Object.parseTopLevel (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:7181:10)\n    at Object.parse (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:8658:17)\n    at parse (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_parser@7.3.3@@babel/parser/lib/index.js:10658:38)\n    at parser (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_core@7.3.3@@babel/core/lib/transformation/normalize-file.js:170:34)\n    at normalizeFile (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_core@7.3.3@@babel/core/lib/transformation/normalize-file.js:138:11)\n    at runSync (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_core@7.3.3@@babel/core/lib/transformation/index.js:44:43)\n    at runAsync (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_core@7.3.3@@babel/core/lib/transformation/index.js:35:14)\n    at process.nextTick (/Users/zhouminghui/WorkSpace/aelf-web-extension/node_modules/_@babel_core@7.3.3@@babel/core/lib/transform.js:34:34)\n    at process._tickCallback (internal/process/next_tick.js:61:11)");

/***/ })

/******/ });