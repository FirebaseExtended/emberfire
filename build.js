/* jshint node: true */
var transpiler = require('es6-module-transpiler');
var Container = transpiler.Container;
var FileResolver = transpiler.FileResolver;
var BundleFormatter = transpiler.formatters.bundle;

var container = new Container({
  resolvers: [ new FileResolver(['addon/']), new FileResolver(['vendor/legacy-shims']) ],
  formatter: new BundleFormatter()
});

container.getModule('emberfire');
container.write('dist/emberfire.js');
