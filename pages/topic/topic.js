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
    getApp().request_with_authentication({
      url: `${getApp().url}/comment/${data.pid}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" },
    }).then(data => {
      this.setData({ "comment_list": data.comments });
    }).catch(({ mes, res }) => {
      console.error(mes, res);
      tt.showToast({
        "title": "获取评论失败",
        "icon": "error",
        "duration": 2500,
      })
    });
  },
  handleReply: function (event) {
    this.selectComponent("#bottom-bar").focusReply(event.detail);
  },
  handleEmoji: function () {
    this.setData({ "showEmojiArea": !this.data.showEmojiArea });
  }
})
