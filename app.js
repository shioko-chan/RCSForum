App({
  username: "Anonymous",
  avatar: "/assets/images/anon.png",
  url: "http://10.26.4.71",
  is_admin: false,
  token: "",
  page_size: 16,
  login_promise: null,
  once_storage: null,
  max_image_size: 10,
  setOnceStorage: function (data) {
    this.once_storage = data;
  },
  loginOnce: function () {
    var that = this;
    return new Promise((resolve, reject) => {
      var request = (code) => {
        tt.request({
          url: `${that.url}/login`,
          header: {
            "Content-Type": "application/json; charset=utf-8"
          },
          method: "POST",
          data: {
            "code": code
          },
          success: function (res) {
            if (res.data.status === 0) {
              that.avatar = res.data.avatar;
              that.username = res.data.name;
              that.token = res.header.authorization;
              that.is_admin = res.data.is_admin;
              that.open_id = res.data.open_id;
              resolve();
            }
            else {
              console.error("request backend login failed: ", res);
              reject();
            }
          },
          fail: function (res) {
            console.error("request backend login failed: ", res);
            reject();
          }
        })
      };
      tt.login({
        success: function (res) {
          request(res.code);
        },
        fail: function (res) {
          console.error("login failed: ", res);
          reject();
        }
      });
    });
  },
  login: function () {
    let prev_promise = this.login_promise;
    if (prev_promise !== null) {
      return prev_promise;
    }
    let login_promise = this.login_promise = this.loginOnce().finally(() => { this.login_promise = null; });
    return login_promise;
  },
  onLaunch: function () {
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
    this.login_promise = Promise.all([getStorage("Azazel"), getStorage("Ariel"), getStorage("Asbeel"), getStorage("Samyaza"), getStorage("Samael")])
      .then(([token, username, avatar, is_admin, open_id]) => {
        console.info("get info from local storage");
        this.token = token;
        this.username = username;
        this.avatar = avatar;
        this.is_admin = is_admin;
        this.open_id = open_id;
      })
      .catch(err => {
        console.warn("load data from local storage failed, ", err);
        console.info("get info from server");
        return this.loginOnce().catch(() => {
          tt.showModal({
            "title": "连接服务器失败",
            "confirmText": "确认",
            "showCancel": false,
          });
        });
      })
      .finally(() => { this.login_promise = null; });
    tt.hideTabBar({
      animation: false,
      fail(res) {
        console.error("hideTabBar fail", res);
      }
    });
    tt.getUpdateManager().onUpdateReady(function () {
      tt.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？\n\n若发现bug，可点击左上角反馈',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
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
    return Promise.all([setStorage("Azazel", that.token), setStorage("Ariel", that.username), setStorage("Asbeel", that.avatar), setStorage("Samyaza", that.is_admin), setStorage("Samael", that.open_id)]);
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
