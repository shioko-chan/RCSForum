App({
  username: "",
  avatar: "",
  onLaunch: function () {
    tt.hideTabBar({
      animation: false,
      success(res) {
        // console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log("hideTabBar fail");
      }
    });
    var that = this;
    tt.login({
      success: function () {
        tt.getUserInfo({
          withCredentials: true,
          success(res) {
            const data = res.userInfo;
            that.username = data.nickName;
            that.avatar = data.avatarUrl
            console.log(data);
          },
          fail(res) {
            console.log(`getUserInfo fail: ${JSON.stringify(res)}`);
          }
        });
      }
    });
    tt.setWindowSize({
      windowWidth: 400,
      windowHeight: 800,
      success(res) {
        // console.log('setWindowSize success', res);
      },
      fail(res) {
        console.log('setWindowSize fail', res);
      },
    });
    tt.getConnectedWifi({
      success(res) {
        // console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log(`getConnectedWifi fail: ${JSON.stringify(res)}`);
      }
    });
  },
  onPageNotFound(res) {
    tt.redirectTo({
      url: 'pages/index/index'
    })
  },
})
