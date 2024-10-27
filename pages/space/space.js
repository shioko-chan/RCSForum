Page({
  data: {
    avatar: '',
    name: '',
    nav_item2: true,
    topic_list: [],
  },
  deleteFromList(event) {
    this.data.topic_list.splice(this.data.topic_list.findIndex(item => item.pid === event.detail.pid), 1);
    this.setData({ topic_list: this.data.topic_list });
  },
  onLoad() {
    var app = getApp();
    this.setData({
      avatar: app.avatar,
      name: app.username,
    });
    tt.showLoading({ title: "加载中...", mask: true });
    getApp().request_with_authentication({
      url: `${app.url}/user/${app.open_id}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" },
    }).then(data => {
      this.setData({ topic_list: data.topics });
    }).finally(() => tt.hideLoading());
  },
})
