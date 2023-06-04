function arraymove(arr, element, distEle, dir) {
    if (element == distEle) return arr;

    var fromIndex = arr.indexOf(element);
    var toIndex = arr.indexOf(distEle);

    let narr = [];
    for (let i = 0; i < arr.length; i++) {
        if (i == fromIndex) continue;
        if (dir == "after") {
            narr.push(arr[i]);
            if (i == toIndex) narr.push(arr[fromIndex]);
        } else {
            if (i == toIndex) narr.push(arr[fromIndex]);
            narr.push(arr[i]);
        }
    }

    return narr;
}
export default {
    namespaced: true,
    state: {
        showMefoPrinter: false,
        sectionsToPrint: [],
    },
    mutations: {
        SET_SHOW_MEFO_PRINTER(state, show) {
            state.showMefoPrinter = show;
        },
        ADD_SEC_TO_PRINTER(state, sec) {
            let curSections = state.sectionsToPrint;
            let isExists = curSections.filter((s) => s.id == sec.id)[0];
            if (!isExists) state.sectionsToPrint = [...curSections, sec];
        },
        REMOVE_SEC_FROM_PRINTER(state, sec) {
            let curSections = state.sectionsToPrint;
            let isExists = curSections.filter((s) => s.id == sec.id)[0];
            let sections = curSections.filter((s) => s.id != sec.id);
            if (isExists) state.sectionsToPrint = sections;
        },
        PUSH_BACK(state, sec) {
            let sections = state.sectionsToPrint;
            let i = sections.indexOf(sec);

            sections.splice(i, 1);
            sections.splice(i - 1, 0, sec);
            state.sectionsToPrint = sections;
        },
        PUSH_NEXT(state, sec) {
            let sections = state.sectionsToPrint;
            let i = sections.indexOf(sec);

            sections.splice(i, 1);
            sections.splice(i + 1, 0, sec);
            state.sectionsToPrint = sections;
        },
        MOVE_BEFORE(state, {
            sec,
            secDist
        }) {
            let sections = state.sectionsToPrint;
            sections = arraymove(sections, sec, secDist, "before");
            state.sectionsToPrint = sections;
        },
        MOVE_AFTER(state, {
            sec,
            secDist
        }) {
            let sections = state.sectionsToPrint;
            sections = arraymove(sections, sec, secDist, "after");
            state.sectionsToPrint = sections;
        },
        EMPTY_SECTIONS(state, sec) {
            state.sectionsToPrint = [];
        },
    },
    actions: {
        setShowMefoPrinter({
            commit
        }, show) {
            commit("SET_SHOW_MEFO_PRINTER", show);
        },
        addSecToPrinter({
            commit
        }, sec) {
            commit("ADD_SEC_TO_PRINTER", sec);
        },
        removeSecFromPrinter({
            commit
        }, sec) {
            commit("REMOVE_SEC_FROM_PRINTER", sec);
        },
        pushNext({
            commit
        }, sec) {
            commit("PUSH_NEXT", sec);
        },
        pushBack({
            commit
        }, sec) {
            commit("PUSH_BACK", sec);
        },
        moveBefore({
            commit
        }, payload) {
            commit("MOVE_BEFORE", payload);
        },
        moveAfter({
            commit
        }, payload) {
            commit("MOVE_AFTER", payload);
        },
        emptySections({
            commit
        }) {
            commit("EMPTY_SECTIONS");
        },
    },
    getters: {
        showMefoPrinter(state) {
            return state.showMefoPrinter;
        },
    },
};