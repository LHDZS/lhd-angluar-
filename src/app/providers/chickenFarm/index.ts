import { USER_INFO_CONTEXT } from "../context";
import { DataDictionary } from "../enums";

/**
 * 鸡场FARM相关数据
 */
export const CHICKEN_FARM_CONTEXT = {
    /**
     * 养殖场 filter
     */
     YHFarmTypeCondition:
        [["YHFarmType", '=', DataDictionary.FarmTypeC1], 'or',
        ["YHFarmType", '=', DataDictionary.FarmTypeC2], 'or',
        ["YHFarmType", '=', DataDictionary.FarmTypeC3], 'or',
        ["YHFarmType", '=', DataDictionary.FarmTypeC4]]
    ,
    /**
     * 养殖场 filter
     */
    ChickenFarmFilterCondition:
        [["ChickenFarmType", '=', DataDictionary.FarmTypeC1], 'or',
        ["ChickenFarmType", '=', DataDictionary.FarmTypeC2], 'or',
        ["ChickenFarmType", '=', DataDictionary.FarmTypeC3], 'or',
        ["ChickenFarmType", '=', DataDictionary.FarmTypeC4]]
    ,
    /**
     * 种鸡场 filter
     */
    BreedingFarmFilterCondition:
        [["ChickenFarmType", '=', DataDictionary.FarmTypeA1], 'or',
        ["ChickenFarmType", '=', DataDictionary.FarmTypeA2], 'or',
        ["ChickenFarmType", '=', DataDictionary.FarmTypeA3]]
    ,

    /**
     * 种鸡场 filter
     */
     BreedingFarmFilterCondition2:
     [["ChickenFarmType", '=', DataDictionary.FarmTypeA2], 'or',
     ["ChickenFarmType", '=', DataDictionary.FarmTypeA3]]
    ,

    /**
     * 孵化厂 filter
     */
    HatcheryFarmFilterCondition:
        ["ChickenFarmType", '=', DataDictionary.FarmTypeB3]
    ,

    /**
     * 排除孵化厂 filter
     */
    ExcludeHatcheryFarmFilterCondition:
        [["ChickenFarmType", '<>', DataDictionary.FarmTypeB1], 'and',
        ["ChickenFarmType", '<>', DataDictionary.FarmTypeB2], 'and',
        ["ChickenFarmType", '<>', DataDictionary.FarmTypeB3]]
    ,

    /**
     * 是否是种鸡场
     * @returns 
     */
    IsBreedingFarm(): boolean {
        return USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeA1 ||
            USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeA2 ||
            USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeA3;
    },

    /**
     * 是否是种鸡场
     * @returns 
     */
     IsBreedingFarm2(): boolean {
        console.log(USER_INFO_CONTEXT.childFarmType)
        return USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeA2 ||
            USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeA3;
    },

    /**
     * 是否是种鸡场
     * @returns 
     */
    CheckBreedingFarm(value: any): boolean {
        return value == DataDictionary.FarmTypeA1 ||
            value == DataDictionary.FarmTypeA2 ||
            value == DataDictionary.FarmTypeA3;
    },

    /**
     * 是否是孵化厂
     * @returns 
     */
    IsHatcheryFarm(): boolean {
        return USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeB1 ||
            USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeB2 ||
            USER_INFO_CONTEXT.childFarmType == DataDictionary.FarmTypeB3;
    },

    /**
     * 是否是孵化厂
     * @returns 
     */
    CheckHatcheryFarm(value: any): boolean {
        return value == DataDictionary.FarmTypeB1 ||
            value == DataDictionary.FarmTypeB2 ||
            value == DataDictionary.FarmTypeB3;
    },

};