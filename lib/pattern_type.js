var Pattern = require('./pattern');

var PatternType = function(name, parent) {
    this.name = name;
    this.parentType = parent;
};

PatternType.prototype = {
    cleanName: function() {
        return Pattern.formatName(this.name, true);
    },

    dashedName: function() {
        return Pattern.formatName(this.name);
    },

    titleName: function() {
        return this.cleanName().toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
    }
};

module.exports = PatternType;