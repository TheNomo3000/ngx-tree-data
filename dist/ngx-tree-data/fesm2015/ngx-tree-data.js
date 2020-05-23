import { __decorate, __metadata } from 'tslib';
import { ɵɵdefineInjectable, ɵɵinject, Injectable, EventEmitter, Output, Input, Component, NgModule } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

class ItemNode {
    constructor() {
        this.id = -1;
    }
}

let NgxTreeDataService = class NgxTreeDataService {
    constructor(platformLocation) {
        this.platformLocation = platformLocation;
        this.dataChange = new BehaviorSubject(null);
        this.dataSource = [];
    }
    get data() { return this.dataChange.value; }
    initialize(data) {
        this.externalData = data;
        const newData = this.generateData(this.externalData);
        this.dataChange.next(newData);
    }
    generateData(data) {
        this.dataSource = this.generateDataWithCode(data);
        this.treeData = this.dataSource;
        return this.buildFileTree(this.dataSource, '0');
    }
    generateDataWithCode(data) {
        const newData = [];
        let parent = 1;
        data.forEach(item => {
            newData.push({
                text: item.text,
                id: item.id,
                code: `0.${parent}`,
                selected: item.selected,
                data: item.data
            });
            const childrens = item.children;
            if (childrens.length > 0) {
                let children = 1;
                childrens.forEach(el => {
                    const itemChildren = {
                        text: el.text,
                        code: `0.${parent}.${children}`,
                        selected: el.selected,
                        id: el.id,
                        data: el.data
                    };
                    newData.push(itemChildren);
                    children++;
                });
            }
            parent++;
        });
        return newData;
    }
    buildFileTree(obj, level) {
        return obj.filter(o => o.code.startsWith(level + '.')
            && (o.code.match(/\./g) || []).length === (level.match(/\./g) || []).length + 1)
            .map(o => {
            const node = new ItemNode();
            node.item = o.text;
            node.selected = o.selected;
            node.id = o.id;
            node.code = o.code;
            node.data = o.data;
            const children = obj.filter(so => so.code.startsWith(level + '.'));
            if (children && children.length > 0) {
                node.children = this.buildFileTree(children, o.code);
            }
            return node;
        });
    }
    filter(filterText) {
        this.treeData = this.generateDataWithCode(this.externalData);
        let filteredTreeData;
        if (filterText) {
            filteredTreeData = this.treeData.filter(d => d.text.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
            Object.assign([], filteredTreeData).forEach(ftd => {
                let str = ftd.code;
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
        }
        else {
            filteredTreeData = this.treeData;
        }
        const data = this.buildFileTree(filteredTreeData, '0');
        this.dataChange.next(data);
    }
    updateData(items, externalData) {
        this.externalData = this.recursiveUpdate(items, this.externalData);
    }
    recursiveUpdate(items, externalData) {
        externalData.map(data => {
            data.selected = false;
            items.forEach(el => {
                if (el.id === data.id) {
                    data.selected = true;
                }
            });
            const children = data.children;
            if (children && data.children.length > 0) {
                this.recursiveUpdate(items, children);
            }
        });
        return externalData;
    }
};
NgxTreeDataService.ngInjectableDef = ɵɵdefineInjectable({ factory: function NgxTreeDataService_Factory() { return new NgxTreeDataService(ɵɵinject(PlatformLocation)); }, token: NgxTreeDataService, providedIn: "root" });
NgxTreeDataService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [PlatformLocation])
], NgxTreeDataService);

let NgxTreeDataComponent = class NgxTreeDataComponent {
    constructor(database) {
        this.database = database;
        this.selected = new EventEmitter();
        this.autoSave = true;
        this.selectFirst = false;
        this.selectThis = null;
        this.checkbox = false;
        this.search = false;
        this.selectAll = false;
        this.multiple = true;
        this.flatNodeMap = new Map();
        this.nestedNodeMap = new Map();
        this.selectedParent = null;
        this.newItemName = '';
        this.checklistSelection = new SelectionModel(this.multiple);
        this.getLevel = (node) => node.level;
        this.isExpandable = (node) => node.expandable;
        this.getChildren = (node) => node.children;
        this.hasChild = (_, _nodeData) => _nodeData.expandable;
        this.transformer = (node, level) => {
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
        };
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }
    ngOnInit() {
        this.database.dataChange.subscribe(data => {
            if (this.selectFirst) {
                data.forEach(el => {
                    if (el.children) {
                        el.children.forEach(item => {
                            this.selected.emit(item);
                        });
                    }
                });
            }
            else if (this.selectThis) {
                data.filter((o) => o.id === this.selectThis)
                    .map((item) => {
                    this.selected.emit(item);
                });
            }
            this.dataSource.data = data;
        });
    }
    descendantsAllSelected(node) {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.checklistSelection.isSelected(child));
    }
    descendantsPartiallySelected(node) {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }
    todoItemSelectionToggle(node) {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);
    }
    filterChanged(filterText) {
        this.database.filter(filterText);
        if (filterText) {
            this.treeControl.expandAll();
        }
        else {
            this.treeControl.collapseAll();
        }
    }
    changeStatusNode(node) {
        this.checklistSelection.toggle(node);
        this.database.updateData(this.checklistSelection.selected);
        this.selected.emit(this.checklistSelection.selected);
    }
    selectAllOptions(mode) {
        if (mode) {
            this.checklistSelection.select(...this.treeControl.dataNodes);
        }
        else {
            this.checklistSelection.deselect(...this.treeControl.dataNodes);
        }
        this.selected.emit(this.checklistSelection.selected);
        this.database.updateData(this.checklistSelection.selected);
    }
    ngOnDestroy() {
        this.dataSource.data = [];
    }
};
__decorate([
    Output(),
    __metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "selected", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "autoSave", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "selectFirst", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], NgxTreeDataComponent.prototype, "selectThis", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "checkbox", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "search", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "selectAll", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "multiple", void 0);
NgxTreeDataComponent = __decorate([
    Component({
        selector: 'ngx-tree-data',
        template: "<div class=\"flex\">\r\n    <div class=\"box-flex align-self-center\">\r\n      <ng-content select=\".title\"></ng-content>\r\n    </div>\r\n    <div *ngIf=\"search\" class=\"box-flex float-right\">\r\n      <mat-form-field>\r\n        <input matInput placeholder=\"Search\" (input)=\"filterChanged($event.target.value)\" autocomplete=\"off\">\r\n      </mat-form-field>\r\n    </div>\r\n  </div>\r\n  <div class=\"flex\" *ngIf=\"selectAll\">\r\n    <div class=\"box-flex\">\r\n      <button mat-stroked-button (click)=\"selectAllOptions(true)\">Select All</button>\r\n    </div>\r\n    <div class=\"box-flex\">\r\n      <button mat-stroked-button (click)=\"selectAllOptions(false)\">Deselect All</button>\r\n    </div>\r\n  </div>\r\n  <mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\">\r\n    <mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodePadding [style.padding]=\"checkbox ? '0px': '40px'\">\r\n      <button mat-button (click)=\"selected.emit(node)\" [disabled]=\"node.id == -1 ? true : false\">\r\n        <span *ngIf=\"!checkbox\">{{node.item}}</span>\r\n      </button>\r\n      <mat-checkbox *ngIf=\"checkbox\"\r\n        [checked]=\"checklistSelection.isSelected(node)\"\r\n        (change)=\"changeStatusNode(node)\">{{node.item}}</mat-checkbox>\r\n    </mat-tree-node>\r\n    <mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding>\r\n      <button mat-icon-button matTreeNodeToggle\r\n              [attr.aria-label]=\"'toggle ' + node.name\">\r\n        <mat-icon> {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}} </mat-icon>\r\n      </button>\r\n      <mat-checkbox *ngIf=\"checkbox\" \r\n        [checked]=\"checklistSelection.isSelected(node)\"\r\n        (change)=\"changeStatusNode(node)\">{{node.item}}</mat-checkbox>\r\n      <span *ngIf=\"!checkbox\">{{node.item}}</span>\r\n    </mat-tree-node>\r\n  </mat-tree>",
        styles: [":host .flex{display:flex;justify-content:space-between}:host form{width:100%}:host form mat-form-field{width:100%}"]
    }),
    __metadata("design:paramtypes", [NgxTreeDataService])
], NgxTreeDataComponent);

let NgxTreeDataModule = class NgxTreeDataModule {
};
NgxTreeDataModule = __decorate([
    NgModule({
        declarations: [
            NgxTreeDataComponent
        ],
        imports: [
            BrowserModule,
            MatButtonModule,
            MatCheckboxModule,
            MatFormFieldModule,
            MatTreeModule,
            MatIconModule,
            MatInputModule
        ],
        exports: [
            NgxTreeDataComponent
        ],
    })
], NgxTreeDataModule);

export { NgxTreeDataComponent, NgxTreeDataModule, NgxTreeDataService };
//# sourceMappingURL=ngx-tree-data.js.map
