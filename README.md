angular-ahdin
================
[![Circle CI](https://circleci.com/gh/fastmonkeys/angular-ahdin.svg?style=svg&circle-token=63549aa009011e699bd383e96b3f5e0de67b32ec)](https://circleci.com/gh/fastmonkeys/angular-ahdin)

Lossy compression module for AngularJS applications. It takes image `File`s or `Blob`s and compresses them to `Blob`s. It also fixes image orientation according to image's EXIF metadata.

Dependencies
------------
- AngularJS >=1.2.*
- [blob-util](https://github.com/nolanlawson/blob-util) (comes bundled with angular-ahdin)
- [load-image](https://github.com/blueimp/JavaScript-Load-Image) (comes bundled with angular-ahdin)

Installation
------------
```
$ bower install --save angular-ahdin
```

Setting up the module
---------------------
After installing the package make sure that the module `ahdin` is defined as your app's dependency.

```html
<script href="bower_components/angular-ahdin/dist/blob-util.min.js"></script>
<script href="bower_components/angular-ahdin/dist/load-image.all.min.js"></script>
<script href="bower_components/angular-ahdin/dist/ahdin.js"></script>

<script>
  angular.module('yourAwesomeApp', ['ahdin']);
</script>
```

How to use Ahdin
----------------
In order to to compress images, inject `Ahdin` to your module and call `compress()`. Function returns a promise that will be resolved with compressed image `Blob`.

```js
angular
  .module('yourAwesomeApp')
  .factory('SomeFactory', function(Ahdin) {
    function compressFile(file) {
      Ahdin.compress({
        sourceFile: file,
        maxWidth: 1000,
        outputFormat: 'png'
      }).then(function(compressedBlob) {
      	doSomething(compressedBlob);
      });
    }
});
```

###compress() parameter object
Parameter object that is passed to function `compress()` can have the following properties.

```js
var parameterObj = {
  // jpeg or png file that is instance of File or Blob
  sourceFile: file, // required
  
  // Maximum width of compressed photo in pixels
  maxWidth: 1000, // optional, defaults to original image width
  
  // Maximum height of compressed photo in pixels
  maxHeight: 1000, // optional, defaults to original image height
  
  // String defining compressed file mime type. Accepted values: 'jpeg' and 'png'
  outputFormat: 'png' // optional, default value 'jpeg'
  
  // Image quality when desired outputFormat is 'jpeg' or undefined. Take values 
  // over 0 and less or equal to 1. If outputFormat is 'png' this has no effect.
  quality: 0.9 // optional, defaults to 0.8
};

var compressionPromise = Ahdin.compress(parameterObj);
```
