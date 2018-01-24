function Logger () {
    this.errorMessage
}
 
Logger.prototype.getErrorMessage = function() {
    return this.errorMessage;
};

Logger.prototype.error = function(message) {
    this.errorMessage = message;
};

module.exports={Logger:Logger}
