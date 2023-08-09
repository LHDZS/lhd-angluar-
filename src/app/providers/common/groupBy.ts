/**
 * 分组
 * @param array
 * @param func
 */
export function groupBy(array: any[], func: Function) {
    const groups = {};
    array.forEach(function (o) {
        const group = JSON.stringify(func(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
        return groups[group];
    });
}