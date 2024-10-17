Component({
  properties: {

  },
  data: {
    defaultStates: {},
    emojis: [
      {
        "name": "I_AM_TRASH",
        "url": "/assets/emoji/trashbin.png",
      },
      {
        "name": "CAR",
        "url": "/assets/emoji/car.jpg",
      },
      {
        "name": "SHOW_IT_TO_ME",
        "url": "/assets/emoji/show.jpg",
      },
      {
        "name": "LYING_FLAT",
        "url": "/assets/emoji/lyingflat.jpg",
      },
      {
        "name": "I_AM_DEPRESSED",
        "url": "/assets/emoji/depress.jpg",
      },
      {
        "name": "LUCKY",
        "url": "/assets/emoji/lucky.gif",
      },
      {
        "name": "NO_PROBLEM",
        "url": "/assets/emoji/noproblem.png",
      },
      {
        "name": "BLANK_BRAIN",
        "url": "/assets/emoji/brainblank.jpg"
      },
      {
        "name": "SELF_CONSCIOUS",
        "url": "/assets/emoji/selfconscious.jpg"
      },
      {
        "name": "NOW_WONDERING",
        "url": "/assets/emoji/nowimaging.jpg"
      },
      {
        "name": "ME_QMARK",
        "url": "/assets/emoji/itsmeqmark.jpg"
      },
      {
        "name": "S_ATTRIBUTE",
        "url": "/assets/emoji/sattribute.jpg"
      },
      {
        "name": "CALM_DOWN",
        "url": "/assets/emoji/calm.jpg",
      },
      {
        "name": "SPEECHLESS",
        "url": "/assets/emoji/speechless.jpg",
      },
      {
        "name": "LICKING",
        "url": "/assets/emoji/licking.gif",
      },
      {
        "name": "INNOCENT",
        "url": "/assets/emoji/innocent.gif",
      },
      {
        "name": "WONDERING",
        "url": "/assets/emoji/wondering.gif",
      },
      {
        "name": "CRY",
        "url": "/assets/emoji/cry.png",
      },
      {
        "name": "PLEASANT",
        "url": "/assets/emoji/pleased.gif",
      },
      {
        "name": "OH_CAPITAL",
        "url": "/assets/emoji/ohcapital.png",
      },
      {
        "name": "LAUGHING",
        "url": "/assets/emoji/laughing.gif",
      },
      {
        "name": "SCRATCH_HEAD",
        "url": "/assets/emoji/scratch.gif",
      },
      {
        "name": "SHOCKED",
        "url": "/assets/emoji/shocking.gif",
      },
      {
        "name": "QUESTION",
        "url": "/assets/emoji/question.jpg",
      },
      {
        "name": "WOW",
        "url": "/assets/emoji/wow.gif",
      },
      {
        "name": "LOVE",
        "url": "/assets/emoji/love.gif",
      },
      {
        "name": "FORGE_IRON",
        "url": "/assets/emoji/forgeiron.png",
      },
      {
        "name": "WTF_MEME",
        "url": "/assets/emoji/wtfmeme.png",
      },
      {
        "name": "ADMIRE",
        "url": "/assets/emoji/admire.jpg",
      },
      {
        "name": "IS_THAT_PRACTICAL",
        "url": "/assets/emoji/practical.png",
      },
      {
        "name": "EMBARRASSED",
        "url": "/assets/emoji/embarrassed.jpg",
      },
      {
        "name": "YOU_ARE_EXTRAORDINARY",
        "url": "/assets/emoji/extraordinary.jpg",
      },
      {
        "name": "DONT_WANT_WORK",
        "url": "/assets/emoji/nowork.jpg",
      },
      {
        "name": "TANG",
        "url": "/assets/emoji/tang.png",
      },
      {
        "name": "NERD",
        "url": "/assets/emoji/nerdy.jpg",
      },
      {
        "name": "HAVE_PARTY",
        "url": "/assets/emoji/party.jpg",
      },
      {
        "name": "LOYAL",
        "url": "/assets/emoji/loyal.jpg",
      },
      {
        "name": "TEHEBERINKO",
        "url": "/assets/emoji/teheberinko.jpg",
      },
      {
        "name": "EXP_INC_3",
        "url": "/assets/emoji/expinc3.jpg",
      },
      {
        "name": "ULTRA_SKILL",
        "url": "/assets/emoji/ultraskill.gif",
      },
    ]
  },
  methods: {
    previewEmoji: function (event) {
      const index = event.currentTarget.dataset.index;
      const currentImage = this.data.emojis[index].url;
      tt.previewImage({
        urls: [currentImage],
        current: currentImage,
        shouldShowSaveOption: true,
      });
    },
    handleEmoji: function (event) {
      const index = event.currentTarget.dataset.index;
      const emoji = `[!-${this.data.emojis[index].name}-!]`;
      this.triggerEvent("emoji", { emoji });
    }
  }
})