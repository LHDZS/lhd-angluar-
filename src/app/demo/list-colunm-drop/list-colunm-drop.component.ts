import { Component, OnInit, NgModule } from '@angular/core';
import DataSource from "devextreme/data/data_source";

@Component({
  selector: 'app-list-colunm-drop',
  templateUrl: './list-colunm-drop.component.html',
  styleUrls: ['./list-colunm-drop.component.scss']
})
export class ListColunmDropComponent implements OnInit {
  
  constructor() { };
  menus:MemuModel [
  ];
  selectBoxData = new DataSource({
    store: [
        { id: 1, firstName: "电脑" },
        { id: 2, firstName: "电视" },
        { id: 3, firstName: "手机" },
        { id: 4, firstName: "平板" }
    ],
});
onCustomItemCreating (e) {
  
  // Generates a new 'id'
  var item = this.selectBoxData.items()[this.selectBoxData.items().length - 1];
  if (item == null || item == undefined){
    return;
  }
  // if(item.id === -1){
  //   item.firstName = e.text;
  // }else{
  //   const nextId = Math.max.apply(Math, this.selectBoxData.items().map(c => c.id)) + 1;
  //   e.customItem = {id:-1,firstName:e.text};
  //   this.selectBoxData.store().insert(e.customItem);
  // }
  const nextId = Math.max.apply(Math, this.selectBoxData.items().map(c => c.id)) + 1;
  e.customItem = {id:-1,firstName:e.text};
  this.selectBoxData.store().insert(e.customItem);
    this.selectBoxData.reload();
}

add(){
  //请求后台
  //刷新数据源
  this.selectBoxData.store().reload();
}

  ngOnInit() {
  }

}

export class MemuModel{
  constructor(id:number,name:string){
    this.id = id;
    this.name =name;
  }
  id:number;
  name:string;
}
