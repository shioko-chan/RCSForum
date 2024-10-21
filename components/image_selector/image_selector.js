Component({
  properties: {
  },
  data: {
    defaultStates: {},
    images: [],
  },
  methods: {
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
      const showImageTooManyToast = () => {
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
        showImageTooManyToast();
        return;
      }
      const that = this;
      const max_image_size = getApp().max_image_size;
      tt.chooseImage({
        count: 9 - that.data.images.length,
        sourceType: ['album', 'camera'],
        sizeType: ["original", "compressed"],
        success: result => {
          let compress_promises = result.tempFiles.map(
            (tempFile, index) => new Promise((resolve, reject) => {
              if (that.data.images.length + index >= 9) {
                reject({ "mes": "too many images", "index": index });
                return;
              }
              const selected_image_path = tempFile.path;
              const image_size = tempFile.size;
              if (!['jpg', 'jpeg'].includes(selected_image_path.split('.').pop())) {
                if (image_size > max_image_size * 1024 * 1024) {
                  reject({ "mes": "too large", "index": index });
                }
                else {
                  resolve({ "path": selected_image_path, "size": image_size });
                }
                return;
              }
              tt.compressImage({
                src: selected_image_path,
                quality: 30,
                success: res => {
                  const compressed_image_path = res.tempFilePath;
                  tt.getFileInfo({
                    filePath: compressed_image_path,
                    success: res => {
                      if (res.size > max_image_size * 1024 * 1024) {
                        reject({ "mes": "too large", "index": index });
                      }
                      else {
                        resolve({ "path": compressed_image_path, "size": res.size });
                      }
                    },
                    fail: res => {
                      console.error("getFileInfo after compress failed", res, compressed_image_path);
                      reject({ "mes": "compress failed", "index": index });
                    },
                  });
                },
                fail: res => {
                  console.error('compressImage failed', res, selected_image_path)
                  reject({ "mes": "compress failed", "index": index });
                }
              });
            })
          );
          Promise.all(compress_promises).then(values => {
            values.forEach(({ path, size }) => {
              that.data.images.push(path);
            });
            that.setData({ "images": that.data.images });
          }).catch(({ mes, index }) => {
            if (mes === "compress failed") {
              tt.showModal({
                "title": `图片选择失败`,
                "content": `所选择的第${index + 1}个图片读取失败`,
                "icon": "none",
                "showCancel": false,
              });
            }
            else if (mes === "too many images") {
              showImageTooManyToast();
            } else if (mes === "too large") {
              tt.showModal({
                "title": `第${index + 1}个图片上传失败`,
                "content": `图片大小上限${max_image_size}MB`,
                "icon": "none",
                "showCancel": false,
              });
            }
          });
        },
        fail: result => {
          if (result.errMsg === "chooseImage:fail user cancel") {
            return;
          }
          tt.showModal({
            "title": "选择图片出错",
            "content": result.errMsg.split(":")[1],
            "confirmText": "确认",
            "showCancel": false,
            fail: res => {
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
      });
    },
    removeImage: function (event) {
      const index = event.currentTarget.dataset.index;
      this.data.images.splice(index, 1);
      this.setData({ "images": this.data.images });
    },
    uploadImage: function () {
      let progress = 0;
      const progress_total = this.data.images.length;
      const url = getApp().url;
      var uploadImage = async (image, retry) => {
        try {
          const res = await new Promise((resolve, reject) => {
            tt.uploadFile({
              "url": `${url}/image/upload`,
              "filePath": image,
              "name": "image",
              "header": {
                "Content-Type": "multipart/form-data",
                "authentication": getApp().token
              },
              success: resolve,
              fail: reject,
            });
          });
          if (res.statusCode === 200) {
            progress += 1;
            tt.showLoading({
              "title": `上传中..${progress}/${progress_total}`,
              "mask": true,
            });
            return JSON.parse(res.data);
          }
          else {
            throw res;
          }
        } catch (res) {
          if (res.statusCode === 401 && retry <= 0) {
            return getApp().login()
              .then(() => uploadImage(image, retry + 1))
              .catch(() => { throw { image, "res": "authenticate error" }; });
          } else {
            throw { image, res };
          }
        }
      };
      tt.showLoading({
        "title": `上传中..${progress}/${progress_total}`,
        "mask": true,
      });
      const max_image_size = getApp().max_image_size;
      return Promise.all(this.data.images.map(image => uploadImage(image, 0))).catch(({ image, res }) => {
        let detail = "";
        console.error("an image upload failed", res);
        if (res === "authenticate error") {
          console.error("reject because of authenticate error");
          detail = "认证出错";
        } else if (res.statusCode === 413 || res.statusCode === 406) {
          detail = `图片大小上限${max_image_size}MB`;
        } else if (res.statusCode === 415) {
          detail = "格式不支持";
        }
        else if (res.statusCode === 500) {
          detail = "服务器错误";
        }
        else {
          detail = res.statusCode;
        }
        tt.showModal({
          "title": `第${this.data.images.indexOf(image) + 1}个图片上传失败`,
          "content": detail,
          "icon": "none",
          "showCancel": false,
        });
      }).finally(() => { tt.hideLoading(); });
    },
    clearImage: function () {
      this.setData({ "images": [] });
    }
  }
})