'use strict';

describe('Ahdin factory', function() {
  var Ahdin;
  var $rootScope;
  var $window;
  var blobUtil;
  beforeEach(angular.mock.module('ahdin'));

  beforeEach(angular.mock.inject(
    function(_Ahdin_, _$rootScope_, _$window_, _blobUtil_) {
      Ahdin = _Ahdin_;
      $rootScope = _$rootScope_;
      $window = _$window_;
      blobUtil = _blobUtil_;
    }
  ));

  describe('compress function params validation', function() {
    var params;

    function imageCompressorTest() {
      return function() {
        Ahdin.compress(params);
      };
    }

    describe('with invalid parameters', function() {
      it('should throw an error when no parameters', function() {
        var error = new Error('params.sourceFile must be instance of File');
        expect(imageCompressorTest()).toThrow(error);
      });

      it('should throw an error when invalid source File', function() {
        var error = new Error('params.sourceFile must be instance of File');
        params = {sourceFile: 'not an image'};
        expect(imageCompressorTest()).toThrow(error);
      });

      it('should throw an error when maxHeight is zero or less', function() {
        var err = new Error('params.maxHeight must be a positive Number');
        params = {sourceFile: new $window.File([], 'file'), maxHeight: 0};
        expect(imageCompressorTest()).toThrow(err);
      });

      it('should throw an error when maxWidth is zero or less', function() {
        var err = new Error('params.maxWidth must be a positive Number');
        params = {sourceFile: new $window.File([], 'file'), maxWidth: 0};
        expect(imageCompressorTest()).toThrow(err);
      });

      it('should throw an error when file format is not valid', function() {
        var errorMsg = 'params.outputFormat format must be one of [jpeg,png]';
        var err = new Error(errorMsg);
        params = {
          sourceFile: new $window.File([], 'file'), quality: 1, scale: 1, outputFormat: 'jpg'
        };
        expect(imageCompressorTest()).toThrow(err);
      });

      it('should throw an error when quality is less than zero', function() {
        var err = new Error('params.quality must be a Number over 0 and less or equal to 1');
        params = {sourceFile: new $window.File([], 'file'), quality: 0};
        expect(imageCompressorTest()).toThrow(err);
      });

      it('should throw an error when quality is more than 1', function() {
        var err = new Error('params.quality must be a Number over 0 and less or equal to 1');
        params = {sourceFile: new $window.File([], 'file'), quality: 1.1};
        expect(imageCompressorTest()).toThrow(err);
      });
    });

    describe('with valid parameters', function() {
      it('should not throw error if valid source image', function() {
        params = {sourceFile: new $window.File([], 'file')};
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));
      });

      it('should not throw error if max width is given', function() {
        params = {sourceFile: new $window.File([], 'file'), maxWidth: 0.1};
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));

        params.maxWidth = 999;
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));
      });

      it('should not throw error if max height is given', function() {
        params = {sourceFile: new $window.File([], 'file'), maxHeight: 0.1};
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));

        params.maxHeight = 999;
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));
      });

      it('should not throw error if valid output format is given', function() {
        params = {sourceFile: new $window.File([], 'file'), outputFormat: 'jpeg'};
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));

        params.outputFormat = 'png';
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));
      });

      it('should not throw error if valid quality is given', function() {
        params = {sourceFile: new $window.File([], 'file'), quality: 0.1};
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));

        params.quality = 1;
        expect(imageCompressorTest()).not.toThrow(jasmine.any(Error));
      });
    });
  });

  describe('image compression', function() {
    var image;
    var imageBlob;
    var ORIGINAL_WIDTH;
    var ORIGINAL_HEIGHT;
    beforeAll(function(done) {
      image = new Image();
      image.onload = function() {
        ORIGINAL_WIDTH = image.width;
        ORIGINAL_HEIGHT = image.height;

        var canvas = $window.document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        blobUtil.dataURLToBlob(canvas.toDataURL('image/jpeg', 1)).then(function(blob) {
          imageBlob = blob;
          imageBlob.name = 'test-image.jpg';
          done();
        });
      };
      image.src = '/base/test/test-image.jpg';
    });

    it('should make image file smaller', function(done) {
      var originalSize = imageBlob.size;
      var imageCompression = Ahdin.compress({
        sourceFile: imageBlob
      });

      imageCompression.then(function(compressedFile) {
        expect(compressedFile.size < originalSize).toBe(true);
        done();
      });
    });

    it('should honor the given maximum width', function(done) {
      var compression = Ahdin.compress({
        sourceFile: imageBlob,
        maxWidth: 1000
      });

      compression.then(function(compressedFile) {
        var compressedImg = new Image();
        compressedImg.onload = function() {
          var aspectRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
          expect(compressedImg.width).toBe(1000);
          expect(compressedImg.height).toBe(compressedImg.width / aspectRatio);
          done();
        };
        compressedImg.src = blobUtil.createObjectURL(compressedFile);
      });
    });

    it('should honor the given maximum height', function(done) {
      var compression = Ahdin.compress({
        sourceFile: imageBlob,
        maxHeight: 300
      });

      compression.then(function(compressedFile) {
        var compressed = new Image();
        compressed.onload = function() {
          var aspectRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
          expect(compressed.height).toBe(300);
          expect(compressed.width).toBe(compressed.height * aspectRatio);
          done();
        };
        compressed.src = blobUtil.createObjectURL(compressedFile);
      });
    });

    it('should honor the height rule when it is stronger', function(done) {
      var compression = Ahdin.compress({
        sourceFile: imageBlob,
        maxWidth: ORIGINAL_WIDTH * 0.9,
        maxHeight: ORIGINAL_HEIGHT * 0.5
      });

      compression.then(function(compressedFile) {
        var compressed = new Image();
        compressed.onload = function() {
          var aspectRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
          expect(compressed.height).toBe(ORIGINAL_HEIGHT * 0.5);
          expect(compressed.width).not.toBe(ORIGINAL_WIDTH * 0.9);
          expect(compressed.width).toBe(compressed.height * aspectRatio);
          done();
        };
        compressed.src = blobUtil.createObjectURL(compressedFile);
      });
    });

    it('should honor the width rule when it is stronger', function(done) {
      var compression = Ahdin.compress({
        sourceFile: imageBlob,
        maxWidth: ORIGINAL_WIDTH * 0.1,
        maxHeight: ORIGINAL_HEIGHT * 0.9
      });

      compression.then(function(compressedFile) {
        var compressed = new Image();
        compressed.onload = function() {
          var aspectRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
          expect(compressed.width).toBe(ORIGINAL_WIDTH * 0.1);
          expect(compressed.height).not.toBe(ORIGINAL_HEIGHT * 0.9);
          expect(compressed.height).toBe(compressed.width / aspectRatio);
          done();
        };
        compressed.src = blobUtil.createObjectURL(compressedFile);
      });
    });

    it('should preserve file name', function(done) {
      var compression = Ahdin.compress({
        sourceFile: imageBlob
      });
      compression.then(function(compressedFile) {
        expect(compressedFile.name).toBe(imageBlob.name);
        done();
      });
    });
  });
});
