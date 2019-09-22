import { Component, Output, EventEmitter } from '@angular/core';
import { ItemNode, TreeData } from 'projects/ngx-tree-data/src/lib/models/models';
import { NgxTreeDataService } from 'projects/ngx-tree-data/src/public-api';
import { DATA } from './data/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Output() selectedChange = new EventEmitter<ItemNode []>();
  checkbox = true;
  search = true;
  autoSave = false;
  data = DATA;
  selectAll = false;
  dataSelected;
  dataSource: TreeData [];
  selectedNodes: ItemNode [];

  constructor(private treeService: NgxTreeDataService) {
    this.dataSource = JSON.parse(JSON.stringify(this.data));
    this.treeService.initialize(this.data);
  }

  discardChanges() {
    this.data = this.dataSource;
    this.selectedNodes = null;
    this.treeService.initialize(this.data);
  }

  saveChanges() {
    this.data = this.treeService.externalData;
    this.dataSource = this.treeService.externalData;
    this.selectedChange.emit(this.selectedNodes);
    this.treeService.initialize(this.data);
  }
}
