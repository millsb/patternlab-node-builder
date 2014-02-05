var Q = require('q'),
    walk = require('walk'),
    fs = require('fs'),
    Pattern = require('./pattern'),
    PatternTypes = require('./pattern_type'),
    Nav = require('./nav');

var Builder = function(config) {
    // Set up the builder, and pull in some values from the config.
    this.sourceDir = config.sourceDir;
    this.publicDir = config.publicDir;
    this.patternTypes = [];
    this.patternLineages = [];
    this.patternPartials = [];
};

Builder.prototype = {
    // Run through our source directory and marshall
    // all our information on patterns
    gatherPatternInfo: function(callback) {

        var deferred = Q.defer();

        var walkerOptions = {
            followLinks: false // Do NOT follow symbolic links
        };

        var walker = walk.walk(this.sourceDir, walkerOptions);

        walker.on('directory', function(root, dirStats, next) {
            // Handle the type directory
            if (root == this.sourceDir) {
                this.handleTypeDir(dirStats.name);
            } else {
                root.handleTypeItemDir(dirStats.name, root);
            }
            next();
        });

        walker.on('file', function(root, fileStats, next) {
            next();
        });

        walker.on('end', function() {
            deferred.resolve();
        });

        return deferred.promise;
    },

    handleTypeDir: function(dirName) {
        var patternType = new PatternType(dirName);
        this.patternTypes.push(patternType);
    },

    handleTypeItemDir: function(dirName, rootDir) {

    }
};

module.exports = Builder;