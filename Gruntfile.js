/* global module */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    concat: {
      dist: {
        src: ['src/*.js'],
        dest: 'dist/emberfire.js',
        options: {
          banner: "'use strict';\n",
          process: function(src, filePath) {
            return '\n// Source: ' + filePath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        }
      }
    },

    uglify : {
      app : {
        files : {
          'dist/emberfire.min.js' : ['dist/emberfire.js']
        }
      }
    },

    jshint : {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['test.js']
      },
      all : ['src/*.js']
    },

    watch : {
      scripts : {
        files : 'src/*.js',
        tasks : ['default', 'notify:watch'],
        options : {
          interrupt : true
        }
      }
    },

    notify: {
      watch: {
        options: {
          title: 'Grunt Watch',
          message: 'Build Finished'
        }
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:8002/test/test.html',
          ]
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8002,
          base: '.',
          keepalive: false
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('test', ['connect', 'qunit']);

  grunt.registerTask('default', ['build', 'test']);
};
