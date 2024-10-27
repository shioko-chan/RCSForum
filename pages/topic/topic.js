Page({
  data: {
    poster: null,
    comment_list: [],
    index_1: -1,
    toward: "",
    scroll_top: 0,
    scroll_into_view: "",
  },
  onLoad() {
    const data = getApp().once_storage;
    this.setData({ poster: data });
    this.handleRefresh();
  },
  handleReply(event) {
    this.selectComponent("#bottom-bar").focusReply(event.detail);
  },
  handleComment(event) {
    this.handleRefresh().finally(() => {
      if (event.detail.index_1 === null || event.detail.index_1 === undefined) {
        this.setData({ scroll_top: 0 });
        this.setData({ scroll_top: 99999999 });
      } else {
        this.setData({ scroll_into_view: `index${event.detail.index_1}` });
        this.selectComponent(`#index${event.detail.index_1}`).scrollToBottom();
      }
    });
  },
  handleRefresh() {
    tt.showLoading({
      title: '获取评论中...',
      mask: true,
    });
    return getApp().request_with_authentication({
      url: `${getApp().url}/comment/${this.data.poster.pid}`,
      method: "GET",
      header: { "Content-Type": "application/json; charset=utf-8" },
    }).then(data => {
      const comments = data.comments;
      comments.forEach(comment => {
        if (comment.is_deleted) { return; }
        if (comment.is_anonymous) {
          comment.avatar = "/assets/images/anon.png";
          comment.name = "anonymous";
          if (!getApp().is_admin && comment.uid !== getApp().open_id) {
            comment.uid = '';
          }
        }
        comment.subs.forEach(comment => {
          if (comment.is_deleted) { return; }
          if (comment.is_anonymous) {
            comment.avatar = "/assets/images/anon.png";
            comment.name = "anonymous";
            if (!getApp().is_admin && comment.uid !== getApp().open_id) {
              comment.uid = '';
            }
          }
        });
      })
      this.setData({
        comment_list: comments
      });
    }).catch(({ mes, res }) => {
      console.error(mes, res);
      if (res.statusCode === 404) {
        getApp()._show_modal({ title: "获取评论失败", content: "该帖子已被删除" });
      } else {
        getApp()._show_modal({ title: "获取评论失败", content: "" });
      }
    }).finally(() => tt.hideLoading());
  }
})
