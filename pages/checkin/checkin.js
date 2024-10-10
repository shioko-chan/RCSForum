Page({
  data: {
    displayText: '开工!',
    isActive: false,
    h: 0,
    m: 0,
    s: 0,
    intervalId: null,
    checkedIn: false,
    navItem1: true,
    isProcessing: false,
  },

  sendHello: function () {
    return new Promise((resolve, reject) => {
      tt.request({
        url: "http://192.168.1.100:5000/checkin",
        method: "POST",
        data: {
          foo: "hello",
        },
        success: res => {
          resolve();
        },
        fail: res => {
          reject();
        },
      });
    });
  },

  keepAlive: function () {
    var that = this;
    tt.request({
      url: "http://192.168.1.100:5000/checkin",
      method: "POST",
      data: {
        foo: "hello",
      },
      success: res => {

      },
      fail: res => {
        tt.showModal({
          title: "已断开与服务器的连接",
          confirmText: "确认",
          showCancel: false,
        });
        that.stopTimer();
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
      if (s == 0) {
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
  }
});
