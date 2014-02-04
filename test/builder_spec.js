var chai = require('chai');
var should = require('chai').should();
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var Builder = require('../lib/builder.js');

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
            var promise = this.builder.gatherPatternInfo();
            promise.should.be.fulfilled.then(function() {
                self.builder.patternTypes.length.should.not == 0;
            }).should.notify(done);
        });
    });

});