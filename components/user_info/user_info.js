Component({
  properties: {
    name: {
      type: String,
      value: '',
    },
    avatar: {
      type: String,
      value: '',
    },
    is_me: {
      type: Boolean,
      value: false,
    },
    topic_list: {
      type: Array,
      value: [],
      observer(newVal, _) {
        newVal.forEach(topic => {
          if (topic.is_anonymous) {
            topic.avatar = '/assets/images/anon.png';
            topic.name = 'anonymous';
          }
          else {
            topic.avatar = this.data.avatar;
            topic.name = this.data.name;
          }
        });
        this.setData({
          list: newVal,
        });
      }
    }
  },
  data: {
    list: [],
    defaultStates: {},
  },
  methods: {
    propagateDelete(event){
      this.triggerEvent('delete', event.detail);
    }
  }
})