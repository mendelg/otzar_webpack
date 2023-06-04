export default async function({
    from,
    to,
    next
}, mws) {
    let route = null;
    for (let i = 0; i < mws.length; i++) {
        let mw = mws[i];
        let ret = await mw({
            from,
            to
        });
        if (ret.next) {
            route = ret.next;
            break;
        }
    }
    if (route) next(route);
    else next();
}