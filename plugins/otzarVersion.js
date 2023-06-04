export default function(Vue) {
    Vue.mixin({
        computed: {
            otzarVersion() {
                return this.$store.state.otzar_version;
            },
        },
    });
}