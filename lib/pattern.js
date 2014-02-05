var _ = require('lodash');

var Pattern = function(name, subdir, filename, data) {
    this.name = name;
    this.subdir = subdir;
    this.filename = filename;
    this.template = null;
    this.displayName = null;
};

// Define inherited methods
Pattern.prototype = {
    getName: function() {
        
    }
};



// Define static methods
Pattern.formatName = function(name, dashesToSpaces) {
    var bits = name.split("-");

    // If the first bit of the pattern is not numerical, return the entire pattern name,
    // else return the second bit.
    var patternName;

    if (_.isNaN(parseInt(bits[0], 10))) {
        patternName = name;
    } else {
        bits.shift();
        patternName = bits.join("-");
    }

    if (dashesToSpaces) {
        patternName = patternName.replace('-', " ");
    }


    return patternName;
};

module.exports = Pattern;