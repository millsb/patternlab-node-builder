var Q = require('q'),
    walk = require('walk'),
    path = require('path'),
    _ = require('lodash'),
    Mustache = require('mustache'),
    Pattern = require('./pattern'),
    Bucket = require('./bucket'),
    Data = require('./data');

var BuilderResult = function(obj) {
    this.buckets = obj.buckets || [];
    this.config = obj.config;
};

var Builder = function(config) {
    // Set up the builder, and pull in some values from the config.
    this.sourceDir = config.sourceDir;
    this.publicDir = config.publicDir;
    this.patterns = [];
    this.buckets = [];
    this.patternLineages = [];
    this.patternData = [];
    this.patternLineages = [];
};

Builder.prototype = {

    build: function() {
        var defer = Q.defer();
        var self = this;
        this.gatherPatternInfo().then(function() {
            self.gatherLineages().then(function() {
                self.patternPreflight();
                var result = new BuilderResult({
                   buckets: self.buckets,
                   config: self.config
                });
                defer.resolve(result);
            });
        });
        return defer.promise();
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
            self.handleDir(dirStats.name);
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

    getBucket: function(filePath) {
        var bucket;
        _(this.buckets).each(function(aBucket) {
          if (aBucket.filePath == filePath) {
            bucket = aBucket;
          }
        });

        return bucket;
    },

    embucketPattern: function(pattern) {
        var bucketPath = pattern.filePath.replace(pattern.filePath.basename, "");
        var bucket = this.getBucket(bucketPath)
        if (bucket) {
            bucket.patterns.push(pattern);
        }
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

    getPattern: function(name) {
        var thePattern;
        _(this.patterns).each(function(pattern) {
            if (pattern.partialName().indexOf(name) !== -1) {
                 thePattern = pattern;
            }
        });

        return thePattern;
    },

    patternPreflight: function() {
        var self = this;
        _(this.patterns).each(function(pattern) {
            pattern.data = self.dataForPattern(pattern.filePath);
            pattern.lineages = self.lineagesForPattern(pattern.filePath);
            pattern.reverseLineages = self.reverseLineagesForPattern(pattern.filePath);
        });
    },

    compilePattern: function(pattern) {
        var promises = [pattern.getTemplate(), pattern.data[0].read()];

        return Q.all(promises).then(function(results) {
            var template = results[0];
            var data = results[1];

            var compiledTemplate = Mustache.compile(template);
            return compiledTemplate.render(data);

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

    handleDir: function(dirName) {
        var bucketPath = dirName.replace(this.sourceDir, "");
        if (!this.getBucket(bucketPath)) {
            var bucket = new Bucket(bucketPath);
            this.buckets.push(bucket);
        }
    },

    handleMustacheFile: function(fileName, rootDir) {
        var type = path.basename(rootDir);
        var fullPath = rootDir + path.sep + fileName;
        var pattern = new Pattern(fullPath.replace(this.sourceDir, ""));
        this.patterns.push(pattern);
    },

    handleJsonFile: function(fileName, rootDir) {
        var data = new Data(rootDir + "/" + fileName);
        this.patternData.push(data);
    }
};

module.exports = Builder;
