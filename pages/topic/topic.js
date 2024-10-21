Page({
  data: {
    poster: null,
    comment_list: [],
    index_1: -1,
    toward: "",
  },
  onLoad: function () {
    const data = getApp().once_storage;
    this.setData({ "poster": data });
    const showModalFailToGetComments = () => {
      tt.showToast({
        "title": "获取评论失败",
        "icon": "error",
        "duration": 2500,
      })
    }
    const req = cnt => {
      tt.request({
        "url": `${getApp().url}/comment/${data.pid}`,
        "method": "GET",
        "header": {
          "Content-Type": "application/json; charset=utf-8",
          "authentication": `${getApp().token}`
        },
        success: res => {
          if (res.data.status === 0) {
            this.setData({ "comment_list": res.data.comments });
          } else if (res.data.status === 1 && cnt <= 0) {
            getApp().login()
              .then(() => req(cnt + 1))
              .catch(() => showModalFailToGetComments());
          } else {
            showModalFailToGetComments();
          }
        },
        fail: res => {
          if (res.statusCode === 401 && cnt <= 0) {
            getApp().login()
              .then(() => req(cnt + 1))
              .catch(() => showModalFailToGetComments());
          } else {
            showModalFailToGetComments();
          }
        },
      })
    };
    req(0);
  },
  handleReply: function (event) {
    this.selectComponent("#bottom-bar").focusReply(event.detail.toward, event.detail.index_1);
  },
  handleEmoji: function () {
    this.setData({ "showEmojiArea": !this.data.showEmojiArea });
  },
  handleScrollUpdate: function () {
    console.log("scrolled");
  }
})
