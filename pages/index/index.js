Page({
  data: {
    showEmojiArea: false,
    topic_list: [],
    page: 0,
    finished: false,
  },
  onLoad: function () {
    tt.request({
      "url": `${getApp().url}/topic`,
      "method": "GET",
      "header": { authentication: getApp().token },
      "data": { "page": this.data.page },
      success: res => {
        this.setData({ topic_list: res.data.topics, page: this.data.page + 1 });
        if (res.data.topics.length < getApp().page_size) {
          this.setData({ finished: true });
        }
      },
      fail: _ => {
        tt.showModal({
          title: "获取话题列表失败",
          confirmText: "确认",
          showCancel: false,
        });
      },
    });
  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
  },
  handleScrollUpdate: function () {
    if (finished) {
      return;
    }
    tt.request({
      "url": `${getApp().url}/topic`,
      "method": "GET",
      "header": { authentication: getApp().token },
      "data": { "page": this.data.page },
      success: res => {
        this.setData({ topic_list: this.data.topic_list.concat(res.data.topics), page: this.data.page + 1 });
        if (res.data.topics.length < getApp().page_size) {
          this.setData({ finished: true });
        }
      },
      fail: _ => {
        tt.showModal({
          title: "获取话题列表失败",
          confirmText: "确认",
          showCancel: false,
        });
      },
    });
  }
})
