"use strict";

var _helper = require("../helper");

test('toNumber with a single letter', function () {
  expect((0, _helper.toNumber)("a")).toBe(1);
});
test('toNumber with a single capital letter', function () {
  expect((0, _helper.toNumber)("A")).toBe(1);
});
test('toNumber with a input string', function () {
  expect((0, _helper.toNumber)("ABC")).toBe(123);
});
test('toNumber with a input string', function () {
  expect((0, _helper.toNumber)("abc")).toBe(123);
});
test('toNumber with a input string', function () {
  expect((0, _helper.toNumber)("Aac")).toBe(113);
});