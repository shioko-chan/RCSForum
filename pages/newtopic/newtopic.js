Page({
  data: {
    showEmojiArea: false,
    centerItem: true,
    images: [],
  },
  onLoad: function () {

  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
    console.log(123);
  },
  chooseImage: function () {
    const allSettled = promises => Promise.all(
      promises.map(
        promise => promise
          .then(value => ({ status: 'fulfilled', value }))
          .catch(reason => ({ status: 'rejected', reason }))
      )
    );
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
                console.log(res.tempFilePath);
                resolve(res.tempFilePath);
              },
              fail: (res) => {
                console.error('compressImage failed', res, tempFilePath)
                reject(res);
              }
            });
          })
        );
        allSettled(compressPromises).then((values) => {
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
  }
})
