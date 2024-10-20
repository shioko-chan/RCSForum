Page({
  data: {
    avatar: '',
    name: '',
    navItem2: true,
    topic_list: [],
  },
  onLoad: function () {
    var request = (cnt) => new Promise((resolve, reject) => {
      tt.request({
        "url": `${app.url}/user/${app.open_id}`,
        "method": "GET",
        "header": {
          "Content-Type": "application/json; charset=utf-8",
          "authentication": `${app.token}`
        },
        success: function (res) {
          if (res.statusCode === 401) {
            getApp().login().then(() => request(cnt + 1)).catch(() => reject("failed to login"));
          }
          else if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail: function (res) {
          if (res.statusCode === 401) {
            getApp().login().then(() => request(cnt + 1)).catch(() => reject("failed to login"));
          }
          else {
            reject(res);
          }
        }
      });
    });
    request(0).then(data => {
      this.setData({ "topic_list": data.topics });
    });
  },
})
