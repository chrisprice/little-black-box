module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    browserify: {
      dist: {
        files: {
          'app/scripts/background.js': ['lib/background.js'],
          'app/scripts/options.js': ['lib/options.js'],
          'app/scripts/preview.js': ['lib/preview.js']
        }
      }
    },
    watch: {
      files: ['<%= jshint.all %>'],
      tasks: ['default'],
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'browserify']);

};