/*
 * grunt-sasslint
 * https://github.com/dfurnes/grunt-sasslint
 *
 * Copyright (c) 2015 David Furnes
 * Licensed under the MIT license.
 */

'use strict';

var Runner = require('sasslint');
var DefaultReporter = require('sasslint/lib/Reporters/DefaultReporter');
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

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      });

      /**
       * Read configuration file.
       */
      var config = {};
      if(options.config) {
        var configFile = path.resolve(program.config);

        // The file must exist!
        if(!fs.existsSync(configFile)) {
          grunt.log.warn('Config file "' + configFile + '" not found.');
          process.exit(1);
        }

        config = fs.readFileSync(configFile, 'utf-8');
      } else {
        var dir = findParentDir.sync(path.dirname(f.orig.src), '.sasslint.json');
        if(dir) {
          config = JSON.parse(fs.readFileSync(dir + '/.sasslint.json', 'utf-8'));
        }
      }

      /**
       * Run Sasslint!
       */
      var runner = new Runner(config);
      var lints = map(src, function(sass) {
        return runner.lint(sass, options);
      });


      lints.forEach(function(lint) {
        var reporter = new DefaultReporter(lint, f.src[0]);
        reporter.report();

        if(lint.length) hadErrors = true;
      });

      if(hadErrors) {
        grunt.fail.warn('Sasslint found some style mistakes in your code.');
      }
    });
  });

};
