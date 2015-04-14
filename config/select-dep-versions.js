#!/usr/bin/env node

/* adapted from ef4/liquid-fire */

var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');
var spawn = require('child_process').spawn;

function maybeChangeVersion(channel) {
  if (typeof(channel) === 'undefined') {
    return RSVP.Promise.resolve('existing');
  }
  var bowerFile = path.join(__dirname, '..', 'bower.json');

  return run('git', ['checkout', bowerFile])
    .then(function() {
      var bowerJSON = require(bowerFile);
      fs.writeFileSync(bowerFile, JSON.stringify(rewrite(bowerJSON, channel), null, 2));

      return run('bower', ['install'], {cwd: path.join(__dirname, '..')});

    })
    .then(function () {
      return run('git', ['checkout', 'package.json'], {cwd: path.join(__dirname, '..')});
    })
    .then(function () {
      var npmVersion = channel;
      if (channel === 'canary' || channel === 'beta' ) {
        npmVersion = 'latest';
      }
      return run('npm', ['install', '--save-dev', 'ember-data@' + npmVersion], {cwd: path.join(__dirname, '..')});
    })
    .then(function() {
      return channel;
    });
}

function run(command, args, opts) {
  return new RSVP.Promise(function(resolve, reject) {
    var p = spawn(command, args, opts || {});
    var stderr = '';
    p.stderr.on('data', function(output) {
      stderr += output;
    });
    p.on('close', function(code){
      if (code !== 0) {
        console.log(stderr);
        reject(command + " exited with nonzero status");
      } else {
        resolve();
      }
    });
  });
}

function rewrite(bowerJSON, channel) {
  if (channel === 'existing') {
    return bowerJSON;
  }

  if (!bowerJSON.resolutions) {
    bowerJSON.resolutions = {};
  }

  if (bowerJSON.dependencies['ember-data']) {
    delete bowerJSON.dependencies['ember-data'];
  }

  bowerJSON.devDependencies['ember-data'] = "components/ember-data#" + channel;
  bowerJSON.resolutions['ember-data'] = channel;

  return bowerJSON;
}

function foundVersion(package) {
  var filename = path.join(__dirname, '..', 'bower_components', package, 'bower.json');
  if (fs.existsSync(filename)) {
    return require(filename).version;
  }
  filename = path.join(__dirname, '..', 'node_modules', package, 'package.json');
  if (fs.existsSync(filename)) {
    return require(filename).version;
  }
  return "none";
}

function logVersions(channel) {
  console.log("Based on " + channel + " I'm using:");
  var module = 'ember-data';
  console.log("  " + module + " " + foundVersion(module));
}

maybeChangeVersion(process.env.EMBER_DATA_VERSION).then(function(channel){
  logVersions(channel);
  process.exit(0);
}).catch(function(err){
  console.log(err);
  console.log(err.stack);
  process.exit(-1);
});
