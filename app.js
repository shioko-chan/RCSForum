App({
  username: "",
  avatar: "",
  onLaunch: function () {
    var that = this;
    tt.login({
      success: function () {
        tt.getUserInfo({
          withCredentials: true,
          success(res) {
            const data = res.userInfo;
            that.username = data.nickName;
            that.avatar = data.avatarUrl
          },
          fail(res) {
            console.log(`getUserInfo fail: ${JSON.stringify(res)}`);
          }
        });
      }
    });
  },
  onPageNotFound(res) {
    tt.redirectTo({
      url: 'pages/index/index'
    })
  },
})
