step("wait for <secondCount> seconds", async function(secondCount) {
	sleep(secondCount*1000)
});

function sleep(ms)
{
  var dt = new Date();
  dt.setTime(dt.getTime() + ms);
  while (new Date().getTime() < dt.getTime());
}