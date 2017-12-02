async function assertEqualWithMessage(actual,expected) {  
    assert.equal(actual, expected, 
    JSON.stringify(actual) + " not equal to " 
    + JSON.stringify(expected));        
}  
  
async function assertDeepEqualWithMessage(actual,expected) {  
assert.deepEqual(actual, expected, 
    JSON.stringify(actual) + " not equal to " 
    + JSON.stringify(expected));        
}  

module.exports = {assertEqualWithMessage:assertEqualWithMessage,
assertDeepEqualWithMessage:assertDeepEqualWithMessage};  