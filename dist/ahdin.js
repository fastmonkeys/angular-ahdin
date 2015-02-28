(function() {
  'use strict';
  angular
    .module('ahdin', []);
})();

(function() {
  'use strict';
  angular
    .module('ahdin')
    .factory('Ahdin', imageCompressor);

  function imageCompressor($q, $window, $rootScope, loadImage, blobUtil, QUALITY) {
    var VALID_FORMATS = ['jpeg', 'png'];
    var quality;

    return {
      compress: compress
    };

    function compress(params) {
      validateParams(params);
      quality = params.quality || QUALITY;
      function imageMetadataParsing(image) { return parseMetadata(image, params) }
      function scalingAndOrientation(args) { return scaleAndFixOrientation(args, params) }
      function qualityDecreasedDataUrl(image) { return decreaseImageQuality(image, params) }

      return blobToImage(params)
        .then(imageMetadataParsing)
        .then(scalingAndOrientation)
        .then(qualityDecreasedDataUrl)
        .then(dataUrlToBlob);
    }

    function blobToImage(params) {
      var imageDeferred = $q.defer();
      var image = new Image();
      image.onload = resolveImage;
      image.src = blobUtil.createObjectURL(params.sourceFile);
      return imageDeferred.promise;

      function resolveImage() {
        imageDeferred.resolve(image);
        $rootScope.$apply();
      }
    }

    function parseMetadata(image, params) {
      var deferred = $q.defer();
      loadImage.parseMetaData(params.sourceFile, resolveExtendedMetadata, params);
      return deferred.promise;

      function resolveExtendedMetadata(metaData) {
        deferred.resolve({metaData: metaData, image: image});
        $rootScope.$apply();
      }
    }

    function scaleAndFixOrientation(args, params) {
      var deferred = $q.defer();
      var options = parseOptions(args, params);
      loadImage(params.sourceFile, resolveDeferred, options);
      return deferred.promise;

      function resolveDeferred(image) {
        deferred.resolve(image);
        $rootScope.$apply();
      }
    }

    function parseOptions(args, params) {
      var image = args.image;
      var metaData = args.metaData;
      var maxHeight = (params && params.maxHeight) || image.height;
      var maxWidth = (params && params.maxWidth) || image.width;
      var options = {
        maxWidth: maxWidth,
        maxHeight: maxHeight
      };

      if (metaData.exif) {
        options.orientation = metaData.exif.get('Orientation');
      }

      return options;
    }

    function decreaseImageQuality(image, params) {
      var deferred = $q.defer();
      var format = (params && params.outputFormat) || 'jpeg';
      var mimeType = 'image/' + format;
      var canvas = $window.document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      var resolveData = {
        dataUrl: canvas.toDataURL(mimeType, quality),
        fileName: params.sourceFile.name
      };
      deferred.resolve(resolveData);
      return deferred.promise;
    }

    function dataUrlToBlob(args) {
      var deferred = $q.defer();
      var compressedBlob = blobUtil.dataURLToBlob(args.dataUrl);
      compressedBlob.then(addFileName);

      deferred.resolve(compressedBlob);
      $window.setTimeout(function() {
        $rootScope.$apply();
      });

      return deferred.promise;

      function addFileName(blob) {
        blob.name = args.fileName;
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

(function() {
  'use strict';
  angular
    .module('ahdin')
    .constant('blobUtil', blobUtil)
    .constant('loadImage', loadImage)
    .constant('QUALITY', 0.8);
})();
