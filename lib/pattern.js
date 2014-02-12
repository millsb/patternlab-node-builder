var _ = require('lodash'),
    path = require('path');

var Pattern = function(filePath, type, dataPath) {
    this.filePath = filePath;
    this.dataPath = 
    this.name = path.basename(filePath, '.mustache');
    this.type = type;
    this.data = [];
};

// Define inherited methods
Pattern.prototype = {
    isHidden: function() {
        return this.name.charAt(0) == "_" ? true : false;
    },
    partialName: function() {
        var name = this.name;
        if (this.isHidden()) {
            name = name.replace('_', '');
        }
        return this.type + "-" + name;
    }

};



// Define static methods
Pattern.formatName = function(name, dashesToSpaces) {
    var pieces = name.split("-").filter(function(value) {
        return (_.isNaN(parseInt(value), 10));
    });

    var patternName = pieces.join("-");

    if (dashesToSpaces) {
        patternName = patternName.replace('-', " ");
    }

    return patternName;
};

Pattern.pathToName = function(filePath, includeType) {
    filePath = path.normalize(filePath);
    var base = filePath.replace(path.extname(filePath), "");
    var pieces = base.split(path.sep);

    var name = _(pieces).last();
    var type = _(pieces).first();

    if (includeType && pieces.length > 1) {
        return type + "-" + name;
    } else {
        return name;
    }
};

module.exports = Pattern;