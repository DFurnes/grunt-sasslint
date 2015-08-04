/*
 * grunt-sasslint
 * https://github.com/dfurnes/grunt-sasslint
 *
 * Copyright (c) 2015 David Furnes
 * Licensed under the MIT license.
 */

'use strict';

var Runner = require('sasslint').Runner;
var DefaultReporter = require('sasslint').DefaultReporter;
var findParentDir = require('find-parent-dir');
var map = require('lodash/collection/map');
var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

  var hadErrors = false;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('sasslint', 'Lint SCSS files with Sasslint.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      // Measure and output timing data.
      bench: false,

      // Override configuration file:
      config: false,
    });

    var reporter = new DefaultReporter();

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var expandedPaths = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      var source = expandedPaths.map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      });

      /**
       * Read configuration file.
       */
      var config = {};
      if(options.config) {
        var configFile = path.resolve(options.config);

        // The file must exist!
        if(!fs.existsSync(configFile)) {
          grunt.log.exit('Config file "' + configFile + '" not found.');
          process.exit(1);
        }

        config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      } else {
        var dir = findParentDir.sync(process.cwd(), '.sasslint.json');
        if(dir) {
          config = JSON.parse(fs.readFileSync(dir + '/.sasslint.json', 'utf-8'));
        } else {
          grunt.log.error('Config file not found.');
          process.exit(1);
        }
      }

      /**
       * Run Sasslint!
       */
      var runner = new Runner(config);
      var lints = map(source, function(sass) {
        return runner.lint(sass, options);
      });


      lints.forEach(function(lint, index) {
        if(lint.length) {
          reporter.report(lint, f.src[index]);
        }

        if(lint.length) hadErrors = true;
      });
    });

    reporter.summarize();

    if(hadErrors) {
      grunt.fail.warn('Sasslint found some style mistakes in your code.');
    }
  });

};
