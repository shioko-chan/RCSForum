Page({
  data: {
    avatar: '',
    username: '',
    navItem1: false,
    navItem2: true,
  },
  onLoad: function () {
    var app = getApp();
    this.setData({
      avatar: app.avatar,
      username: app.username,
    });
  },
})
