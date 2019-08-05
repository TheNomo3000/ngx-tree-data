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
          id: item.id,
          text: item.name,
          code: `0.${parent}`,
          data: {
            parent: true,
          }
        }
      );
      const childrens = item.childrens;
      if ( childrens.length > 0) {
        childrens.forEach( subitem => {
          dataSource.push(
            {
              id: subitem.id,
              text : subitem.name,
              code : `0.${parent}.${children}`,
              parent: item.name,
              data : {
                parent: false,
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
