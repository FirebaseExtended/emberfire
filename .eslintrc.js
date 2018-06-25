module.exports = {
    root: true,
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module'
    },
    plugins: [
      'ember'
    ],
    extends: [
      'eslint:recommended',
      'plugin:ember/recommended'
    ],
    env: {
      browser: true
    },
    rules: {
        "no-unused-vars": 0, // can't get the _ ignore working
        "no-extra-semi": 0,   // typescript spits these out on occasion
        "ember/avoid-leaking-state-in-ember-objects": 0, // using this, TODO override only for the one file
        "no-console": 0 // using this, TODO override only for the specific file
    },
    overrides: [
      // node files
      {
        files: [
          'index.js',
          'testem.js',
          'ember-cli-build.js',
          'config/**/*.js',
          'tests/dummy/config/**/*.js'
        ],
        excludedFiles: [
          'app/**',
          'addon/**'
        ],
        parserOptions: {
          sourceType: 'script',
          ecmaVersion: 2015
        },
        env: {
          browser: false,
          node: true
        },
        plugins: ['node'],
        rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
          // add your custom rules and overrides for node files here
        })
      },
  
      // test files
      {
        files: ['tests/**/*.js'],
        excludedFiles: ['tests/dummy/**/*.js'],
        env: {
          embertest: true
        }
      }
    ]
  };