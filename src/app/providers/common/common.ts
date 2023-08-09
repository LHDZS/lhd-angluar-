export class COM {
  static getScalingFactor(Quantity: number,measureUnitName:string, arr: any[], Exchange: any[]) {
    var data=[];
    if(!Quantity){
      Quantity = 0;
    }
    if(measureUnitName){
      arr.forEach((a) => {
        var scalingFactor=0;
        var scalingType=null;
        Exchange.forEach((b) => {
            if(b.MeasureUnitName1==measureUnitName&&b.MeasureUnitName2==a.measureUnitName){
              scalingFactor = b.ScalingFactor;
              scalingType = b.ScalingType;
              return false;
            }
        });
        if(scalingType!=null){
          var Quantity1 = scalingFactor*Quantity;
          var cos={};
          cos["measureUnitName"] = a.measureUnitName;
          cos["Quantity"] = Quantity1;
          cos["scalingType"] = scalingType;
          cos["UnitType"] = a.UnitType;
          if(scalingType=="0"){
            if(a.Quantity&&Number(a.Quantity)!=0){
              cos["scalingType"] = "3";
            }
          }
          data.push(cos);
        }
      });
    }
    return data;
  }
}
