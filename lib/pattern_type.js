var Pattern = require('./pattern');

var PatternType = function(name) {
    this.name = name;
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