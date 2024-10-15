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
  },

  sendHello: function () {
    const url = getApp().url;
    return new Promise((resolve, reject) => {
      let req = () => {
        tt.request({
          url: `${url}/checkin/hello`,
          header: { authentication: getApp().token },
          method: "GET",
          success: res => {
            if (res.data.status === 0) {
              resolve();
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
      tt.request({
        url: `${url}/checkin/hello`,
        header: { authentication: getApp().token },
        method: "GET",
        success: res => {
          if (res.data.status === 1) {
            getApp().login().then(() => {
              req();
            }).catch(() => { reject(); });
          }
          else if (res.data.status === 0) {
            resolve();
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

  keepAlive: function () {
    var that = this;
    var resolveDisconnected = () => {
      tt.showModal({
        title: "已断开与服务器的连接",
        confirmText: "确认",
        showCancel: false,
      });
      that.stopTimer();
    };
    const url = getApp().url;
    tt.request({
      url: `${url}/checkin/keepalive`,
      method: "GET",
      header: { authentication: getApp().token },
      success: async res => {
        if (res.data.status === 1) {
          await getApp().login();
          tt.request({
            url: `${url}/checkin/keepalive`,
            method: "GET",
            header: { authentication: getApp().token },
            success: res => {
              if (res.data.status !== 0) {
                resolveDisconnected();
              }
            },
            fail: _ => {
              resolveDisconnected();
            },
          });
        }
        else if (res.data.status !== 0) {
          resolveDisconnected();
        }
      },
      fail: res => {
        resolveDisconnected();
      },
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
    const url = getApp().url;
    return new Promise((resolve, reject) => {
      tt.request({
        url: `${url}/checkin/rank`,
        header: { authentication: getApp().token },
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
    this.getRanks().then((ranks) => {
      this.setData({
        isSidebarOpen: true,
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
