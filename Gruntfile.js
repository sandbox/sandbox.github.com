module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks('grunt-contrib-watch');

  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");

  grunt.initConfig({
    webpack: {
      options: webpackConfig,
      "build-dev": {
        devtool: "sourcemap",
        debug: true
      }
    },
    watch: {
      app: {
        files: ["src/**/*", "src/*"],
        tasks: ["webpack:build-dev"],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.registerTask("dev", ["webpack:build-dev", "watch:app"]);
};
