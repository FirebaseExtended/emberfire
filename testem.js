/*jshint node:true*/
module.exports = {
  "framework": "mocha",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launchers": {
    "ChromiumNoSandbox": {
      "command": "chromium-browser --user-data-dir=/tmp/testem.chromium --no-default-browser-check --no-first-run --ignore-certificate-errors --no-sandbox"
    }
  },
  "launch_in_ci": [
    "Firefox"
  ],
  "launch_in_dev": [
    "Chrome"
  ]
};
