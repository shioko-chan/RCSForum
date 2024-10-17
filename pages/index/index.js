Page({
  data: {
    showEmojiArea: false,
    topic_list: [],
    page: 0,
    finished: false,
  },
  showModalFailToGetTopics: function () {
    tt.showModal({
      title: "获取话题列表失败",
      confirmText: "确认",
      showCancel: false,
    });
  },
  showModalAllFinished: function () {
    tt.showModal({
      title: "已加载全部内容",
      confirmText: "确认",
      showCancel: false,
    });
  },
  getTopics: function (page) {
    return new Promise((resolve, reject) => {
      var request = (cnt) => {
        tt.request({
          "url": `${getApp().url}/topic`,
          "method": "GET",
          "header": {
            "Content-Type": "application/json; charset=utf-8",
            "authentication": `${getApp().token}`
          },
          "data": { "page": page },
          success: res => {
            if (res.data.status === 0) {
              resolve(res.data.topics);
            } else if (res.data.status === 1 && cnt <= 0) {
              getApp().login()
                .then(() => request(cnt + 1))
                .catch(() => reject("failed to login"));
            } else {
              reject("failed to get topics, status code: " + res.data.status);
            }
          },
          fail: _ => {
            reject("failed to get topics due to network error");
          },
        });
      };
      if (getApp().token === "") {
        getApp().login()
          .then(() => request(0))
          .catch(() => reject("failed to login"));
      }
      else {
        request(0);
      }
    });
  },
  setTopicList: function (topics) {
    this.setData({ topic_list: topics, page: this.data.page + 1 });
    if (topics.length < getApp().page_size) {
      this.setData({ finished: true });
      this.showModalAllFinished();
    }
  },
  onLoad: function () {
    this.getTopics(this.data.page)
      .then(topics => { this.setTopicList(topics); })
      .catch(() => { this.showModalFailToGetTopics(); });
  },
  handleScrollUpdate: function () {
    if (finished) {
      this.showModalAllFinished();
      return;
    }
    this.getTopics(this.data.page).then(() => {
      this.setTopicList(this.data.topic_list.concat(res.data.topics));
    }).catch(() => { this.showModalFailToGetTopics(); });
  },
  handleRefresh: function () {
    this.setData({ page: 0, finished: false });
    this.getTopics(this.data.page)
      .then(topics => { this.setTopicList(topics); })
      .catch(() => { this.showModalFailToGetTopics(); });
  },
  handleEmoji: function () {
    this.setData({ showEmojiArea: !this.data.showEmojiArea });
  },
})
