import store from "@/store/store";

export default function remove(id) {
    store.dispatch("loader/removeFromLoader", id);
}