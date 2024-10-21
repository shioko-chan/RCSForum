Page({
  data: {
    centerItem: true,
    is_anonymous: false,
    title: "",
    content: "",
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
    this.data.title = event.detail.value;
  },
  handleContentInput: function (event) {
    this.data.content = event.detail.value;
    this.data.cursor = event.detail.cursor;
  },
  handleContentBlur: function (event) {
    this.data.cursor = event.detail.cursor;
  },
  clearAll: function () {
    this.setData({
      "is_anonymous": false,
      "title": "",
      "content": "",
      "cursor": 0,
    });
    this.selectComponent("#image-selector").clearImage();
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
  handlePublish: async function () {
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
    let image_list = [];
    var request = (cnt) => {
      tt.request({
        url: `${url}/create/topic`,
        header: {
          "Content-Type": "application/json; charset=utf-8",
          "authentication": getApp().token
        },
        method: "POST",
        data: {
          title: this.data.title,
          content: this.data.content,
          is_anonymous: this.data.is_anonymous,
          images: image_list,
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
    this.selectComponent("#image-selector").uploadImage()
      .then(image_list_res => {
        image_list = image_list_res;
        tt.showLoading({
          title: '发布中',
          mask: true,
        });
        request(0);
      })
      .catch(() => {
        tt.showModal({
          "title": "图片上传失败",
          "showCancel": false,
        });
      });
  }
})
