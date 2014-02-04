var PatternUtil = require('../util').PatternUtil;

var PatternType = function(name) {
    this.name = name;
};

PatternType.prototype = {
    cleanName: function() {
        return PatternUtil.patternName(this.name, true);
    },

    dashedName: function() {
        return PatternUtil.patternName(this.name);
    },

    titleName: function() {
        return this.cleanName().toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
    }
};