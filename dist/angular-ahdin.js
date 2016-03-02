(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("blob-util"), require("blueimp-load-image/js/load-image.all.min"));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "blob-util", "blueimp-load-image/js/load-image.all.min"], factory);
	else if(typeof exports === 'object')
		exports["ahdin"] = factory(require("angular"), require("blob-util"), require("blueimp-load-image/js/load-image.all.min"));
	else
		root["ahdin"] = factory(root["angular"], root["blobUtil"], root["loadImage"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var angular = __webpack_require__(1);
	var blobUtil = __webpack_require__(2);
	var loadImage = __webpack_require__(3);
	
	module.exports = angular
	  .module('ahdin', [])
	  .factory('Ahdin', imageCompressor);
	
	function imageCompressor($q, $window, $rootScope) {
	  var VALID_FORMATS = ['jpeg', 'png'];
	  var DEFAULT_QUALITY = 0.8;
	
	  return {
	    compress: compress
	  };
	
	  function compress(params) {
	    validateParams(params);
	
	    params.quality = params.quality || DEFAULT_QUALITY;
	    params.outputFormat = params.outputFormat || 'jpeg';
	
	    var deferred = $q.defer();
	    scaleAndFixOrientation(canvasToBlobAndResolve);
	    return deferred.promise;
	
	    function scaleAndFixOrientation(callback) {
	      getLoadImageOptions(function(options) {
	        loadImage(params.sourceFile, callback, options);
	      });
	    }
	
	    function getLoadImageOptions(callback) {
	      loadImage.parseMetaData(params.sourceFile, function(metaData) {
	        var options = {
	          canvas: true,
	          maxWidth: params.maxWidth,
	          maxHeight: params.maxHeight
	        };
	
	        if (metaData.exif) {
	          options.orientation = metaData.exif.get('Orientation');
	        }
	
	        callback(options);
	      });
	    }
	
	    function canvasToBlobAndResolve(canvas) {
	      canvasToBlob(canvas, applyAndResolve);
	    }
	
	    function canvasToBlob(canvas, callback) {
	      var mimeType = 'image/' + params.outputFormat;
	      var dataUrl = canvas.toDataURL(mimeType, params.quality);
	      blobUtil.dataURLToBlob(dataUrl).then(addFileName).then(callback);
	    }
	
	    function addFileName(blob) {
	      blob.name = params.sourceFile.name;
	      return blob;
	    }
	
	    function applyAndResolve(blob) {
	      $rootScope.$apply(resolve);
	
	      function resolve() {
	        deferred.resolve(blob);
	      }
	    }
	  }
	
	  function isPositiveNumber(value) {
	    return angular.isNumber(value) && value > 0;
	  }
	
	  function validateParams(params) {
	    params = params || {};
	    validateSourceFile(params.sourceFile);
	    validateMaxWidth(params.maxWidth);
	    validateMaxHeight(params.maxHeight);
	    validateOutputFormat(params.outputFormat);
	    validateQuality(params.quality);
	  }
	
	  function validateSourceFile(sourceFile) {
	    var sourceImageValid =
	      (sourceFile instanceof $window.File  || sourceFile instanceof $window.Blob);
	    if (!sourceImageValid) {
	      throw new Error('params.sourceFile must be instance of File');
	    }
	  }
	
	  function validateMaxWidth(maxWidth)  {
	    var isMaxWidthValid = maxWidth === undefined || isPositiveNumber(maxWidth);
	    if (!isMaxWidthValid) {
	      throw new Error('params.maxWidth must be a positive Number');
	    }
	  }
	
	  function validateMaxHeight(maxHeight) {
	    var isMaxHeightValid = maxHeight === undefined || isPositiveNumber(maxHeight);
	    if (!isMaxHeightValid) {
	      throw new Error('params.maxHeight must be a positive Number');
	    }
	  }
	
	  function validateOutputFormat(outputFormat) {
	    var isInValidFormats = VALID_FORMATS.indexOf(outputFormat) > -1;
	    var outputFormatValid = outputFormat ? isInValidFormats : true;
	    if (!outputFormatValid) {
	      throw new Error('params.outputFormat format must be one of [' + VALID_FORMATS + ']');
	    }
	  }
	
	  function validateQuality(quality)  {
	    var isQualityValid = quality === undefined || quality > 0 && quality <= 1;
	    if (!isQualityValid) {
	      throw new Error('params.quality must be a Number over 0 and less or equal to 1');
	    }
	  }
	}
	
	imageCompressor.$inject = ['$q', '$window', '$rootScope'];


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=angular-ahdin.js.map