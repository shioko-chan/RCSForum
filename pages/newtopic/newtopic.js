Page({
  data: {
    centerItem: true,
    is_anonymous: false,
    title: "",
    content: "",
    images: [],
    cursor: 0,
  },
  handleAnonymous: function () {
    this.setData({ "is_anonymous": !this.data.is_anonymous });
  },
  handleEmojiInput: function (event) {
    let { cursor, content } = this.data;
    this.setData({
      "content": content.slice(0, cursor) + event.detail.emoji + content.slice(cursor),
      "cursor": cursor + event.detail.emoji.length
    });
  },
  handleTitleInput: function (event) {
    this.setData({ "title": event.detail.value });
  },
  handleContentInput: function (event) {
    this.setData({ "content": event.detail.value });
  },
  handleContentBlur: function (event) {
    this.setData({ "cursor": event.detail.cursor });
  },
  clearAll: function () {
    this.setData({
      "is_anonymous": false,
      "title": "",
      "content": "",
      "images": [],
    });
  },
  allSettled: function (promises) {
    return Promise.all(
      promises.map(
        promise => promise
          .then(value => ({ "status": "fulfilled", "value": value }))
          .catch(reason => ({ "status": "rejected", "value": reason }))
      )
    );
  },
  chooseImage: function () {
    const showToast = () => {
      tt.showToast({
        "title": "上传图片上限9张",
        "duration": 2500,
        "icon": "none",
        "mask": true,
        fail(res) {
          console.error(`showToast fail: ${JSON.stringify(res)}`);
        }
      });
    };
    if (this.data.images.length >= 9) {
      showToast();
      return;
    }
    const that = this;
    tt.chooseImage({
      count: 9,
      sourceType: ['album', 'camera'],
      success: (result) => {
        let compressPromises = result.tempFiles.map(
          (tempFile, index) => new Promise((resolve, reject) => {
            const tempFilePath = tempFile.path;
            const fileSize = tempFile.size;
            console.log(`图片大小为 ${fileSize} 字节`);
            if (fileSize > 5 * 1024 * 1024) {
              reject(index);
            }

            tt.compressImage({
              src: tempFilePath,
              quality: 30,
              success: (res) => {
                resolve(res.tempFilePath);
              },
              fail: (res) => {
                console.error('compressImage failed', res, tempFilePath)
                reject(index);
              }
            });
          })
        );
        that.allSettled(compressPromises).then(values => {
          values.forEach(({ status, value }) => {
            if (status !== 'fulfilled') {
              tt.showModal({
                "title": `第${value + 1}个图片上传失败`,
                "content": "图片大小上限5MB",
                "icon": "none",
                "showCancel": false,
              });
            }
            else {
              that.data.images.push(value);
            }
          });
          that.setData({ "images": that.data.images });
        });
      },
      fail: (result) => {
        tt.showModal({
          "title": "选择图片出错",
          "content": "请检查读取图片权限",
          "confirmText": "确认",
          "showCancel": false,
          fail(res) {
            console.error(`showToast fail: ${JSON.stringify(res)}`);
          }
        });
        console.error("select image failed", result);
      }
    });
  },
  previewImage: function (event) {
    const index = event.currentTarget.dataset.index;
    const imageList = this.data.images;
    const currentImage = this.data.images[index];
    tt.previewImage({
      urls: imageList,
      current: currentImage,
      shouldShowSaveOption: false,
    })
  },
  removeImage: function (event) {
    const index = event.currentTarget.dataset.index;
    this.data.images.splice(index, 1);
    this.setData({ "images": this.data.images });
  },
  handlePublish: async function (event) {
    if (this.data.title.length === 0) {
      tt.showToast({
        "title": "多少写个标题呗",
        "icon": "none",
        "duration": 2500,
      });
      return;
    }
    if (this.data.content.length === 0) {
      tt.showToast({
        "title": "多少写点内容呗",
        "icon": "none",
        "duration": 2500,
      });
      return;
    }
    const url = getApp().url;
    tt.showLoading({
      title: '发布中',
      mask: true,
    });
    var imageUploadFailModal = (cnt, info) => {
      tt.hideLoading();
      tt.showModal({
        "title": `第${cnt}个图片上传失败`,
        "content": info,
        "icon": "none",
        "showCancel": false,
      });
    };
    var uploadImage = (image, retry) => {
      return new Promise((resolve, reject) => {
        tt.uploadFile({
          "url": `${url}/image/upload`,
          "filePath": image,
          "name": "image",
          "header": {
            "Content-Type": "multipart/form-data",
            "authentication": `${getApp().token}`
          },
          success(res) {
            if (res.statusCode === 200) {
              resolve(JSON.parse(res.data));
            } else if (res.statusCode === 401 && retry <= 0) {
              getApp().login()
                .then(() => uploadImage(image, retry + 1))
                .catch(() => reject(null));
            } else {
              reject({ image, res });
            }
          },
          fail(res) {
            if (res.statusCode === 401 && retry <= 0) {
              getApp().login()
                .then(() => uploadImage(image, retry + 1))
                .catch(() => reject(null));
            } else {
              reject({ image, res });
            }
          }
        });
      });
    };
    let imageList = [];
    for (let i = 0; i < this.data.images.length; i += 5) {
      for (let { status, value } of
        (await this.allSettled(this.data.images.slice(i, i + 5).map(image => uploadImage(image, 0))))) {
        if (status !== 'fulfilled') {
          if (value === null) {
            console.error("reject because of authenticate error");
            imageUploadFailModal(-1, "认证出错");
            return;
          }
          let { image, res } = value;
          console.error("an image upload failed", res);
          let detail = "";
          if (res.statusCode === 413) {
            detail = "图片大小上限5MB";
          } else if (res.statusCode === 415) {
            detail = "格式不支持";
          }
          else if (res.statusCode === 406) {
            detail = "图片大小上限5MB";
          }
          else if (res.statusCode === 500) {
            detail = "服务器错误";
          }
          else {
            detail = res.statusCode;
          }
          imageUploadFailModal(this.data.images.indexOf(image) + 1, detail);
          return;
        }
        else {
          imageList.push(value);
        }
      }
    }
    var successCall = () => {
      tt.hideLoading();
      tt.showModal({
        "title": "发布成功✅",
        "showCancel": false,
      });
      this.clearAll();
    };
    var failCall = () => {
      tt.hideLoading();
      tt.showModal({
        "title": "发布失败😴",
        "showCancel": false,
      });
    };
    var request = cnt => {
      tt.request({
        url: `${url}/create/topic`,
        header: {
          "Content-Type": "application/json; charset=utf-8",
          "authentication": `${getApp().token}`
        },
        method: "POST",
        data: {
          title: this.data.title,
          content: this.data.content,
          is_anonymous: this.data.is_anonymous,
          images: imageList,
        },
        success: res => {
          if (res.data.status === 0) {
            successCall();
          } else if (res.data.status === 1 && cnt <= 0) {
            getApp().login()
              .then(() => request(cnt + 1))
              .catch(() => {
                failCall();
              });
          } else {
            failCall();
          }
        },
        fail: res => {
          if (res.data.status === 1 && cnt <= 0) {
            getApp().login()
              .then(() => request(cnt + 1))
              .catch(() => {
                failCall();
              });
          } else {
            failCall();
          }
        },
      });
    };
    request(0);
  }
})
