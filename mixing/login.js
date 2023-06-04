import {
    mapActions,
    mapState
} from "vuex";
import store from "@/store/store";
import {
    signInUser,
    loadAllUserData,
    ENUM_LOGIN_WIN_MODES,
} from "@/services/login";

export default {
    methods: {
        ...mapActions("user", ["login", "setUserData", "setUser"]),
        showLoginWin() {
            this.$store.state.user.loginTab = 1;
            this.$store.state.user.showLoginMode = ENUM_LOGIN_WIN_MODES.LOGIN;
            this.$store.state.user.showLogin = true;
        },
        showLoginWinFull(user) {
            if (user.userData.connectionInfo ? .switchApps)
                this.$store.state.user.showLoginMode = ENUM_LOGIN_WIN_MODES.SWITCHAPPS;
            else
                this.$store.state.user.showLoginMode =
                ENUM_LOGIN_WIN_MODES.STATIONS_FULL;

            this.$store.state.user.showLogin = true;
        },
        showConnectionOptions() {
            this.$store.state.user.showLoginMode = ENUM_LOGIN_WIN_MODES.APP_CHOOSE;
            this.$store.state.user.showLogin = true;
        },
        async loginOnlineCheck() {
            signInUser({
                    autoConnect: false
                })
                .then((user) => {
                    if (user) {
                        this.setUser(user).then(() => {
                            if (!user.userData.error) loadAllUserData();
                        });
                    } else this.showLoginWin();
                })
                .catch((err) => console.error(err));
        },
        async loginOffline() {
            //auto connect user
            await this.login({
                username: "זמני",
                password: "1234",
            });
        },
        async loginOnline(data) {
            let user = localStorage.getItem("user");
            if (user) {
                //if user exists - verify it
                user = JSON.parse(user);
                user = await signInUser({
                    token: user.token,
                    ...data,
                });
            } else user = await signInUser(data);

            if (user) {
                this.showLoginMessage(user);
                if (!(
                        user.userData.connectionInfo ? .switchApps &&
                        user.userData.connectionInfo ? .full
                    ))
                    this.setUser(user);
                store.state.user.reactAppConnection++;
                return true;
                //  this.$router.push(this.to);
            } else {
                return false;
                this.$router.replace({
                    name: "lic_error",
                    params: {
                        err: this.$t("errors.userError"),
                        code: 200
                    },
                });
            }
        },
        showLoginMessage(user) {
            if (user.userData.connectionInfo ? .full) {
                this.showLoginWinFull(user);
            } else if (
                user.userData.connectionInfo ? .type == "both" &&
                user.userData.connectionInfo ? .chooseApps
            ) {
                this.showConnectionOptions();
            }
        },
        setOnlineUnloadEvent() {
            if (globalThis.SERVER_MODE == "offline") return;
            window.addEventListener("beforeunload", this.disconnectUser);
            window.addEventListener("unload", this.disconnectUser);
        },
        disconnectUser() {
            this.$socket.client.emit("logout");
        },
    },
};