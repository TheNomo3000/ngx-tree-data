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
  data = DATA;
  dataSelected;
  constructor(private treeService: NgxTreeDataService) {
    const dataSource = [];
    let parent = 1;
    let children = 1;
    this.data.forEach( item => {
      dataSource.push(
        {
          text: item.name,
          code: `0.${parent}`,
          data: {
            parent: true,
            id: item.id
          }
        }
      );
      const childrens = item.childrens;
      if ( childrens.length > 0) {
        childrens.forEach( subitem => {
          dataSource.push(
            {
              text : subitem.name,
              code : `0.${parent}.${children}`,
              parent: item.name,
              data : {
                parent: false,
                id: subitem.id,
              }
            }
          );
          children++;
        });
      }
      parent++;
    });
    this.treeService.initialize(dataSource);
  }
}
