App({
  username: "Anonymous",
  avatar: "/assets/images/anon.png",
  url: "http://192.168.3.2:8000",
  token: "",
  login: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      tt.login({
        success: function (res) {
          tt.request({
            url: `${that.url}/login`,
            header: { "content-type": "application/json" },
            method: "POST",
            data: {
              "code": res.code
            },
            success: function (res) {
              if (res.data.status !== 0) {
                console.log(res.data.status);
                reject(); return;
              }
              that.avatar = res.data.avatar;
              that.username = res.data.name;
              that.token = res.header.authorization;
              resolve();
            },
            fail: function (res) {
              console.log("request backend login failed: ", res);
              reject();
            }
          });
        },
        fail: function (res) {
          console.log("login failed: ", res);
          reject();
        }
      });
    });
  },
  onLaunch: async function () {
    tt.hideTabBar({
      animation: false,
      success(res) {
        // console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log("hideTabBar fail");
      }
    });
    this.login().catch(() => {
      tt.showModal({
        title: "连接服务器失败",
        confirmText: "确认",
        showCancel: false,
      });
    });
  },
  onPageNotFound(res) {
    tt.redirectTo({
      url: 'pages/index/index'
    })
  },
})
