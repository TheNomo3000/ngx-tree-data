import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { ItemNode } from '../models/models';

interface IData {
  data: ItemNode [];
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NgxTreeDataService {
  dataChange = new BehaviorSubject<IData>({data: [], type: ''});
  treeData: any[];
  type: string;
  dataSource = [];
  get data(): IData { return  this.dataChange.value; }
  loaderId: string;
  constructor(private platformLocation: PlatformLocation) {}

  initialize(data: any, type: string) {
    this.type = type;
    this.dataSource = data;
    this.treeData = this.dataSource;
    const newData = {
      data: this.buildFileTree(this.dataSource, '0'),
      type: this.type
    };
    this.dataChange.next(newData);
  }

  buildFileTree(obj: any[], level: string): ItemNode [] {
    return obj.filter(o =>
      (o.code as string).startsWith(level + '.')
      && (o.code.match(/\./g) || []).length === (level.match(/\./g) || []).length + 1
    )
      .map(o => {
        const node = new ItemNode();
        node.item = o.text;
        node.code = o.code;
        node.data = o.data;
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

    const data = {
      data: this.buildFileTree(filteredTreeData, '0'),
      type: this.type
    };
    this.dataChange.next(data);
  }
}
