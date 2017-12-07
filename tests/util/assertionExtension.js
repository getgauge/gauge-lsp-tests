"use strict"

var assert = require('assert')

function assertContains(expectedElements,element){
    assert.ok(expectedElements.indexOf(element) > -1, 'element not found ' + element);    
}
function assertEqual(actual,expected) {  
    assert.equal(actual, expected, 
    JSON.stringify(actual) + " not equal to " 
    + JSON.stringify(expected));        
}  

module.exports = {assertEqual:assertEqual,
assertContains:assertContains};  