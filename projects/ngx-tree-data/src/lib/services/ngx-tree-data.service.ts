import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { ItemNode, TreeData } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class NgxTreeDataService {
  dataChange = new BehaviorSubject<ItemNode []>(null);
  treeData: any [];
  externalData: TreeData [];
  dataSource = [];
  get data(): ItemNode [] { return  this.dataChange.value; }
  loaderId: string;
  constructor(private platformLocation: PlatformLocation) {}

  initialize(data: TreeData []) {
    this.externalData = data;
    this.dataSource = this.generateDataWithCode(data);
    this.treeData = this.dataSource;
    const newData = this.buildFileTree(this.dataSource, '0');
    this.dataChange.next(newData);
  }

  private generateDataWithCode(data: TreeData []): any[] {
    const newData = [];
    let parent = 1;
    data.forEach( item => {
      newData.push(
        {
          text: item.text,
          id: item.id,
          code: `0.${parent}`,
          selected: item.selected,
          data: item.data
        }
      );
      const childrens = item.children;
      if ( childrens.length > 0) {
        let children = 1;
        childrens.forEach( el => {
          newData.push(
            {
              text : el.text,
              code : `0.${parent}.${children}`,
              selected: el.selected,
              id: el.id,
              data : item.data
            }
          );
          children++;
        });
      }
      parent++;
    });
    return newData;
  }

  private buildFileTree(obj: any[], level: string): ItemNode [] {
    return obj.filter(o =>
      (o.code as string).startsWith(level + '.')
      && (o.code.match(/\./g) || []).length === (level.match(/\./g) || []).length + 1
    )
      .map(o => {
        const node = new ItemNode();
        node.item = o.text;
        node.code = o.code;
        node.data = o.data;
        node.id = o.id;
        node.selected = o.selected;
        const children = obj.filter(so => (so.code as string).startsWith(level + '.'));
        if (children && children.length > 0) {
            node.children = this.buildFileTree(children, o.code);
          }
        return node;
      });
  }

  public filter(filterText: string) {
    let filteredTreeData;
    if (filterText) {
      filteredTreeData = this.treeData.filter(d => d.text.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
      Object.assign([], filteredTreeData).forEach(ftd => {
        let str = (ftd.code as string);
        while (str.lastIndexOf('.') > -1) {
          const index = str.lastIndexOf('.');
          str = str.substring(0, index);
          if (filteredTreeData.findIndex(t => t.code === str) === -1) {
            const obj = this.treeData.find(d => d.code === str);
            if (obj) {
              filteredTreeData.push(obj);
            }
          }
        }
      });
    } else {
      filteredTreeData = this.treeData;
    }
    const data = this.buildFileTree(filteredTreeData, '0');
    this.dataChange.next(data);
  }

  public updateData(items: ItemNode [], externalData ?: TreeData [] | null): void {
    if (!externalData) {
      externalData = this.externalData;
    }
    externalData.map( (obj: TreeData) => {
      items.filter( (o: ItemNode) => (o.item as string).localeCompare(obj.text as string) ? null :  obj.selected = true);
      const children = obj.children;
      if (children && obj.children.length > 0) {
        this.updateData(items, children);
      }
    });
  }
}
