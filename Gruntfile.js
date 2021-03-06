module.exports = function(grunt) {

    grunt.initConfig({
        mochaTest: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: ["test/**/*.js"]
            }
        },
        jshint: {
            files: {
                src: ["lib/**/*.js", "text/**/*.js", "Gruntfile.js"]
            }
        },
        watch: {
            scripts: {
                files: ['lib/**/*.js', 'test/**/*.js'],
                tasks: ['jshint', 'mochaTest'],
            }
        }
  });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-debug-task');
    grunt.registerTask('default', ['jshint', 'mochaTest']);

};