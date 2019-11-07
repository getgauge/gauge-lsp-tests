step("wait for <secondCount> seconds", function(secondCount, done) {
  setTimeout(done, secondCount * 1000);
});
