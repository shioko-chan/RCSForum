Page({
  data: {
    displayText: '开工!',
    isActive: false,
    isSidebarOpen: false,
    h: 0,
    m: 0,
    s: 0,
    intervalId: null,
    checkedIn: false,
    navItem1: true,
    isProcessing: false,
    ranks: [],
    ranks_timestamp: 0,
    url: "http://192.168.3.2"
  },

  sendMessage: function (url) {
    return new Promise((resolve, reject) => {
      var request = function (cnt) {
        tt.request({
          "url": url,
          "header": {
            "Content-Type": "application/json; charset=utf-8",
            "authentication": getApp().token
          },
          "method": "POST",
          success: res => {
            if (res.data.status === 0) {
              resolve();
            }
            else if (res.data.status === 1 && cnt === 0) {
              getApp().login()
                .then(() => request(cnt + 1))
                .catch(() => reject());
            }
            else {
              reject();
            }
          },
          fail: _ => {
            reject();
          },
        });
      };
      request(0);
    });
  },

  sendHello: function () {
    return this.sendMessage(`${this.data.url}/checkin/hello`);
  },

  keepAlive: function () {
    var that = this;
    this.sendMessage(`${this.data.url}/checkin/keepalive`).catch(() => {
      tt.showModal({
        title: "已断开与服务器的连接",
        confirmText: "确认",
        showCancel: false,
      });
      that.stopTimer();
    });
  },

  handleCheckIn: function () {
    if (this.data.isProcessing) {
      return;
    }
    if (!this.data.isActive) {
      this.setData({ isProcessing: true });
      this.sendHello()
        .then(() => {
          this.startTimer();
        })
        .catch(() => {
          tt.showModal({
            title: "连接服务器失败",
            confirmText: "确认",
            showCancel: false,
          });
        })
        .finally(() => {
          this.setData({ isProcessing: false });
        });
    }
    else {
      this.stopTimer();
    }
  },

  stopTimer: function () {
    this.setData({
      isActive: false,
    });
    clearInterval(this.data.intervalId);
  },

  startTimer: function () {
    let { h, m, s } = this.data;
    this.setData({
      isActive: true,
      displayText: this.formatTime(h, m, s),
    });
    const intervalId = setInterval(() => {
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
        displayText: this.formatTime(h, m, s),
      });

    }, 1000);

    this.setData({
      intervalId,
    });
  },

  formatTime: function (h, m, s) {
    let hours = 0;
    if (h >= 100) {
      hours = String(h).padStart(3, '0');
    }
    else {
      hours = String(h).padStart(2, '0');
    }
    return `${hours}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  hideSidebar: function () {
    this.setData({
      isSidebarOpen: false,
    });
  },
  getRanks: function () {
    const url = this.data.url;
    return new Promise((resolve, reject) => {
      tt.request({
        url: `${url}/checkin/rank`,
        header: {
          "Content-Type": "application/json; charset=utf-8",
          "authentication": getApp().token
        },
        method: "GET",
        success: res => {
          if (res.data.status === 0) {
            resolve(res.data.rank);
          }
          else {
            reject();
          }
        },
        fail: _ => {
          reject();
        },
      });
    });
  },
  showSidebar: function () {
    if (this.data.ranks_timestamp + 5 * 60 * 1000 > Date.now() && this.data.ranks.length > 0) {
      this.setData({
        isSidebarOpen: true,
      });
      return;
    }
    this.getRanks().then((ranks) => {
      this.setData({
        isSidebarOpen: true,
        ranks_timestamp: Date.now(),
      });
      this.setData({ ranks: ranks });
    }).catch(() => {
      tt.showModal({
        title: "连接服务器失败",
        confirmText: "确认",
        showCancel: false,
      });
    });
  },
});
