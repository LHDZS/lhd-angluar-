/**
 * 获取对象嵌套中的某个属性值
 * @param obj 源对象
 * @param deepField 属性地址; 示例: a.b.c
 */
export function getDeepValue(obj: object, deepField: string) {
    if (obj) {
        const splitKeys = deepField.split('.');
        let value = obj;
        splitKeys.map((m) => {
            value = value[m];
        });
        return value;
    } else {
        throw new Error('[DeepValue] obj is not defined.');
    }
}
