module.exports = {
  test: {
    src: [
      'vendor/loader.js',
      'test-mocha/tests/**/*.js'
    ],
    dest: 'tmp/tests.js'
  },
  dist: {
    src: ['src/*.js'],
    dest: 'dist/emberfire.js'
  }
};