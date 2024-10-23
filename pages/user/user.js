Page({
  data: {
    avatar: '',
    name: '',
    nav_item2: true,
    topic_list: [],
  },
  onLoad() {
    getApp().request_with_authentication({
      url: `${app.url}/user/${app.open_id}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" }
    })
      .then(data => { this.setData({ "topic_list": data.topics }); })
      .catch(({ mes, res }) => { console.error(mes, res) });
  },
})
