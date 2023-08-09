/**
 * 基础数据类型默认值
 * @param value 值
 */
export const DataValidation = {
    isNullOrUndefined(value): boolean {
        return value == null || value == undefined ? true : false;
    },
    isEmpty(value): boolean {
        return value == '' || value == undefined || value == null ? true : false;
    },
    setNullableToDefaultValue(data: object) {
        if (data) {
            for (const key in data) {
                if (data[key] instanceof Number && this.isNullOrUndefined(data[key])) {
                    data[key] = 0;
                }
            }
        }
    },
};
