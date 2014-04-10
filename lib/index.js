var Builder = require("./builder"),
    Generator = require("./Generator");

var config = {
    sourceDir: "../source",
    publicDir: "../public"
};

var theBuilder = new Builder();
theBuilder.build().then(function(result) {
   var theGenerator = new Generator(result, config);
   theGenerator.generate();
});