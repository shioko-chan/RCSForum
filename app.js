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
  modal_promise: null,
  stickers: [
    {
      "name": "I_AM_TRASH",
      "url": "/assets/sticker/trashbin.png"
    },
    {
      "name": "CAR",
      "url": "/assets/sticker/car.jpg"
    },
    {
      "name": "SHOW_IT_TO_ME",
      "url": "/assets/sticker/show.jpg"
    },
    {
      "name": "LYING_FLAT",
      "url": "/assets/sticker/lyingflat.jpg"
    },
    {
      "name": "I_AM_DEPRESSED",
      "url": "/assets/sticker/depress.jpg"
    },
    {
      "name": "LUCKY",
      "url": "/assets/sticker/lucky.gif"
    },
    {
      "name": "NO_PROBLEM",
      "url": "/assets/sticker/noproblem.jpg"
    },
    {
      "name": "BLANK_BRAIN",
      "url": "/assets/sticker/brainblank.jpg"
    },
    {
      "name": "SELF_CONSCIOUS",
      "url": "/assets/sticker/selfconscious.jpg"
    },
    {
      "name": "NOW_WONDERING",
      "url": "/assets/sticker/nowimaging.jpg"
    },
    {
      "name": "ME_QMARK",
      "url": "/assets/sticker/itsmeqmark.jpg"
    },
    {
      "name": "S_ATTRIBUTE",
      "url": "/assets/sticker/sattribute.jpg"
    },
    {
      "name": "CALM_DOWN",
      "url": "/assets/sticker/calm.jpg"
    },
    {
      "name": "SPEECHLESS",
      "url": "/assets/sticker/speechless.jpg"
    },
    {
      "name": "LICKING",
      "url": "/assets/sticker/licking.gif"
    },
    {
      "name": "INNOCENT",
      "url": "/assets/sticker/innocent.gif"
    },
    {
      "name": "WONDERING",
      "url": "/assets/sticker/wondering.gif"
    },
    {
      "name": "CRY",
      "url": "/assets/sticker/cry.png"
    },
    {
      "name": "PLEASANT",
      "url": "/assets/sticker/pleased.gif"
    },
    {
      "name": "OH_CAPITAL",
      "url": "/assets/sticker/ohcapital.png"
    },
    {
      "name": "LAUGHING",
      "url": "/assets/sticker/laughing.gif"
    },
    {
      "name": "SCRATCH_HEAD",
      "url": "/assets/sticker/scratch.gif"
    },
    {
      "name": "SHOCKED",
      "url": "/assets/sticker/shocking.gif"
    },
    {
      "name": "QUESTION",
      "url": "/assets/sticker/question.jpg"
    },
    {
      "name": "WOW",
      "url": "/assets/sticker/wow.gif"
    },
    {
      "name": "LOVE",
      "url": "/assets/sticker/love.gif"
    },
    {
      "name": "FORGE_IRON",
      "url": "/assets/sticker/forgeiron.png"
    },
    {
      "name": "WTF_MEME",
      "url": "/assets/sticker/wtfmeme.png"
    },
    {
      "name": "ADMIRE",
      "url": "/assets/sticker/admire.jpg"
    },
    {
      "name": "IS_THAT_PRACTICAL",
      "url": "/assets/sticker/practical.png"
    },
    {
      "name": "EMBARRASSED",
      "url": "/assets/sticker/embarrassed.jpg"
    },
    {
      "name": "YOU_ARE_EXTRAORDINARY",
      "url": "/assets/sticker/extraordinary.jpg"
    },
    {
      "name": "DONT_WANT_WORK",
      "url": "/assets/sticker/nowork.jpg"
    },
    {
      "name": "TANG",
      "url": "/assets/sticker/tang.jpg"
    },
    {
      "name": "NERD",
      "url": "/assets/sticker/nerdy.jpg"
    },
    {
      "name": "HAVE_PARTY",
      "url": "/assets/sticker/party.jpg"
    },
    {
      "name": "LOYAL",
      "url": "/assets/sticker/loyal.jpg"
    },
    {
      "name": "TEHEBERINKO",
      "url": "/assets/sticker/teheberinko.jpg"
    },
    {
      "name": "EXP_INC_3",
      "url": "/assets/sticker/expinc3.jpg"
    },
    {
      "name": "ULTRA_SKILL",
      "url": "/assets/sticker/ultraskill.gif"
    }, {
      "name": "WONDERING_2",
      "url": "/assets/sticker/wondering.jpg"
    }, {
      "name": "SPEECHLESS_2",
      "url": "/assets/sticker/speechless2.jpg"
    }
  ],
  set_once_storage(data) {
    this.once_storage = data;
  },
  _request({ url, method, header, data }) {
    return new Promise((resolve, reject) => {
      tt.request({
        url, method, header, data,
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
        url, filePath: file_path, name: "image", header,
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
  _show_modal({ title, content, confirmText = "确认", showCancel = false }) {
    const new_promise = () =>
      new Promise((resolve, reject) =>
        tt.showModal({
          title,
          content,
          confirmText,
          showCancel,
          success: resolve,
          fail: reject,
        })
      );
    this.modal_promise?.then(() => new_promise());
    if (this.modal_promise === null) {
      this.modal_promise = new_promise().finally(() => { this.modal_promise = null });
    }
  },
  show_network_error_modal(mes) {
    this._show_modal({ title: "已断开与服务器的连接", content: mes, });
  },
  onLaunch() {
    var getStorage = key => {
      return new Promise((resolve, reject) => {
        tt.getStorage({
          "key": key,
          success: res => {
            if (res.data) {
              resolve(res.data);
            } else {
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
    tt.hideTabBar({
      animation: false,
      fail(res) {
        console.error("hideTabBar fail", res);
      }
    });
    this._show_modal({
      title: '欢迎使用RCS论坛',
      content: '若发现bug或有功能方面的建议，可点击右上角反馈',
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
