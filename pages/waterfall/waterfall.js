Component({
  properties: {
    topic_list: {
      type: Array,
      value: [],
    }
  },
  data: {
    defaultStates: {},
  },
  methods: {
    navToDetail: function (event) {
      const pid = event.detail.pid;
      const item = this.data.topic_list.find(e => e.pid === pid);
      getApp().setOnceStorage(item);
      tt.navigateTo({
        "url": `../topic/topic?pid=${this.data.pid}`,
        fail: function () {
          console.error("failed to navigate to topic");
        }
      });
    },
    navToUser: function (event) {
      const uid = event.detail.uid;
      tt.navigateTo({
        "url": `../user/user?uid=${uid}`,
        fail: function () {
          console.error("failed to navigate to user");
        }
      });
    },
  }
})