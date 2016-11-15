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
      freshdeskDist: {
        files: {
          "scripts/templates/handlebars/freshdeskHtmlTemplates.js": ["templates/freshdesk/*.hbs", "templates/*.hbs"]
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
      freshdeskDist: {
        src: [
          'scripts/vendor/handlebars/*.js',
          'scripts/templates/handlebars/freshdeskHtmlTemplates.js',
          'scripts/main.js',
          'scripts/config.js',
          'scripts/utils/utils.js',
          'scripts/utils/freshdeskUtils.js',
          'scripts/templates/templateShared.js',
          'scripts/templates/freshdeskTemplates.js',
          'scripts/main/freshdesk/*.js',
          'scripts/app-freshdesk.js'
        ],
        dest: 'dist/IoradWebWidget-Freshdesk.js'
      },
      uservoiceDist: {
        // TODO:
      }
    },

    // this section is used for our uglify action
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      freshdeskDist: {
        src: 'dist/IoradWebWidget-Freshdesk.js',
        dest: 'dist/IoradWebWidget-Freshdesk.min.js'
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

  //build all web widgets in dev mode.
  grunt.registerTask('build-dev-js', ['handlebars', 'concat']);

  //build all web widgets in release mode.
  grunt.registerTask('build-release-js', ['handlebars', 'concat', 'uglify']);

  // build iorad web widget for freshdesk knowledgebase.
  grunt.registerTask('build-freshdeskWebWidget-release', ['handlebars:freshdeskDist', 'concat:freshdeskDist', 'uglify:freshdeskDist']);

  // build iorad web widget for freshdesk knowledgebase.
  grunt.registerTask('build-freshdeskWebWidget-dev', ['handlebars:freshdeskDist', 'concat:freshdeskDist']);
};
