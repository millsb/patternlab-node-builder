var chai = require('chai');
var should = require('chai').should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
require("mocha-as-promised")();

var Builder = require('../lib/builder');
var PatternType = require('../lib/pattern_type');

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
                self.builder.patternTypes.length.should.eq(1);
                self.builder.patternTypes[0].should.be.instanceOf(PatternType);
                self.builder.patternTypes[0].name.should.eq('00-atoms');
            }).should.notify(done);
        });
    });

});