var chai = require('chai'),
    should = require('chai').should(),
    expect = require('chai').expect,
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
require("mocha-as-promised")();

var Builder = require('../lib/builder'),
    Bucket = require('../lib/bucket'),
    Pattern = require('../lib/pattern'),
    Data = require('../lib/data');

describe('Builder', function() {

    describe('#new', function() {
        beforeEach(function() {
            var config = { sourceDir: "/foo", publicDir: "/bar" }
            this.builder = new Builder(config);
        });

        it('returns and instance of Builder', function() {
            typeof this.builder.should == (Builder);
        });

        it('sets config values', function() {
            this.builder.sourceDir.should == "/foo";
            this.builder.publicDir.should == "/bar";
        });
    });

    describe('#gatherPatternInfo', function() {
        beforeEach(function() {
            var config = { sourceDir: "./test/data/source/_patterns", publicDir: "./data/source/_public" };
            this.builder = new Builder(config);
        });

        it('populates patterns', function (done) {
            var self = this;
            var builderPromise = this.builder.gatherPatternInfo();
            builderPromise.should.be.fulfilled.then(function() {
                self.builder.patterns.length.should.be.gt(1);
                self.builder.patterns[0].should.be.instanceOf(Pattern);
            }).should.notify(done);
        });
        it('populates pattern data', function (done) {
            var self = this;
            var builderPromise = this.builder.gatherPatternInfo();
            builderPromise.should.be.fulfilled.then(function() {
                self.builder.patternData.length.should.be.gt(0);
                self.builder.patternData[0].should.be.instanceOf(Data);
                self.builder.patternData[0].patternName().should.equal('test-navbar');
            }).should.notify(done);
            
        });
    });

    describe("#gatherLineages", function() {
        beforeEach(function() {
            var config = { sourceDir: "./test/data/source/_patterns", publicDir: "./data/source/_public" };
            this.builder = new Builder(config);
        });

        it('populates lineage data', function(done) {
            var self = this;
            this.builder.patterns = [ new Pattern("./test/data/source/_patterns/03-organisms/01-masthead.mustache") ]
            this.builder.gatherLineages().should.be.fulfilled.then(function() {
                self.builder.patternLineages.length.should.be.gt(0);
                self.builder.patternLineages[0].pattern.should.equal('./test/data/source/_patterns/03-organisms/01-masthead.mustache');
                self.builder.patternLineages[0].refers.length.should.be.gt(0);
            }).should.notify(done);
        });
    });

    describe('#getBucket', function() {
        beforeEach(function() {
            var config = { sourceDir: "./test/data/source/_patterns", publicDir: "./data/source/_public" };
            this.builder = new Builder(config);
            this.builder.buckets = [new Bucket('foo', '/foo/bar')];
        });

        it('returns undefined when bucket is not present', function() {
           var bucket = this.builder.getBucket('bar', '/baz/bat/');
           should.not.exist(bucket);
        });

        it('returns bucket when bucket is present', function() {
            var bucket = this.builder.getBucket(new Bucket('foo', '/foo/bar'));
            bucket.should.be.instanceOf(Bucket);
        });
    });

    describe('#getPattern', function () {
        beforeEach(function() {
            var config = { sourceDir: "./test/data/source/_patterns", publicDir: "./data/source/_public" };
            this.builder = new Builder(config);
        });

        it('should return a pattern if found', function (done) {
            var self = this;
            this.builder.gatherPatternInfo().should.be.fulfilled.then(function() {
                debugger;
                var pattern = self.builder.getPattern('organisms-masthead');
                should.exist(pattern);
                should.exist(self.builder.getPattern('masthead'));
            }).should.notify(done);
        });
    });

    describe('#dataForPattern', function () {
        beforeEach(function() {
            var config = { sourceDir: "./test/data/source/_patterns", publicDir: "./data/source/_public" };
            this.builder = new Builder(config);
            this.builder.patternData.push(new Data("/foo/bar.mustache"));
            this.builder.patternData.push(new Data('/foo/bar~baz.mustache'));
        });

        it("returns a matching data object", function() {
            var data = this.builder.dataForPattern('/foo/bar.mustache');
            data.should.be.an("array");
            data.length.should.equal(2);
            data[0].should.be.instanceOf(Data);
            data[0].filePath.should.equal('/foo/bar.mustache');
        });

        it("returns empty set if no match", function() {
            var data = this.builder.dataForPattern('/bat/baz.mustache');
            data.should.be.empty;

        });

        it("returns a data object if partial", function() {
            var data = this.builder.dataForPattern('/foo/bar.mustache');
            data[1].filePath.should.equal('/foo/bar~baz.mustache');
        });
        
    });

    describe('#lineagesForPattern', function () {
        beforeEach(function() {
            var config = { sourceDir: "./test/data/source/_patterns", publicDir: "./data/source/_public" };
            this.builder = new Builder(config);
            this.builder.patternLineages.push({ pattern: "/foo/bar.mustache", refers: ["{{> molecules-baz }}"]});

        });
        it('should return an array of lineage template names', function() {
            var lineages = this.builder.lineagesForPattern("/foo/bar.mustache");
            lineages.should.be.an("array");
            lineages[0].should.equal("{{> molecules-baz }}");
        });
        it('should return empty if no lineages', function() {
            var lineages = this.builder.lineagesForPattern("/baz/bat.mustache");
            lineages.should.be.empty;

        });
    });

    describe('#reverseLineagesForPattern', function () {
        beforeEach(function() {
            var config = { sourceDir: "./test/data/source/_patterns", publicDir: "./data/source/_public" };
            this.builder = new Builder(config);
            this.builder.patternLineages.push(
                { pattern: "/foo/bar.mustache", refers: ["{{> molecules-baz }}"]},
                { pattern: "/one/two.mustache", refers: ["{{> molecules-baz }}", "{{> organisms-three }}"]},
                { pattern: "/hi/there.mustache", refers: ["{{> molecules-baz }}" ]}
            );
        });
        it('should return the name of the patterns that refer to a given pattern', function () {
            var refs = this.builder.reverseLineagesForPattern("00-molecules/001-baz.mustache");
            refs.length.should.equal(3);
        });

        it('should ignore refs that have same pattern name, but belong to different types', function() {
            this.builder.patternLineages.push({
                pattern: "/three/four.mustache",
                refers: ["{{> atoms-baz }}"]
            });

            var refs = this.builder.reverseLineagesForPattern("00-molecules/001-baz.mustache");
            refs.length.should.equal(3);
        });
    });

    describe('#compilePattern', function () {
        beforeEach(function() {
            this.builder = new Builder({ sourceDir: "./test/data/source/_patterns", publicDir: "./test/data/source/_public" });
        });

        it("should return compiled pattern HTML", function(done) {
            var self = this;
            this.builder.gatherPatternInfo().should.be.fulfilled.then(function() {
                self.builder.patternPreflight();
                var pattern = self.builder.getPattern('molecules-navbar');
                self.builder.compilePattern(pattern).should.eventually.equal('<p>LIKE A BOSS!</p>');
            }).should.notify(done);
        });
    });

    describe('#handleSubTypeDir', function() {
        before(function() {
            this.builder = new Builder({ sourceDir: "", publicDir: ""});
        });
        it('throws an exception if parent type is not registered', function () {
            var self = this;
            var fn = function() { self.builder.handleSubTypeDir('01-molecules', 'foo/bar/00-atoms') };
            fn.should.throw(Error);
        });
    });

    describe('#handleJsonFile', function() {
    });
});
