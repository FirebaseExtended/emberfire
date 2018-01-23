/*jshint node:true*/
module.exports = {
  "framework": "mocha",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "parallel": 4,
  "launch_in_ci": [
    "Chrome"
  ],
  "launch_in_dev": [
    "Chrome"
  ],
  browser_args: {
    Chrome: ['--headless', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=9222']
  }
};
