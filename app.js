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
      name: "I_AM_TRASH",
      url: "/assets/sticker/trashbin.png"
    },
    {
      name: "CAR",
      url: "/assets/sticker/car.jpg"
    },
    {
      name: "SHOW_IT_TO_ME",
      url: "/assets/sticker/show.jpg"
    },
    {
      name: "LYING_FLAT",
      url: "/assets/sticker/lyingflat.jpg"
    },
    {
      name: "I_AM_DEPRESSED",
      url: "/assets/sticker/depress.jpg"
    },
    {
      name: "LUCKY",
      url: "/assets/sticker/lucky.gif"
    },
    {
      name: "NO_PROBLEM",
      url: "/assets/sticker/noproblem.jpg"
    },
    {
      name: "BLANK_BRAIN",
      url: "/assets/sticker/brainblank.jpg"
    },
    {
      name: "SELF_CONSCIOUS",
      url: "/assets/sticker/selfconscious.jpg"
    },
    {
      name: "NOW_WONDERING",
      url: "/assets/sticker/nowimaging.jpg"
    },
    {
      name: "ME_QMARK",
      url: "/assets/sticker/itsmeqmark.jpg"
    },
    {
      name: "S_ATTRIBUTE",
      url: "/assets/sticker/sattribute.jpg"
    },
    {
      name: "CALM_DOWN",
      url: "/assets/sticker/calm.jpg"
    },
    {
      name: "SPEECHLESS",
      url: "/assets/sticker/speechless.jpg"
    },
    {
      name: "LICKING",
      url: "/assets/sticker/licking.gif"
    },
    {
      name: "INNOCENT",
      url: "/assets/sticker/innocent.gif"
    },
    {
      name: "WONDERING",
      url: "/assets/sticker/wondering.gif"
    },
    {
      name: "CRY",
      url: "/assets/sticker/cry.png"
    },
    {
      name: "PLEASANT",
      url: "/assets/sticker/pleased.gif"
    },
    {
      name: "OH_CAPITAL",
      url: "/assets/sticker/ohcapital.png"
    },
    {
      name: "LAUGHING",
      url: "/assets/sticker/laughing.gif"
    },
    {
      name: "SCRATCH_HEAD",
      url: "/assets/sticker/scratch.gif"
    },
    {
      name: "SHOCKED",
      url: "/assets/sticker/shocking.gif"
    },
    {
      name: "QUESTION",
      url: "/assets/sticker/question.jpg"
    },
    {
      name: "WOW",
      url: "/assets/sticker/wow.gif"
    },
    {
      name: "LOVE",
      url: "/assets/sticker/love.gif"
    },
    {
      name: "FORGE_IRON",
      url: "/assets/sticker/forgeiron.png"
    },
    {
      name: "WTF_MEME",
      url: "/assets/sticker/wtfmeme.png"
    },
    {
      name: "ADMIRE",
      url: "/assets/sticker/admire.jpg"
    },
    {
      name: "IS_THAT_PRACTICAL",
      url: "/assets/sticker/practical.png"
    },
    {
      name: "EMBARRASSED",
      url: "/assets/sticker/embarrassed.jpg"
    },
    {
      name: "YOU_ARE_EXTRAORDINARY",
      url: "/assets/sticker/extraordinary.jpg"
    },
    {
      name: "DONT_WANT_WORK",
      url: "/assets/sticker/nowork.jpg"
    },
    {
      name: "TANG",
      url: "/assets/sticker/tang.jpg"
    },
    {
      name: "NERD",
      url: "/assets/sticker/nerdy.jpg"
    },
    {
      name: "HAVE_PARTY",
      url: "/assets/sticker/party.jpg"
    },
    {
      name: "LOYAL",
      url: "/assets/sticker/loyal.jpg"
    },
    {
      name: "TEHEBERINKO",
      url: "/assets/sticker/teheberinko.jpg"
    },
    {
      name: "EXP_INC_3",
      url: "/assets/sticker/expinc3.jpg"
    },
    {
      name: "ULTRA_SKILL",
      url: "/assets/sticker/ultraskill.gif"
    }, {
      name: "WONDERING_2",
      url: "/assets/sticker/wondering.jpg"
    }, {
      name: "SPEECHLESS_2",
      url: "/assets/sticker/speechless2.jpg"
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
  async _login_once() {
    try {
      const code = await new Promise((resolve, reject) => {
        tt.login({
          success: res => {
            resolve(res.code);
          },
          fail: res => {
            reject({ mes: "tt.login api error", res });
          }
        });
      });
      return await this._request({
        url: `${this.url}/login`,
        method: "POST",
        header: { "Content-Type": "application/json; charset=utf-8" },
        data: { code }
      });
    } catch (exception) {
      throw exception;
    }
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
      const set_info = ([token, username, avatar, is_admin, open_id]) => {
        const ref_keys = ["token", "username", "avatar", "is_admin", "open_id"];
        const value = [token, username, avatar, is_admin, open_id];
        ref_keys.forEach((ref_key, index) => {
          this[ref_key] = value[index];
        });
      };
      const solve_res = res => {
        const authentication = res.header.authentication;
        const { name, avatar, is_admin, open_id } = res.data;
        return [authentication, name, avatar, is_admin, open_id];
      };
      try {
        let res = null;
        if (this.token === "") {
          try {
            res = await this._get_info_local();
          } catch (err) {
            console.warn("load data from local storage failed, ", err);
            console.info("get info from server");
            res = await this._login();
            if (res.statusCode !== 200) {
              throw { mes: "failed to login", res };
            }
            const list = solve_res(res);
            set_info(list);
            this._storage_info(list);
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
        const list = solve_res(res);
        set_info(list);
        this._storage_info(list);

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
  _get_info_local() {
    var getStorage = key => {
      return new Promise((resolve, reject) => {
        tt.getStorage({
          key, success: res => {
            if (res.data !== undefined && res.data !== "") {
              resolve(res.data);
            } else {
              reject(`no ${key} in storage`);
            }
          }, fail: reject
        });
      })
    };
    const name = ["Azazel", "Ariel", "Asbeel", "Samyaza", "Samael"];
    const ref_keys = ["token", "username", "avatar", "is_admin", "open_id"];
    return Promise.all(name.map(item => getStorage(item))).then(items => {
      console.info("get info from local storage");
      items.forEach((item, index) => {
        this[ref_keys[index]] = item;
      });
    });
  },
  _check_filesystem_size() {
    const fileSystemManager = tt.getFileSystemManager();
    const path = "ttfile://user/image";
    (new Promise((resolve, reject) => {
      fileSystemManager.access({
        path,
        success: resolve,
        fail: reject,
      });
    })).then(() => {
      return new Promise((resolve, reject) => {
        fileSystemManager.stat({
          path,
          success: resolve,
          fail: reject,
        });
      });
    }).then(res => {
      if (res.stat.size >= 200 * 1024 * 1024) {
        fileSystemManager.rmdir({
          dirPath: path,
          recursive: true,
          success(res) {
            console.log(`rmdir success: ${JSON.stringify(res)}`);
          },
          fail(res) {
            console.error(`rmdir fail: ${JSON.stringify(res)}`);
          }
        });
        throw {};
      }
    }).catch(() =>
      fileSystemManager.mkdir({
        dirPath: path,
        recursive: false,
        success(_res) {
          console.log(`${path} 创建成功`);
        },
        fail(res) {
          console.log(`${path} 创建失败`, res.errMsg);
        }
      })
    )


  },
  onLaunch() {
    this._check_filesystem_size();
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
    try {
      const updateManager = tt.getUpdateManager();
      updateManager.onUpdateReady(async () => {
        this._show_modal({
          title: '存在更新',
          content: '将要重启小程序以应用更新',
        });
        await this.modal_promise;
        updateManager.applyUpdate();
      });
      updateManager.onUpdateFailed(() => {
        this._show_modal({
          title: '更新失败',
          content: '小程序获取更新失败，请检查网络连接',
        });
      });
      setInterval(() => updateManager.triggerCheckUpdate(), 60 * 60 * 1000)
    } catch (error) {
      console.error(`getUpdateManager fail: ${JSON.stringify(error)}`);
    }
  },
  _storage_info([token, username, avatar, is_admin, open_id]) {
    var setStorage = (key, data) => {
      return new Promise((resolve, reject) => {
        tt.setStorage({ key, data, success: resolve, fail: reject });
      });
    };
    const name = ["Azazel", "Ariel", "Asbeel", "Samyaza", "Samael"];
    const value = [token, username, avatar, is_admin, open_id];
    return Promise.all(
      value.map((item, index) => setStorage(name[index], item))
    );
  },
  onPageNotFound() {
    tt.redirectTo({
      url: 'pages/index/index'
    });
  },
})
