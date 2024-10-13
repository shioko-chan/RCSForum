App({
  username: "Anonymous",
  avatar: "/assets/images/anon.png",
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
      success: function (res) {
        tt.request({
          url: "http://192.168.1.100:5000/login",
          method: "POST",
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res);
            that.avatar = res.data.avatar;
            that.username = res.data.name;
          },
          fail: function (res) {
            console.log("request backend login failed: ", res);
          }
        });
      },
      fail: function (res) {
        console.log("login failed: ", res);
      }
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
