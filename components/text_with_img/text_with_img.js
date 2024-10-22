Component({
  properties: {
    is_digest: {
      type: Boolean,
      value: false,
    },
    content: {
      type: String,
      value: "",
      observer: function (new_val, _) {
        const matchEmoji = emoji_name => {
          return this.data.emojis.find(e => e.name === emoji_name)?.url || null;
        };

        const raw_str = new_val;
        let start = 0;
        this.setData({ "itemList": [] });

        for (let i = 0; i < raw_str.length; i++) {
          if (raw_str[i] !== "[") continue;
          const endIdx = raw_str.indexOf("]", i);
          if (endIdx === -1) break;

          const emoji_name = raw_str.slice(i + 1, endIdx);
          const emoji_url = matchEmoji(emoji_name);

          if (emoji_url === null) continue;

          if (start < i) {
            this.data.itemList.push({
              is_text: true,
              text: raw_str.slice(start, i),
            });
          }

          this.data.itemList.push({
            is_text: false,
            src: emoji_url,
          });

          start = endIdx + 1;
          i = endIdx;
        }

        if (start < raw_str.length) {
          this.data.itemList.push({
            is_text: true,
            text: raw_str.slice(start),
          });
        }
        this.setData({ "itemList": this.data.itemList });
      }
    },
  },
  data: {
    defaultStates: {},
    itemList: [],
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
        "url": "/assets/emoji/noproblem.jpg",
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
        "url": "/assets/emoji/tang.jpg",
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
      const currentImage = event.currentTarget.dataset.src;
      tt.previewImage({
        urls: [currentImage],
        current: currentImage,
        shouldShowSaveOption: true,
      });
    },
    handleEmoji: function (event) {
      const index = event.currentTarget.dataset.index;
      const emoji = `[${this.data.emojis[index].name}]`;
      this.triggerEvent("selected", { emoji });
    }
  }
})