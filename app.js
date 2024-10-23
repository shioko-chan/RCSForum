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
  emojis: [],
  _read_emoji_list() {
    tt.getFileSystemManager().readFile({
      filePath: "/assets/emoji/emoji.json",
      encoding: "utf-8",
      success: res => {
        this.emojis = JSON.parse(res.data);
      },
      fail: res => {
        console.error("failed to read emoji list", res);
      }
    });
  },
  setOnceStorage(data) {
    this.once_storage = data;
  },
  _request({ url, method, header, data }) {
    return new Promise((resolve, reject) => {
      tt.request({
        url,
        method,
        header,
        data,
        success: resolve,
        fail: res => {
          if (res.statusCode !== undefined) {
            resolve(res);
          } else {
            reject({ mes: "tt.request api error", res });
          }
        },
      });
    });
  },
  _upload(obj) {
    let { url, header, file_path } = obj;
    if (header === undefined) {
      header = {};
    }
    header["Content-Type"] = "multipart/form-data";
    return new Promise((resolve, reject) => {
      tt.uploadFile({
        url,
        filePath: file_path,
        name: "image",
        header,
        success: resolve,
        fail: res => {
          if (res.statusCode !== undefined) {
            resolve(res);
          } else {
            reject({ mes: "tt.uploadFile api failed", res });
          }
        },
      });
    });
  },
  _login_once() {
    return new Promise((resolve, reject) => {
      tt.login({
        success: async (res) => {
          try {
            const res1 = await this._request({
              url: `${this.url}/login`,
              method: "POST",
              header: { "Content-Type": "application/json; charset=utf-8" },
              data: { code: res.code }
            });
            if (res1.statusCode === 200) {
              this.token = res1.header.authorization;
              this.username = res1.data.name;
              this.avatar = res1.data.avatar;
              this.is_admin = res1.data.is_admin;
              this.open_id = res1.data.open_id;
            }
            resolve(res1);
          } catch (exception) {
            reject(exception);
          }
        },
        fail(res) {
          reject({ mes: "tt.login api error", res });
        }
      });
    });
  },
  _login() {
    let prev_promise = this.login_promise;
    if (prev_promise !== null) {
      return prev_promise;
    }
    let login_promise = this.login_promise = this._login_once().finally(() => { this.login_promise = null; });
    return login_promise;
  },
  _no_authentication(fun) {
    return async (obj) => {
      try {
        let res = await fun(obj);
        if (res.statusCode === 200) {
          return res.data;
        }
        throw { mes: "http error", res };
      } catch (exception) {
        throw exception;
      }
    }
  },
  _with_authentication(fun) {
    return async (obj) => {
      try {
        let res = null;
        if (this.token === "") {
          res = await this._login();
          if (res.statusCode !== 200) {
            throw { mes: "failed to login", res };
          }
        }
        if (obj.header === undefined) {
          obj.header = {};
        }
        obj.header.authentication = this.token;
        res = await fun(obj);
        if (res.statusCode === 200) {
          return res.data;
        }
        if (res.statusCode !== 401) {
          throw { mes: "http error", res };
        }
        // authentication expired
        res = await this._login();
        if (res.statusCode !== 200) {
          throw { mes: "failed to login", res };
        }
        obj.header.authentication = this.token;
        res = await fun(obj);
        if (res.statusCode === 200) {
          return res.data;
        }
        throw { mes: "http error", res };
      } catch (exception) {
        throw exception;
      }
    }
  },
  request({ url, method, header, data }) {
    return this._no_authentication(this._request)({ url, method, header, data });
  },
  upload({ url, file_path }) {
    return this._no_authentication(this._upload)({ url, file_path });
  },
  request_with_authentication({ url, method, header, data }) {
    return this._with_authentication(this._request)({ url, method, header, data });
  },
  upload_with_authentication({ url, file_path }) {
    return this._with_authentication(this._upload)({ url, file_path });
  },
  onLaunch() {
    var getStorage = key => {
      return new Promise((resolve, reject) => {
        tt.getStorage({
          "key": key,
          success: res => {
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
    Promise.all([getStorage("Azazel"), getStorage("Ariel"), getStorage("Asbeel"), getStorage("Samyaza"), getStorage("Samael")])
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
        this._login().then(res => {
          if (res.statusCode !== 200) {
            throw { mes: "failed to login", res };
          }
        }).catch(() => {
          console.error("failed to login");
        });
      });
    this._read_emoji_list();
    tt.hideTabBar({
      animation: false,
      fail(res) {
        console.error("hideTabBar fail", res);
      }
    });
    tt.getUpdateManager().onUpdateReady(() => {
      tt.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？\n\n若发现bug，可点击左上角反馈',
        success: res => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });
  },
  async storageInfo() {
    var setStorage = (key, data) => {
      return new Promise((resolve, reject) => {
        tt.setStorage({
          key: key,
          data: data,
          success: res => {
            resolve();
          },
          fail(res) {
            reject(res);
          }
        });
      });
    };
    try {
      await Promise.all([setStorage("Azazel", this.token), setStorage("Ariel", this.username), setStorage("Asbeel", this.avatar), setStorage("Samyaza", this.is_admin), setStorage("Samael", this.open_id)]);
    } catch (res) {
      console.error("failed to storage user data", res);
    }
  },
  async onHide() {
    await this.storageInfo();
  },
  async onUnload() {
    await this.storageInfo();
  },
  onPageNotFound() {
    tt.redirectTo({
      url: 'pages/index/index'
    })
  },
})
