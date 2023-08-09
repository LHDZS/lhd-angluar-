export function queryParmaWithUrl(name: string) {
    const reg = new RegExp('(^|&|/?)' + name + '=([^&]*)(&|$)');
    const r =
        decodeURIComponent(window.location.search).substr(1).match(reg) ||
        decodeURIComponent(window.location.href)
            .substring(window.location.href.search(/\?/) + 1)
            .match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
