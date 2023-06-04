import config from "@/config/general";

export default function(Vue) {
    Vue.mixin({
        computed: {
            otzarBook() {
                return {
                    type(book) {
                        return config.isCustomBook(book) ?
                            "custom" :
                            config.isPDFCustomBook(book) ?
                            "customPDF" :
                            "system";
                    },
                };
            },
        },
    });
}