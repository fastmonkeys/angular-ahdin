(function() {
  'use strict';
  angular
    .module('ahdin')
    .factory('Ahdin', imageCompressor);

  function imageCompressor($q, $window, $rootScope, loadImage, blobUtil, QUALITY) {
    var VALID_FORMATS = ['jpeg', 'png'];

    return {
      compress: compress
    };

    function compress(params) {
      validateParams(params);

      params.quality = params.quality || QUALITY;
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
})();
