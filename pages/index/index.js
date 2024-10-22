Page({
  data: {
    showEmojiArea: false,
    topic_list: [],
    page: 0,
    finished: false,
    top: 0,
    scroll_top: 0,
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
  requestTopics: async function (page) {
    try {
      const data = await getApp().request_with_authentication({
        url: `${getApp().url}/topic`,
        method: "GET",
        header: { "Content-Type": "application/json; charset=utf-8" },
        data: { page: page }
      });
      return data.topics;
    } catch (exception) {
      throw exception;
    }
  },
  handleTopicList: function (topics) {
    const is_admin = getApp().is_admin;
    topics.forEach(topic => {
      if (topic.is_anonymous) {
        topic.avatar = '/assets/images/anon.png';
        topic.name = 'anonymous';
        if (!is_admin) {
          topic.uid = '';
        }
      }
    });
    this.data.page += 1;
    if (topics.length === 0) {
      this.data.finished = true;
      this.showModalAllFinished();
    }
    return topics;
  },
  setTopicList: function (topics) {
    topics = this.handleTopicList(topics);
    this.setData({ topic_list: topics });
  },
  pushTopicList: function (topics) {
    topics = this.handleTopicList(topics);
    this.setData({ topic_list: this.data.topic_list.concat(topics) });
  },
  getTopics: function () {
    tt.showLoading({
      title: '加载中',
      mask: true
    });
    return this.requestTopics(this.data.page)
      .catch(res => { console.error(res); this.showModalFailToGetTopics(); Promise.reject(); })
      .finally(() => { tt.hideLoading(); });
  },
  onLoad: function () {
    this.getTopics().then(topics => { this.setTopicList(topics); });
  },
  handleScrollUpdate: function () {
    if (this.data.finished) {
      this.showModalAllFinished();
      return;
    }
    this.getTopics().then(topics => { this.pushTopicList(topics); });
  },
  handleScroll: function (event) {
    this.setData({ top: event.detail.scrollTop });
  },
  handleRefresh: function () {
    this.data.page = 0;
    this.data.finished = false;
    this.setData({ scroll_top: this.data.top });
    this.setData({ scroll_top: 0 });
    this.getTopics().then(topics => { this.setTopicList(topics); });
  },
  onPullDownRefresh: function () {
    this.handleRefresh();
  }
})
