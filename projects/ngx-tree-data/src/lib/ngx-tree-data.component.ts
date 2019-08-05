import { Component, Output, Input, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ItemNode, ItemFlatNode } from './models/models';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxTreeDataService } from './services/ngx-tree-data.service';

@Component({
  selector: 'ngx-tree-data',
  templateUrl: `ngx-tree-data.component.html`,
  styleUrls: [`ngx-tree-data.component.scss`]
})
export class NgxTreeDataComponent implements OnDestroy, OnInit {
  @Output() selected = new EventEmitter<ItemNode | ItemFlatNode []>();
  @Input() selectFirst = false;
  @Input() selectThis: number = null;
  @Input() checkbox = false;
  @Input() search = false;
  @Input() multiple = true;
  flatNodeMap = new Map<ItemFlatNode, ItemNode>();
  nestedNodeMap = new Map<ItemNode, ItemFlatNode>();

  selectedParent: ItemFlatNode | null = null;

  newItemName = '';

  treeControl: FlatTreeControl<ItemFlatNode>;

  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;

  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;

  checklistSelection = new SelectionModel<ItemFlatNode>(this.multiple);
  loaderId: string;
  constructor(private database: NgxTreeDataService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.database.dataChange.subscribe( data => {
      if (this.selectFirst) {
        data.forEach( el => {
          if (el.children) {
            el.children.forEach( item => {
              this.selected.emit(item);
            });
          }
        });
      } else if (this.selectThis) {
        data.filter( (o: ItemNode) => (o.id as number) === (this.selectThis as number) )
          .map( (item: ItemNode ) => {
            this.selected.emit(item);
          });
      }
      this.dataSource.data = data;
    });
  }

  getLevel = (node: ItemFlatNode) => node.level;

  isExpandable = (node: ItemFlatNode) => node.expandable;

  getChildren = (node: ItemNode): ItemNode [] => node.children;

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  transformer = (node: ItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    let flatNode;
    flatNode = existingNode && existingNode.item === node.item ? existingNode : new ItemNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.code = node.code;
    flatNode.data = node.data;
    flatNode.selected = node.selected;
    flatNode.id = node.id;
    if (flatNode.selected) {
      this.checklistSelection.select(flatNode);
    }
    flatNode.expandable = node.children && node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  todoItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  filterChanged(filterText: string) {
    this.checklistSelection = new SelectionModel<ItemFlatNode>(this.multiple);
    this.selected.emit(this.checklistSelection.selected);
    this.database.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  changeStatusNode(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    if (this.checklistSelection.isSelected(node)) {
      node.selected = true;
    }
    this.database.updateData(this.checklistSelection.selected);
    this.selected.emit(this.checklistSelection.selected);
  }

  ngOnDestroy(): void {
    this.dataSource.data = [];
  }
}
