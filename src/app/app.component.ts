import { Component, Output, EventEmitter } from '@angular/core';
import { ItemNode, TreeData } from 'projects/ngx-tree-data/src/lib/models/models';
import { NgxTreeDataService } from 'projects/ngx-tree-data/src/public-api';
import { DATA } from './data/data';
import { NgxTreeDataConfig } from 'projects/ngx-tree-data/src/lib/models/config-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Output() selectedChange = new EventEmitter<ItemNode []>();
  config: NgxTreeDataConfig = {
    selectFirst: false,
    selectThis: -1,
    checkbox: true,
    search: false,
    selectAll: false,
    multiple: false,
  };

  data = DATA;
  dataSelected;
  dataSource: TreeData [];
  selectedNodes: ItemNode [];

  constructor(private treeService: NgxTreeDataService) {
    this.dataSource = JSON.parse(JSON.stringify(this.data));
    this.treeService.initialize(this.data);
    this.treeService.dataChange.subscribe( (e) => {
      console.log(e);
    });
  }

  discardChanges() {
    this.data = this.dataSource;
    this.selectedNodes = null;
    this.treeService.initialize(this.data);
  }

  saveChanges() {
    this.data = [...this.treeService.externalData];
    this.dataSource = [...this.treeService.externalData];
    this.selectedChange.emit(this.selectedNodes);
    console.log('DATA :', this.data);
    console.log('DATAs :', this.dataSource);
    this.treeService.initialize(this.data);
  }

  reloadConfig(e): void {
    this.config = {...this.config};
  }
}
