/* globals gauge*/

"use strict";

var assert = require("assert");

step("A step that passes", async function() {
});

step("A Step to fail", async function() {
	throw new Error(fail)
});