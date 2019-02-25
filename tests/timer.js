step("wait for <secondCount> seconds", function(secondCount) {
  sleep(secondCount*1000);
});

function sleep(ms)
{
  var dt = new Date();
  dt.setTime(dt.getTime() + ms);
  while (new Date().getTime() < dt.getTime());
}