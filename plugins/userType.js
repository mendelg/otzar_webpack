export default function(Vue) {
    Vue.mixin({
        computed: {
            userType() {
                let vm = this;
                return {
                    guestUser() {
                        return vm.$store.state.user.userType === "GUEST";
                    },
                    ipUser() {
                        return (
                            vm.$store.state.user.userType === "IP" ||
                            vm.$store.state.user.userType === "GROUP"
                        );
                    },
                    ipMainUser() {
                        return (
                            (vm.$store.state.user.userType === "IP" ||
                                vm.$store.state.user.userType === "GROUP") &&
                            !vm.$store.state.user.subUserId
                        );
                    },
                };
            },
        },
    });
}