module.exports = function(grunt) {
  grunt.initConfig({
    // this loads our packages for our grunt file
    pkg: grunt.file.readJSON('package.json'),

    // this section does our bower installs for us
    bower: {
      install: {
        options: {
          targetDir: './scripts/vendor',
          layout: 'byComponent',
          install: true,
          verbos: true,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },

    handlebars: {
      all: {
        files: {
          "scripts/templates.js": ["templates/**/*.hbs"]
        }
      }
    },

    // this section is used to join our js files together.
    concat: {
      options: {
        separator: ';',
        stripBannders: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("mm-dd-yyyy") %> */'
      },
      devSrc: {
        src: [
          'scripts/vendor/handlebars/*.js',
          'scripts/templates.js',
          'scripts/main.js',
          'scripts/app.js'
        ],
        dest: 'dist/IoradWebWidget.js'
      }
    },

    // this section is used for our uglify action
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'scripts/vendor/dist/IoradWebWidget.js',
        dest: 'scripts/vendor/dist/IoradWebWidget.min-<%= pkg.version %>.js'
      }
    }
  });

  //npm modules need for our task
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  //run bower for package install
  grunt.registerTask('install-bower-packages', ['bower']);

  //build vendor file src
  grunt.registerTask('merge-js-files', ['handlebars', 'concat']);

  //build min vendor file from above
  grunt.registerTask('min-js-file', ['handlebars', 'concat', 'uglify']);
};
