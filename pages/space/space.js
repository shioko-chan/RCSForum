Page({
  data: {
    avatar: '',
    name: '',
    nav_item2: true,
    topic_list: [],
  },
  deleteFromList(event) {
    this.data.topic_list.splice(this.data.topic_list.findIndex(
      item => item.pid === event.detail.pid
    ), 1);
    this.setData({ topic_list: this.data.topic_list });
  },
  onLoad() {
    this.setData({
      avatar: getApp().avatar,
      name: getApp().username,
    });
    tt.showLoading({ title: "加载中...", mask: true });
    getApp().request_with_authentication({
      url: `${getApp().url}/user/${getApp().open_id}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" },
    }).then(data => {
      this.setData({
        topic_list: data.topics.map(topic => {
          topic.uid = getApp().open_id;
          return topic;
        })
      });
    }).finally(() => tt.hideLoading());
  },
})
