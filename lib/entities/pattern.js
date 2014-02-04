var Pattern = function(name, subdir, filename, data) {
    this.name = name;
    this.subdir = subdir;
    this.filename = filename;
    this.template = null;
    this.displayName = null;
};

Pattern.prototype = {
    getName: function() {
        
    }
};

module.exports = Pattern;