module.exports = function (grunt) {
  grunt.initConfig({
    // loads grunt packages.
    pkg: grunt.file.readJSON("package.json"),

    // this section does our bower installs for us
    bower: {
      install: {
        options: {
          targetDir: "./scripts/vendor",
          layout: "byComponent",
          install: true,
          verbos: true,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: "JST"
        },
        files: {
          "scripts/templates/compiledTemplates.js": ["templates/*.hbs"]
        }
      }
    },
    
    // this section is used to join our js files together.
    concat: {
      options: {
        separator: ";",
        stripBannders: true,
        banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
          "<%= grunt.template.today('mm-dd-yyyy') %> */"
      },
      devSrc: {
        src: [
          "scripts/init.js",
          "scripts/templates/templateBeginning.js",
          "scripts/templates/compiledTemplates.js",
          "scripts/templates/freshplugTemplates.js",
          "scripts/templates/templateEnding.js",
          "scripts/main/*.js",
          "scripts/app.js"
        ],
        dest: "dist/ioradTicketingFreshplug.js"
      }
    },

    // this section is used for our uglify action
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
      },
      build: {
        src: "dist/ioradTicketingFreshplug.js",
        dest: "dist/ioradTicketingFreshplug.min.js"
      }
    },
    
    htmlbuild: {
      dist: {
        src: "ioradTicketingFreshplug.html",
        dest: "dist/",
        options: {
          beautify: true,
          relative: true,
          scripts: {
            init: "scripts/init.js",
            app: "dist/ioradTicketingFreshplug.min.js"
          },
          styles: {
            freshplugStyle: "assets/css/style.css"
          }
        }
      },
      dev: {
        src: "ioradTicketingFreshplug.html",
        dest: "dist/ioradTicketingFreshplugDev.html",
        options: {
          beautify: true,
          relative: true,
          scripts: {
            init: "scripts/init.js",
            app: "dist/ioradTicketingFreshplug.js"
          },
          styles: {
            freshplugStyle: "assets/css/style.css"
          }
        }
      }
    }
  });

  //npm modules need for our task
  grunt.loadNpmTasks("grunt-bower-task");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-handlebars");
  grunt.loadNpmTasks("grunt-html-build");

  //run bower for package install
  grunt.registerTask("install-bower-packages", ["bower"]);

  //build vendor file src
  grunt.registerTask("merge-js-files", ["handlebars", "concat"]);

  //build min vendor file from above
  grunt.registerTask("min-js-file", ["handlebars", "concat", "uglify"]);

  //build ioradTicketingFreshPlug.html output
  grunt.registerTask("build-freshplug", ["handlebars", "concat", "uglify", "htmlbuild"]);
};
