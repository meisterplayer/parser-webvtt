module.exports =
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _WebVtt = __webpack_require__(1);

var _WebVtt2 = _interopRequireDefault(_WebVtt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _WebVtt2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = __webpack_require__(2);

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebVtt = function (_Meister$ParserPlugin) {
    _inherits(WebVtt, _Meister$ParserPlugin);

    function WebVtt(config, meister) {
        _classCallCheck(this, WebVtt);

        var _this = _possibleConstructorReturn(this, (WebVtt.__proto__ || Object.getPrototypeOf(WebVtt)).call(this, config, meister));

        _this.currentCaptions = [];

        _this.on('requestCaptions', _this.onRequestCaptions.bind(_this));
        _this.on('itemUnloaded', _this.onItemUnloaded.bind(_this));
        return _this;
    }

    _createClass(WebVtt, [{
        key: 'onItemUnloaded',
        value: function onItemUnloaded() {
            // No need to remove tracks that aren't there
            if (!this.meister.playerPlugin || !(this.meister.playerPlugin.mediaElement instanceof HTMLMediaElement)) return;

            this.removeTracks();
        }
    }, {
        key: 'removeTracks',
        value: function removeTracks() {
            var tracks = this.meister.playerPlugin.mediaElement.textTracks;
            for (var i = 0; i < tracks.length; i += 1) {
                var track = tracks[i];
                track.default = false;
                track.mode = 'hidden';
            }
            var trackNodes = this.meister.playerPlugin.mediaElement.childNodes;
            for (var _i = 0; _i < trackNodes.length; _i += 1) {
                var child = trackNodes.item(_i);
                if (child.nodeName.toLowerCase() === 'track') {
                    this.meister.playerPlugin.mediaElement.removeChild(child);
                }
            }
        }
    }, {
        key: 'onRequestCaptions',
        value: function onRequestCaptions(captions) {
            if (captions.newLanguage === 'none') {
                this.removeTracks();
                return;
            }

            if (captions.type !== 'webvtt') return;

            // First remove all non default tracks
            this.removeTracks();

            var track = document.createElement('track');
            track.kind = 'captions';
            track.label = captions.title;
            track.scrlang = captions.lang;
            track.default = true;
            track.src = captions.src;

            track.addEventListener('load', function () {
                track.mode = 'showing';
            });

            this.meister.playerPlugin.mediaElement.appendChild(track);
        }
    }], [{
        key: 'pluginName',
        get: function get() {
            return 'WebVtt';
        }
    }, {
        key: 'pluginVersion',
        get: function get() {
            return _package2.default.version;
        }
    }]);

    return WebVtt;
}(Meister.ParserPlugin);

Meister.registerPlugin(WebVtt.pluginName, WebVtt);
Meister.registerPlugin('webvtt', WebVtt);

exports.default = WebVtt;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = {
	"name": "@meisterplayer/plugin-webvtt",
	"version": "5.1.0",
	"description": "Meister plugin for subtitles with webvtt",
	"main": "dist/WebVtt.js",
	"keywords": [
		"meister",
		"video",
		"plugin"
	],
	"repository": {
		"type": "git",
		"url": "https://github.com/meisterplayer/parser-webvtt.git"
	},
	"author": "Triple",
	"license": "Apache-2.0",
	"dependencies": {},
	"devDependencies": {
		"meister-js-dev": "^3.1.0",
		"meister-gulp-webpack-tasks": "^1.0.6",
		"babel-preset-es2015": "^6.24.0",
		"babel-preset-es2017": "^6.22.0",
		"gulp": "^3.9.1"
	}
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=WebVtt.js.map