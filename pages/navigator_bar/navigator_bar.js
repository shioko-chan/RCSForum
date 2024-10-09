Component({
    properties: {
        navItem1: { type: Boolean, value: false },
        navItem2: { type: Boolean, value: false },
        centerItem: { type: Boolean, value: false },
    },
    data: {
        defaultStates: {},
    },
    attached: function () {
        console.log(this.data.navItem1);
    },
    methods: {
        handleCheckIn: function () {
            tt.switchTab({
                "url": "../checkin/checkin", success(res) {
                    console.log(JSON.stringify(res));
                },
                fail(res) {
                    console.log(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleProfile: function () {
            tt.switchTab({
                "url": "../space/space",
                success(res) {
                    // console.log(JSON.stringify(res));
                },
                fail(res) {
                    console.log(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleMainPage: function () {
            tt.switchTab({
                "url": "../index/index",
                success(res) {
                    // console.log(JSON.stringify(res));
                },
                fail(res) {
                    console.log(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleNewTopic: function () {
            tt.switchTab({
                "url": "../newtopic/newtopic",
                success(res) {
                    // console.log(JSON.stringify(res));
                },
                fail(res) {
                    console.log(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            })
        }
    }
})