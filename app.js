App({
  username: "Anonymous",
  avatar: "/assets/images/anon.png",
  url: "http://127.0.0.1:8000",
  token: "",
  page_size: 16,
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
    let that = this;
    tt.hideTabBar({
      animation: false,
      success(res) {
        // console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log("hideTabBar fail");
      }
    });
    var getStorage = function (key) {
      return new Promise((resolve, reject) => {
        tt.getStorage({
          "key": key,
          success(res) {
            if (res.data) {
              resolve(res.data);
            }
            else {
              reject("no data in storage");
            }
          },
          fail(res) {
            reject("getStorage fail");
          }
        });
      })
    }
    Promise.all([getStorage("Lucifer"), getStorage("Seraph"), getStorage("Daemon")])
      .then(([token, username, avatar]) => {
        console.log("get info from local storage");
        that.token = token;
        that.username = username;
        that.avatar = avatar;
      })
      .catch(errs => {
        console.log(errs);
        console.log("get info from server");
        this.login().catch(() => {
          tt.showModal({
            title: "连接服务器失败",
            confirmText: "确认",
            showCancel: false,
          });
        });
      });
  },
  storageInfo: function () {
    let that = this;
    var setStorage = function (key, data) {
      return new Promise((resolve, reject) => {
        tt.setStorage({
          key: key,
          data: data,
          success(res) {
            resolve();
          },
          fail(res) {
            reject(res);
          }
        });
      });
    };
    return Promise.all([setStorage("Lucifer", that.token), setStorage("Seraph", that.username), setStorage("Daemon", that.avatar)]);
  },
  onHide: async function () {
    await this.storageInfo();
  },
  onUnload: async function () {
    await this.storageInfo();
  },
  onPageNotFound: function (res) {
    tt.redirectTo({
      url: 'pages/index/index'
    })
  },
})
