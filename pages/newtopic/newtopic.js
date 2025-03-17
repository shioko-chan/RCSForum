Page({
  data: {
    center_item: true,
    is_anonymous: false,
    title: "",
    content: "",
    cursor: 0,
  },
  handleAnonymous() {
    this.setData({ is_anonymous: !this.data.is_anonymous });
  },
  handleStickerInput(event) {
    let { cursor, content } = this.data;
    this.setData({
      content:
        content.slice(0, cursor) + event.detail.sticker + content.slice(cursor),
      cursor: cursor + event.detail.sticker.length,
    });
  },
  handleTitleInput(event) {
    this.data.title = event.detail.value;
  },
  handleContentInput(event) {
    this.data.content = event.detail.value;
    this.data.cursor = event.detail.cursor;
  },
  handleContentBlur(event) {
    this.data.cursor = event.detail.cursor;
  },
  clearAll() {
    this.setData({ title: "foo", content: "foo", cursor: 3 });
    this.setData({
      is_anonymous: false,
      title: "",
      content: "",
      cursor: 0,
    });
    this.selectComponent("#image-selector").clearImage();
  },
  async handlePublish() {
    if (this.data.title.length === 0) {
      tt.showToast({
        title: "多少写个标题呗",
        icon: "none",
        duration: 2500,
      });
      return;
    }
    if (this.data.content.length === 0) {
      tt.showToast({
        title: "多少写点内容呗",
        icon: "none",
        duration: 2500,
      });
      return;
    }
    this.selectComponent("#image-selector")
      .uploadImage()
      .then((images) => {
        tt.showLoading({
          title: "发布中",
          mask: true,
        });
        getApp()
          .request_with_authentication({
            url: `${getApp().url}/create/topic`,
            header: { "Content-Type": "application/json; charset=utf-8" },
            method: "POST",
            data: {
              title: this.data.title,
              content: this.data.content,
              is_anonymous: this.data.is_anonymous,
              images,
            },
          })
          .then(() => {
            tt.showModal({
              title: "发布成功✅",
              showCancel: false,
            });
            this.clearAll();
          })
          .catch((res) => {
            console.error("request failed with error", res);
            tt.showModal({
              title: "发布失败😴",
              content: "请检查网络连接，该功能需要连接至实验室网络",
              showCancel: false,
            });
          })
          .finally(() => {
            tt.hideLoading();
          });
      });
  },
});
