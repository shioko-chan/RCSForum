App({
  onLaunch: function () {
    tt.requestAccess({
      scopeList: [],
      appid: "cli_a67536fc8d7c900c",
      success(res) {
        console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log(`requestAccess fail: ${JSON.stringify(res)}`);
      },
    });
  }
})
