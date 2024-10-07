Page({
  data: {
    displayText: '开工!',
    isActive: false,
    h: 0,
    m: 0,
    s: 0,
    intervalId: null,
  },

  sendHello: function () {
    tt.request({
      url: "http://127.0.0.1:5000/checkin",
      method: "POST",
      data: {
        foo: "hello",
      },
      success: res => { console.log(res) }
    });
  },

  keepAlive: function () {

  },

  handleCheckIn: function () {
    if (!this.data.isActive) {
      this.sendHello();
      this.startTimer();
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
  }
});
