/*globals module,process,require */
module.exports = function(config) {
   "use strict";

   var coverageDebug = false;

   config.set({
      basePath: '',
      frameworks: ['jasmine'],
      files: [
         "lib/observable.js",
         "lib/observable.spec.js"
      ],
      reporters: ['dots','coverage'],
      port: 9876,
      autoWatch: true,
      background:true,
      // - Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
      browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],
      singleRun: false,
      reportSlowerThan: 500,
      plugins: [
         'karma-firefox-launcher',
         'karma-chrome-launcher',
         'karma-jasmine',
         'karma-coverage'
      ],
      preprocessors: (process.env.TRAVIS || coverageDebug) ? { "lib/*.js": "coverage" } : {},
      coverageReporter: {
         type: "lcov",
         dir: ".coverage/"
      }
   });
};
