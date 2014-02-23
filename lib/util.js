var path = require("path"),
    _ = require("lodash");

module.exports = {
    
    nameClean: function(name, dashesToSpaces) {
        var pieces = name.split("-").filter(function(value) {
            return (_.isNaN(parseInt(value), 10));
        });

        var patternName = pieces.join("-");

        if (dashesToSpaces) {
            patternName = patternName.replace('-', " ");
        }

        return patternName;
    },

    pathToName: function(filePath, includeType) {
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
    }
};