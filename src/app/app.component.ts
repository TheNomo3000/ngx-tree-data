import { Component, Output, EventEmitter } from '@angular/core';
import { ItemNode } from 'projects/ngx-tree-data/src/lib/models/models';
import { NgxTreeDataService } from 'projects/ngx-tree-data/src/public-api';
import { DATA } from './data/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Output() selectedChange = new EventEmitter<ItemNode>();
  checkbox = true;
  search = true;
  data = DATA;
  dataSelected;
  constructor(private treeService: NgxTreeDataService) {
    this.treeService.initialize(this.data);
  }
}
