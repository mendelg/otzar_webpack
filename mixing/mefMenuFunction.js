const ret = {
    data() {
        return {
            showMenu: false,
        };
    },
    methods: {
        closeMenu() {
            this.showMenu = false;
        },
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
    },
};

export default ret;