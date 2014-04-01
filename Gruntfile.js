module.exports = function(grunt) {

  var config = require('load-grunt-config')(grunt, {
    configPath: 'tasks/options',
    init: false
  });

  grunt.loadTasks('tasks');

  this.registerTask('default', ['build']);

  // Build a new version of the library
  this.registerTask('build', 'Builds a distributable version of <%= cfg.name %>', [
    'concat',
    'jshint',
    'uglify:dist'
  ]);

  // Run client-side tests on the command line.
  this.registerTask('test', 'Runs tests through the command line using PhantomJS', [
    'build',
    'mocha_phantomjs'
  ]);

  config.env = process.env;
  config.pkg = grunt.file.readJSON('package.json');

  // Load custom tasks from NPM
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Merge config into emberConfig, overwriting existing settings
  grunt.initConfig(config);

};