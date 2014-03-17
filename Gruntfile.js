/* global module */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    concat: {
      dist: {
        src: ['src/*.js'],
        dest: 'emberfire-latest.js',
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
          'emberfire-latest.min.js' : ['emberfire-latest.js']
        }
      }
    },

    jshint : {
      options: {
        jshintrc: '.jshintrc'
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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);

  grunt.registerTask('default', ['build']);
};
