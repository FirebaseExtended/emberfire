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
      options : {
        'bitwise' : true,
        'boss'    : true,
        'browser' : true,
        'curly'   : true,
        'devel'   : true,
        'eqnull'  : true,
        'globals' : {
          'DS'                  : false,
          'Ember'               : false,
          'Firebase'            : false,
          'EmberFire'           : true
        },
        'globalstrict' : true,
        'indent'       : 2,
        'latedef'      : true,
        'maxlen'       : 115,
        'noempty'      : true,
        'nonstandard'  : true,
        'undef'        : true,
        'unused'       : true,
        'trailing'     : true
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
