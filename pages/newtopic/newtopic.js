Page({
  data: {
    showEmojiArea: false,
    centerItem: true,
    is_anonymous: false,
    title: "",
    content: "",
    images: [],
  },
  onLoad: function () {

  },
  handleAnonymous: function () {
    this.setData({ "is_anonymous": !this.data.is_anonymous });
  },
  handleTitleInput: function (e) {
    this.setData({ "title": e.detail.value });
  },
  handleContentInput: function (e) {
    this.setData({ "content": e.detail.value });
  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
    console.log(123);
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
        "duration": 2000,
        "icon": "none",
        "mask": false,
        success(res) {
          // console.log(JSON.stringify(res));
        },
        fail(res) {
          console.log(`showToast fail: ${JSON.stringify(res)}`);
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
        let compressPromises = result.tempFilePaths.map(
          tempFilePath => new Promise((resolve, reject) => {
            tt.compressImage({
              src: tempFilePath,
              quality: 30,
              success: (res) => {
                resolve(res.tempFilePath);
              },
              fail: (res) => {
                console.error('compressImage failed', res, tempFilePath)
                reject(res);
              }
            });
          })
        );
        that.allSettled(compressPromises).then(values => {
          let shouldShowToast = false;
          values.forEach(({ status, value }) => {
            if (status !== 'fulfilled') { return; }
            if (that.data.images.length < 9) {
              that.data.images.push(value);
            }
            else {
              shouldShowToast = true;
            }
          });
          if (shouldShowToast) {
            showToast();
          }
          that.setData({ "images": that.data.images });
        });
      },
      fail: (result) => {
        console.log("select image failed", result);
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
        title: "多少写个标题呗",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    if (this.data.content.length === 0) {
      tt.showToast({
        title: "多少写点内容呗",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    const url = getApp().url;
    tt.showLoading({
      title: '发布中',
      mask: true,
    });
    var successToast = () => {
      tt.hideLoading();
      tt.showToast({
        title: "发布成功✅",
        icon: "success",
        duration: 2000,
      });
    };
    var failToast = () => {
      tt.hideLoading();
      tt.showToast({
        title: "发布失败😴",
        icon: "error",
        duration: 2000,
      });
    };
    var imageUploadFailModal = (cnt, info) => {
      tt.hideLoading();
      tt.showModal({
        title: `第${cnt}个图片上传失败,${info}`,
        icon: "none",
        duration: 2000,
        showCancel: false,
      });
    };
    var uploadImage = (image, retry) => {
      return new Promise((resolve, reject) => {
        tt.uploadFile({
          "url": `${url}/image/upload`,
          "filePath": image,
          "name": "image",
          "header": { "authentication": getApp().token },
          success(res) {
            if (res.statusCode !== 200) { reject(); }
            else { resolve(JSON.parse(res.data)); }
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
        await this.allSettled(this.data.images.slice(i, i + 5).map((image) => uploadImage(image, 0)))) {
        if (status !== 'fulfilled') {
          if (value === null) {
            continue;
          }
          let { image, res } = value;
          console.error("an image upload failed", res);
          let detail = "";
          if (res.statusCode === 415) {
            detail = "格式不支持";
          }
          else if (res.statusCode === 406) {
            detail = "图片过大";
          }
          else if (res.statusCode === 500) {
            detail = "服务器错误";
          }
          imageUploadFailModal(this.data.images.indexOf(image) + 1, detail);
          return;
        }
        else {
          imageList.push(value);
        }
      }
    }
    var request = (cnt) => {
      tt.request({
        url: `${url}/create/topic`,
        header: { authentication: getApp().token },
        method: "POST",
        data: {
          title: this.data.title,
          content: this.data.content,
          is_anonymous: this.data.is_anonymous,
          images: imageList,
        },
        success: res => {
          if (res.data.status === 0) {
            successToast();
          }
          else if (res.data.status === 1 && cnt <= 0) {
            getApp().login()
              .then(() => request(cnt + 1))
              .catch(() => {
                failToast();
              });
          }
          else {
            failToast();
          }
        },
        fail: _ => {
          failToast();
        },
      });
    };
    request(0);
  }
})
