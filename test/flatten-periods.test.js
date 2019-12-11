const {describe, it} = require("mocha");
const {expect} = require("chai");

const flattenPeriods = require("../index");

describe("Flatten periods", function() {
  describe("#inputValidity", function() {
    it("should throw an error for non-array input", function(done) {
      expect(function() {
        flattenPeriods("invalidInput");
      }).to.throw("Input must be array");
      done();
    });

    it("should throw an error if elements are missing start", function(done) {
      expect(function() {
        flattenPeriods([{end: Date.now()}]);
      }).to.throw("All elements must have a start");
      done();
    });

    it("should throw an error if elements are missing an end", function(done) {
      expect(function() {
        flattenPeriods([{start: Date.now()}]);
      }).to.throw("All elements must have an end");
      done();
    });

    it("should throw an error if a start value is not an integer", function(done) {
      expect(function() {
        flattenPeriods([{start: "ddaa", end: Date.now()}]);
      }).to.throw("All start values must be integers");
      done();
    });

    it("should throw an error if an end value is not an integer", function(done) {
      expect(function() {
        flattenPeriods([{end: "ddaa", start: Date.now()}]);
      }).to.throw("All end values must be integers");
      done();
    });

    it("should throw an error if a start value is after an end value", function(done) {
      expect(function() {
        flattenPeriods([{start: 5, end: 4}]);
      }).to.throw("Start values must not be greater than end values");
      done();
    });
  });
  describe("#returnValue", function() {
    it("return an array", function(done) {
      expect(flattenPeriods([])).to.be.an("array");
      done();
    });
    it("should not flatten none-overlapping periods", function(done) {
      const testData = [{start: 0, end: 5}, {start: 5, end: 8}, {start: 9, end: 11}];
      expect(flattenPeriods(testData)).to.deep.equal(testData);
      done();
    });
    it("should flatten overlapping periods", function(done) {
      const testData = [{start: 0, end: 5}, {start: 4, end: 7}, {start: 10, end: 12}, {start: 11, end: 12}];
      const testResult = [{start: 0, end: 7}, {start: 10, end: 12}];
      expect(flattenPeriods(testData)).to.deep.equal(testResult);
      done();
    });
    it("should not flatten non-overlapping periods when flattening overlapping periods", function(done) {
      const testData = [{start: 0, end: 5}, {start: 4, end: 7}, {start: 8, end: 10}];
      const testResult = [{start: 0, end: 7}, {start: 8, end: 10}];
      expect(flattenPeriods(testData)).to.deep.equal(testResult);
      done();
    });
    it("should flatten inclusive periods", function(done) {
      const testData = [{start: 0, end: 5}, {start: 3, end: 4}];
      const testResult = [{start: 0, end: 5}];
      expect(flattenPeriods(testData)).to.deep.equal(testResult);
      done();
    });
  });
});
