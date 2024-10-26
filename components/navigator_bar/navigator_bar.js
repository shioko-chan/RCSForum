Component({
    properties: {
        nav_item1: { type: Boolean, value: false },
        nav_item2: { type: Boolean, value: false },
        center_item: { type: Boolean, value: false },
    },
    data: {
        defaultStates: {},
        height: 0,
    },
    methods: {
        handleCheckIn() {
            tt.switchTab({
                url: "../../pages/checkin/checkin",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleProfile() {
            tt.switchTab({
                url: "../../pages/space/space",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleMainPage() {
            tt.switchTab({
                url: "../../pages/index/index",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleNewTopic() {
            tt.switchTab({
                url: "../../pages/newtopic/newtopic",
                fail(res) {
                    console.error(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            })
        }
    }
})