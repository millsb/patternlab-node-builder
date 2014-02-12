var Q = require('q'),
    walk = require('walk'),
    path = require('path'),
    _ = require('lodash'),
    Pattern = require('./pattern'),
    PatternType = require('./pattern_type'),
    Nav = require('./nav'),
    Data = require('./data');

var Builder = function(config) {
    // Set up the builder, and pull in some values from the config.
    this.sourceDir = config.sourceDir;
    this.publicDir = config.publicDir;
    this.patterns = [];
    this.patternTypes = [];
    this.patternLineages = [];
    this.patternData = [];
};

Builder.prototype = {
    // Run through our source directory and marshall
    // all our information on patterns
    gatherPatternInfo: function(callback) {

        var deferred = Q.defer();
        var self = this;

        var walkerOptions = {
            followLinks: false // Do NOT follow symbolic links
        };

        var walker = walk.walk(this.sourceDir, walkerOptions);

        walker.on('directory', function(root, dirStats, next) {
            // Handle the type directory
            if (root == self.sourceDir) {
                self.handleTypeDir(dirStats.name);
            } else {
                self.handleSubTypeDir(dirStats.name, root);
            }
            next();
        });

        walker.on('file', function(root, fileStats, next) {
            // TODO: Handle JSON pseudo-pattern
            var extension = path.extname(fileStats.name);
            if (extension == ".mustache") {
                self.handleMustacheFile(fileStats.name, root);
            }

            if (extension == ".json") {
                self.handleJsonFile(fileStats.name, root);
            }
            next();
        });

        walker.on('end', function() {
            deferred.resolve(self);
        });

        return deferred.promise;
    },

    handleTypeDir: function(dirName) {
        var patternType = new PatternType(dirName);
        this.patternTypes.push(patternType);
    },

    handleSubTypeDir: function(dirName, rootDir) {
        var parent = path.basename(rootDir);

        if (this.findPatternType(parent)) {
            var patternType = new PatternType(dirName, parent);
            this.patternTypes.push(patternType);
        } else {
            throw new Error("Parent '" + parent + "' does not exist for pattern '" + dirName + "'.");
        }

    },

    handleMustacheFile: function(fileName, rootDir) {
        var type = path.basename(rootDir);

        if (this.findPatternType(type)) {
            var pattern = new Pattern(rootDir + path.sep + fileName, type);
            this.patterns.push(pattern);
        } else {
            throw new Error("Type '" + parent + "' does not exist for pattern '" + fileName + "'.");
        }
    },

    handleJsonFile: function(fileName, rootDir) {
        var data = new Data(rootDir + "/" + fileName);
        this.patternData.push(data);
    },

    // Locate an already registered PatternType by name.
    findPatternType: function(name) {
        var patternType;
        _(this.patternTypes).each(function(type) {
            if (type.name == name) {
                patternType = type;
            }
        });

        return patternType;
    }
};

module.exports = Builder;