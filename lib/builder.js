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
    this.patternLineages = [];
};

Builder.prototype = {

    build: function() {
        var self = this;
        this.gatherPatternInfo().then(function() {
            self.gatherLineages().then(function() {
                self.patternPreflight();
                self.generatePatterns();
            });
        });
    },
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

    gatherLineages: function() {
        var allTemplates = _.map(this.patterns, function(pattern) {
            return pattern.read();
        });

        var self = this;
        return Q.all(allTemplates).then(function(templates) {
            _(templates).each(function(template) {
                var templateString = template.template;
                var pattern = template.pattern;
                matchExp = /{{>([ ]+)?([A-Za-z0-9-]+)(?:\:[A-Za-z0-9-]+)?(?:(| )\(.*)?([ ]+)}}/g;
                matches = templateString.match(matchExp);
                self.patternLineages.push({ pattern: pattern.filePath, refers: _.uniq(matches) });
            });
        });

    },

    patternPreflight: function() {
        _(this.patterns).each(function(pattern) {
            pattern.data = this.dataForPattern(pattern);
        });
    },

    lineagesForPattern: function(filePath) {
        var lineages = [];
         _.each(this.patternLineages, function(lineage) {
            if (lineage.pattern == filePath) {
                lineages.push(lineage.refers);
            }
        });

        return _.flatten(lineages);
    },

    reverseLineagesForPattern: function(filePath) {
        var lineages = [];
        var basename = path.basename(filePath, ".mustache");
        _.each(this.patternLineages, function(lineage) {
            _.each(lineage.refers, function(refer) {
                refer = refer.replace(/{*>*\s*}*/g, "");
                var referPieces = refer.split('-');
                var isMatch = true;
                _.each(referPieces, function(piece) {
                    if (filePath.indexOf(piece) === -1) {
                        isMatch = false;
                    }
                });
                if (isMatch) {
                    lineages.push(lineage.pattern);
                }
            });
        });

        return _.uniq(lineages);

    },

    dataForPattern: function(filePath) {
        return _.filter(this.patternData, function(patternData) {
            var basename = filePath.replace(path.extname(filePath), "");
            if (patternData.filePath.indexOf(basename) != -1) {
                return patternData;
            }
        });
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