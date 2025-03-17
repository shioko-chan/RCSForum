Page({
  data: {
    topic_list: [],
    page: 0,
    finished: false,
    top: 0,
    scroll_top: 0,
  },
  deleteFromList(event) {
    this.data.topic_list.splice(
      this.data.topic_list.findIndex((item) => item.pid === event.detail.pid),
      1
    );
    this.setData({ topic_list: this.data.topic_list });
  },
  showModalAllFinished() {
    tt.showModal({
      title: "已加载全部内容",
      confirmText: "确认",
      showCancel: false,
    });
  },
  async requestTopics(page) {
    try {
      const data = await getApp().request_with_authentication({
        url: `${getApp().url}/topic`,
        method: "GET",
        header: { "Content-Type": "application/json; charset=utf-8" },
        data: { page },
      });
      return data.topics;
    } catch (exception) {
      throw exception;
    }
  },
  handleTopicList(topics) {
    topics.forEach((topic) => {
      if (topic.is_anonymous) {
        topic.avatar = "/assets/images/anon.png";
        topic.name = "anonymous";
        if (!getApp().is_admin && topic.uid !== getApp().open_id) {
          topic.uid = "";
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
  setTopicList(topics) {
    topics = this.handleTopicList(topics);
    this.setData({ topic_list: topics });
  },
  pushTopicList(topics) {
    topics = this.handleTopicList(topics);
    this.setData({ topic_list: this.data.topic_list.concat(topics) });
  },
  getTopics() {
    tt.showLoading({
      title: "加载中",
      mask: true,
    });
    return this.requestTopics(this.data.page)
      .catch((res) => {
        console.error(res);
        getApp().show_network_error_modal(
          "请检查网络连接，需要连接至实验室网络"
        );
        return Promise.reject("network error");
      })
      .finally(() => {
        tt.hideLoading();
      });
  },
  onLoad() {
    this.getTopics()
      .then((topics) => {
        this.setTopicList(topics);
      })
      .catch(() => null);
  },
  handleScrollUpdate() {
    if (this.data.finished) {
      this.showModalAllFinished();
      return;
    }
    this.getTopics()
      .then((topics) => {
        this.pushTopicList(topics);
      })
      .catch(() => null);
  },
  handleScroll(event) {
    this.setData({ top: event.detail.scrollTop });
  },
  refresh() {
    this.data.page = 0;
    this.data.finished = false;
    this.setData({ scroll_top: this.data.top });
    this.setData({ scroll_top: 0 });
    return this.getTopics()
      .then((topics) => {
        this.setTopicList(topics);
      })
      .catch(() => null);
  },
  handleRefresh() {
    this.refresh();
  },
  onPullDownRefresh() {
    this.refresh().finally(() => {
      tt.stopPullDownRefresh();
    });
  },
});
