// /**
//  * 深拷贝对象
//  * @param obj 拷贝的对象
//  */
//  export function deepCopy(obj: any): any {
    
//     // - 是否包含属性
//     if (obj && obj.hasOwnProperty) {
//         // - 数组
//         if (obj instanceof Array) {
//             let arr = [];
//             obj.map((value) => {
//                 arr.push(deepCopy(value));
//             });
//             return arr;
//         }
//         // - 对象
//         if (obj instanceof Object) {
//             if(obj.constructor != Object&&obj.constructor != Array){
//                 return obj;
//             }
//             else{
//                 let o: any = {};
//                 for (let p in obj) {
                    
//                     o[p] =
//                         typeof obj[p] === 'object' && obj[p] != null && obj[p] != undefined
//                             ? obj[p].constructor == Date
//                                 ? obj[p]
//                                 : deepCopy(obj[p])
//                             : obj[p];
//                 }
//                 return o;
//             }
//         }
//     } else {
//         throw new Error('[DeepCopy] copy object is undefined');
//     }
// }

export function deepCopy(ele) {
    const type = typeof ele;
    const baseType = [
            "boolean",
            "number",
            "string",
            "undefined",
            "function",
    ];
    if (baseType.indexOf(type) > -1 || ele === null) return ele;
    const newType = Object.prototype.toString.call(ele);
    if (newType === "[object Array]") {
            const len = ele.length;
            if (!len) return [];
            const res = [];
            for (let i in ele) {
              res.push(deepCopy(ele[i]));
            }
            return res;
     }
     if (newType === "[object Object]") {
          if (Object.keys(ele).length === 0) return {};
          const res = {};
              for (let key in ele) {
          res[key] = deepCopy(ele[key]);
          }
         return res;
      }
      if (newType === "[object Date]") {
         return ele;
      }
  } 

export function setFirstToUpperCase(obj: any): any{

    var isSpecWords = "cProductName,bIsStandardPack";

    if (obj instanceof Array) {
        let arr = [];
        obj.map((value) => {
            arr.push(setFirstToUpperCase(value));
        });
        return arr;
    }
    if (obj instanceof Object) {
        let o: any = {};
        for (let p in obj) {
            if(isSpecWords.includes(p)){
                o[p] =
                typeof obj[p] === 'object' && obj[p] != null && obj[p] != undefined
                    ? obj[p].constructor == Date
                        ? obj[p]
                        : deepCopy(obj[p])
                    : obj[p];
            }
            else{
                o[p.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())] =
                typeof obj[p] === 'object' && obj[p] != null && obj[p] != undefined
                    ? obj[p].constructor == Date
                        ? obj[p]
                        : deepCopy(obj[p])
                    : obj[p];
            }
           
        }
        return o;
    }
}

