Component({
    properties: {

    },
    data: {
        defaultStates: {}
    },
    methods: {
        handleCheckIn: function () {
            tt.redirectTo({
                "url": "../checkin/checkin", success(res) {
                    console.log(JSON.stringify(res));
                },
                fail(res) {
                    console.log(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        },
        handleProfile: function () {
            tt.redirectTo({
                "url": "../space/space", success(res) {
                    console.log(JSON.stringify(res));
                },
                fail(res) {
                    console.log(`navigateTo fail: ${JSON.stringify(res)}`);
                }
            });
        }
    }
})