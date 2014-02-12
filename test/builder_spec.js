var chai = require('chai'),
    should = require('chai').should(),
    expect = require('chai').expect,
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
require("mocha-as-promised")();

var Builder = require('../lib/builder'),
    PatternType = require('../lib/pattern_type'),
    Pattern = require('../lib/pattern'),
    Data = require('../lib/data');

describe('Builder', function() {

    describe('#new', function() {
        beforeEach(function() {
            var config = { sourceDir: "/foo", publicDir: "/bar" }
            this.builder = new Builder(config);
        });

        it('returns and instance of Builder', function() {
            typeof this.builder.should == Builder;
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

        it("populates pattern types", function(done) {
            var self = this;
            var builderPromise = this.builder.gatherPatternInfo();
            builderPromise.should.be.fulfilled.then(function() {
                self.builder.patternTypes.length.should.be.gt(1);
                self.builder.patternTypes[0].should.be.instanceOf(PatternType);
                self.builder.patternTypes[0].name.should.eq('00-atoms');
            }).should.notify(done);
        });

        it('populates pattern subtypes', function (done) {
            var self = this;
            var builderPromise = this.builder.gatherPatternInfo();
            builderPromise.should.be.fulfilled.then(function() {
                var type = self.builder.findPatternType('01-components');
                type.parentType.should.equal('01-molecules')
            }).should.notify(done);
        });

        it('populates patterns', function (done) {
            var self = this;
            var builderPromise = this.builder.gatherPatternInfo();
            builderPromise.should.be.fulfilled.then(function() {
                self.builder.patterns.length.should.be.gt(1);
                self.builder.patterns[0].should.be.instanceOf(Pattern);
                self.builder.patterns[0].name.should.eq('01-navbar');
            }).should.notify(done);
        });
        it('populated pattern data', function (done) {
            var self = this;
            var builderPromise = this.builder.gatherPatternInfo();
            builderPromise.should.be.fulfilled.then(function() {
                console.log(self.builder.patternData);
                self.builder.patternData.length.should.be.gt(0);
                self.builder.patternData[0].should.be.instanceOf(Data);
                self.builder.patternData[0].patternName().should.equal('navbar');
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

    describe('#handleMustacheFile', function() {
        before(function() {
            this.builder = new Builder({ sourceDir: "", publicDir: ""});
        });
        it('throws an exception if parent type is not registered', function () {
            var self = this;
            var fn = function() { self.builder.handleMustacheFile('01-molecules', 'foo/bar/00-atoms') };
            fn.should.throw(Error);
        });
    });

    describe('#handleJsonFile', function() {
    });

    describe('#findPatternType', function () {
        before(function() {
            var builder = new Builder({ sourceDir: "", publicDir: ""});
            builder.patternTypes = [
                new PatternType('00-atoms'),
                new PatternType('01-type', '00-atoms'),
                new PatternType('01-molecules')
            ];

            this.builder = builder;
        });
        it('should return a PatternType by name', function () {
            var patternType = this.builder.findPatternType('01-type');
            patternType.should.be.instanceOf(PatternType);
            patternType.name.should.equal('01-type');
        });
    });

});