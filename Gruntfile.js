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
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint', 'mochaTest']);

};