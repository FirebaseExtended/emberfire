module.exports = {
    npm: {
      files: [
        { src: 'dist/*', dest: 'vendor/emberFire/' },
        { src: ['bower_components/firebase/*.js'], dest: 'vendor/firebase/', flatten: true, expand: true  }
      ]
    }
};
