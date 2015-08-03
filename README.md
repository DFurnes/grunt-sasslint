# grunt-sasslint

> Lint SCSS files with [Sasslint](https://github.com/DFurnes/sasslint).

:construction: __Under construction! Not ready for public use.__ :construction:

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sasslint --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sasslint');
```

## The "sasslint" task

### Overview
In your project's Gruntfile, add a section named `sasslint` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sasslint: {
    src: ['src/**/*.scss'],
    options: {
      // Measure and output timing data 
      bench: true,
      
      // Override configuration file
      config: '~/.sasslint.json'
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Not ready for public use!)_
