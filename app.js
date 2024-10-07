App({
  onLaunch: function () {
    tt.login({
      success: function () {
        tt.getUserInfo({
          withCredentials: false,
          success(res) {
            console.log(JSON.stringify(res));
          },
          fail(res) {
            console.log(`getUserInfo fail: ${JSON.stringify(res)}`);
          }
        });
      }
    });
  }
})
