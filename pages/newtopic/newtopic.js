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
    var showToast = function () {
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
    var that = this;
    tt.chooseImage({
      count: 9,
      sourceType: ['album', 'camera'],
      success: (result) => {
        let compressPromises = result.tempFilePaths.map((tempFilePath) => {
          return new Promise((resolve, reject) => {
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
          });
        });
        Promise.allSettled(compressPromises).then((values) => {
          let shouldShowToast = false;
          values.forEach((value) => {
            console.log(value);
            if (value.status === 'fulfilled') {
              if (that.data.images.length < 9) {
                that.data.images.push(value.value);
              }
              else {
                shouldShowToast = true;
              }
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
  }
})
