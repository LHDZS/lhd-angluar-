import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'selection-label',
  templateUrl: './selection-label.component.html',
  styleUrls: ['./selection-label.component.scss']
})
export class SelectionLabelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@NgModule({
  imports: [
  ],
  declarations: [SelectionLabelComponent],
  exports: [SelectionLabelComponent],
})
export class SelectionLabelModule {}
