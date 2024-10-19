App({
  username: "Anonymous",
  avatar: "/assets/images/anon.png",
  url: "http://10.26.4.71",
  is_admin: false,
  token: "",
  page_size: 16,
  login_promise: null,
  once_storage: null,
  setOnceStorage: function (data) {
    this.once_storage = data;
  },
  loginOnce: function () {
    var that = this;
    return new Promise((res, rej) => {
      var factory = (func) => {
        return () => {
          that.login_promise = null;
          func();
        };
      };
      var resolve = factory(res);
      var reject = factory(rej);
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
    let login_promise = this.login_promise = this.loginOnce();
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
    this.login_promise = Promise.all([getStorage("Azazel"), getStorage("Ariel"), getStorage("Asbeel"), getStorage("Samyaza")])
      .then(([token, username, avatar, is_admin, open_id]) => {
        console.info("get info from local storage");
        this.token = token;
        this.username = username;
        this.avatar = avatar;
        this.is_admin = is_admin;
        this.open_id = open_id;
        this.login_promise = null;
      })
      .catch(err => {
        console.warn("load data from local storage failed, ", err);
        console.info("get info from server");
        this.login_promise = this.loginOnce().catch(() => {
          tt.showModal({
            "title": "连接服务器失败",
            "confirmText": "确认",
            "showCancel": false,
          });
        });
      });
    tt.hideTabBar({
      animation: false,
      fail(res) {
        console.error("hideTabBar fail");
      }
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
