Component({
    properties: {
        navItem1: { type: Boolean, value: false },
        navItem2: { type: Boolean, value: false },
        centerItem: { type: Boolean, value: false },
    },
    data: {
        defaultStates: {},
        height: 0,
    },
    methods: {
        handleCheckIn: function () {
            tt.switchTab({
                "url": "../../pages/checkin/checkin",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleProfile: function () {
            tt.switchTab({
                "url": "../../pages/space/space",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleMainPage: function () {
            tt.switchTab({
                "url": "../../pages/index/index",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleNewTopic: function () {
            tt.switchTab({
                "url": "../../pages/newtopic/newtopic",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            })
        }
    }
})