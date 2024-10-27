Page({
  data: {
    display_text: '开工!',
    is_active: false,
    is_sidebar_open: false,
    is_accumulate: false,
    h: 0,
    m: 0,
    s: 0,
    interval_id: null,
    nav_item1: true,
    is_processing: false,
    ranks: [],
    ranks_acc: [],
    ranks_timestamp: 0,
    ranks_acc_timestamp: 0,
    url: "http://192.168.3.2"
  },
  sendMessage(url) {
    return getApp().request_with_authentication({
      url,
      method: "POST",
      header: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  },
  keepAlive() {
    this.sendMessage(`${this.data.url}/checkin/keepalive`).catch(() => {
      getApp().show_network_error_modal("打卡功能需要连接至实验室网络才可使用");
      this.stopTimer();
    });
  },
  handleCheckIn() {
    if (this.data.is_processing) {
      return;
    }
    if (!this.data.is_active) {
      this.setData({ is_processing: true });
      tt.showLoading({ title: "打卡中...", mask: true });
      this.sendMessage(`${this.data.url}/checkin/hello`)
        .then(() => {
          this.startTimer();
        })
        .catch(() => {
          getApp().show_network_error_modal("打卡功能需要连接至实验室网络才可使用");
        })
        .finally(() => {
          this.setData({ is_processing: false });
          tt.hideLoading();
        });
    }
    else {
      this.stopTimer();
    }
  },
  stopTimer() {
    this.setData({
      is_active: false,
    });
    clearInterval(this.data.interval_id);
  },
  startTimer() {
    let { h, m, s } = this.data;
    this.setData({
      is_active: true,
      display_text: this.formatTime(h, m, s),
    });
    const interval_id = setInterval(() => {
      let { h, m, s } = this.data;
      if (s + 1 >= 60) {
        s = 0;
        m += 1;
      }
      else {
        s += 1;
      }
      if (m >= 60) {
        tt.showModal({
          title: "工作一小时了，休息一下吧",
          confirmText: "确认",
          showCancel: false,
        });
        m = 0;
        h += 1;
      }
      if (s == 0 && m % 5 == 0) {
        this.keepAlive();
      }
      this.setData({
        h: h, m: m, s: s,
        display_text: this.formatTime(h, m, s),
      });

    }, 1000);
    this.setData({
      interval_id,
    });
  },
  formatTime(h, m, s) {
    let hours = 0;
    if (h >= 100) {
      hours = String(h).padStart(3, '0');
    }
    else {
      hours = String(h).padStart(2, '0');
    }
    return `${hours}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },
  hideSidebar() {
    this.setData({
      is_sidebar_open: false,
    });
  },
  showAccumulate() {
    if (this.data.ranks_acc_timestamp + 5 * 60 * 1000 > Date.now() && this.data.ranks.length > 0) {
      this.setData({ is_accumulate: true, is_sidebar_open: true, });
      return;
    }
    tt.showLoading({ title: "正在加载排行榜", mask: true });
    getApp().request({
      url: `${getApp().url}/checkin/ranksacc`,
      header: { "Content-Type": "application/json; charset=utf-8" },
      method: "GET",
    }).then(data => {
      this.setData({ ranks_acc: data.rank, is_accumulate: true, is_sidebar_open: true, });
      this.data.ranks_acc_timestamp = Date.now();
    }).catch(() =>
      getApp().show_network_error_modal("请检查网络连接，需要连接至校园网或实验室网络")
    ).finally(() => tt.hideLoading());
  },
  hideAccumulate() {
    this.setData({
      is_accumulate: false
    });
  },
  showSidebar() {
    if (this.data.ranks_timestamp + 5 * 60 * 1000 > Date.now() && this.data.ranks.length > 0) {
      this.setData({ is_sidebar_open: true });
      return;
    }
    tt.showLoading({ title: "正在加载排行榜", mask: true });
    getApp().request({
      url: `${getApp().url}/checkin/ranks`,
      header: { "Content-Type": "application/json; charset=utf-8" },
      method: "GET",
    }).then(data => {
      this.setData({ ranks: data.rank, is_sidebar_open: true, });
      this.data.ranks_timestamp = Date.now();
    }).catch(() =>
      getApp().show_network_error_modal("请检查网络连接，需要连接至校园网或实验室网络")
    ).finally(() => tt.hideLoading());
  }
});
