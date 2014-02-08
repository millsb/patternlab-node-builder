var should = require('chai').should(),
	PatternType = require('../lib/pattern_type');

describe('PatternType', function () {
	describe('#new', function () {
		it('populates name', function () {
			var pt = new PatternType('pattern-name');
			pt.name.should.equal('pattern-name');
		});
		it('sets parentType to undefined when not supplied', function () {
			var pt = new PatternType('pattern-name');
			should.not.exist(pt.parentType);
		});
		it('sets parentType when supplied', function () {
			var pt = new PatternType('pattern-name', 'parent-name');
			pt.parentType.should.eq('parent-name');
		});
	});
});
