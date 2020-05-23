import * as tslib_1 from "tslib";
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ItemNode } from './models/models';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxTreeDataService } from './services/ngx-tree-data.service';
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
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "selected", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "autoSave", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "selectFirst", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], NgxTreeDataComponent.prototype, "selectThis", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "checkbox", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "search", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "selectAll", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], NgxTreeDataComponent.prototype, "multiple", void 0);
NgxTreeDataComponent = tslib_1.__decorate([
    Component({
        selector: 'ngx-tree-data',
        template: "<div class=\"flex\">\r\n    <div class=\"box-flex align-self-center\">\r\n      <ng-content select=\".title\"></ng-content>\r\n    </div>\r\n    <div *ngIf=\"search\" class=\"box-flex float-right\">\r\n      <mat-form-field>\r\n        <input matInput placeholder=\"Search\" (input)=\"filterChanged($event.target.value)\" autocomplete=\"off\">\r\n      </mat-form-field>\r\n    </div>\r\n  </div>\r\n  <div class=\"flex\" *ngIf=\"selectAll\">\r\n    <div class=\"box-flex\">\r\n      <button mat-stroked-button (click)=\"selectAllOptions(true)\">Select All</button>\r\n    </div>\r\n    <div class=\"box-flex\">\r\n      <button mat-stroked-button (click)=\"selectAllOptions(false)\">Deselect All</button>\r\n    </div>\r\n  </div>\r\n  <mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\">\r\n    <mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodePadding [style.padding]=\"checkbox ? '0px': '40px'\">\r\n      <button mat-button (click)=\"selected.emit(node)\" [disabled]=\"node.id == -1 ? true : false\">\r\n        <span *ngIf=\"!checkbox\">{{node.item}}</span>\r\n      </button>\r\n      <mat-checkbox *ngIf=\"checkbox\"\r\n        [checked]=\"checklistSelection.isSelected(node)\"\r\n        (change)=\"changeStatusNode(node)\">{{node.item}}</mat-checkbox>\r\n    </mat-tree-node>\r\n    <mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding>\r\n      <button mat-icon-button matTreeNodeToggle\r\n              [attr.aria-label]=\"'toggle ' + node.name\">\r\n        <mat-icon> {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}} </mat-icon>\r\n      </button>\r\n      <mat-checkbox *ngIf=\"checkbox\" \r\n        [checked]=\"checklistSelection.isSelected(node)\"\r\n        (change)=\"changeStatusNode(node)\">{{node.item}}</mat-checkbox>\r\n      <span *ngIf=\"!checkbox\">{{node.item}}</span>\r\n    </mat-tree-node>\r\n  </mat-tree>",
        styles: [":host .flex{display:flex;justify-content:space-between}:host form{width:100%}:host form mat-form-field{width:100%}"]
    }),
    tslib_1.__metadata("design:paramtypes", [NgxTreeDataService])
], NgxTreeDataComponent);
export { NgxTreeDataComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRyZWUtZGF0YS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdHJlZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL25neC10cmVlLWRhdGEuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUMxRixPQUFPLEVBQUUsUUFBUSxFQUFnQixNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFPdEUsSUFBYSxvQkFBb0IsR0FBakMsTUFBYSxvQkFBb0I7SUF3Qi9CLFlBQW9CLFFBQTRCO1FBQTVCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBdkJ0QyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQThCLENBQUM7UUFDM0QsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixlQUFVLEdBQVcsSUFBSSxDQUFDO1FBQzFCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsYUFBUSxHQUFHLElBQUksQ0FBQztRQUN6QixnQkFBVyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBQ2hELGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFFbEQsbUJBQWMsR0FBd0IsSUFBSSxDQUFDO1FBRTNDLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBUWpCLHVCQUFr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QUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQztDQUNGLENBQUE7QUE1SFc7SUFBVCxNQUFNLEVBQUU7O3NEQUEyRDtBQUMzRDtJQUFSLEtBQUssRUFBRTs7c0RBQWlCO0FBQ2hCO0lBQVIsS0FBSyxFQUFFOzt5REFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7O3dEQUEyQjtBQUMxQjtJQUFSLEtBQUssRUFBRTs7c0RBQWtCO0FBQ2pCO0lBQVIsS0FBSyxFQUFFOztvREFBZ0I7QUFDZjtJQUFSLEtBQUssRUFBRTs7dURBQW1CO0FBQ2xCO0lBQVIsS0FBSyxFQUFFOztzREFBaUI7QUFSZCxvQkFBb0I7SUFMaEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGVBQWU7UUFDekIsMDNEQUEyQzs7S0FFNUMsQ0FBQzs2Q0F5QjhCLGtCQUFrQjtHQXhCckMsb0JBQW9CLENBNkhoQztTQTdIWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE91dHB1dCwgSW5wdXQsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEl0ZW1Ob2RlLCBJdGVtRmxhdE5vZGUgfSBmcm9tICcuL21vZGVscy9tb2RlbHMnO1xuaW1wb3J0IHsgRmxhdFRyZWVDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHsgTWF0VHJlZUZsYXR0ZW5lciwgTWF0VHJlZUZsYXREYXRhU291cmNlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvdHJlZSc7XG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQgeyBOZ3hUcmVlRGF0YVNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL25neC10cmVlLWRhdGEuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC10cmVlLWRhdGEnLFxuICB0ZW1wbGF0ZVVybDogYG5neC10cmVlLWRhdGEuY29tcG9uZW50Lmh0bWxgLFxuICBzdHlsZVVybHM6IFtgbmd4LXRyZWUtZGF0YS5jb21wb25lbnQuc2Nzc2BdXG59KVxuZXhwb3J0IGNsYXNzIE5neFRyZWVEYXRhQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQge1xuICBAT3V0cHV0KCkgc2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEl0ZW1Ob2RlIHwgSXRlbUZsYXROb2RlIFtdPigpO1xuICBASW5wdXQoKSBhdXRvU2F2ZSA9IHRydWU7XG4gIEBJbnB1dCgpIHNlbGVjdEZpcnN0ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNlbGVjdFRoaXM6IG51bWJlciA9IG51bGw7XG4gIEBJbnB1dCgpIGNoZWNrYm94ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNlYXJjaCA9IGZhbHNlO1xuICBASW5wdXQoKSBzZWxlY3RBbGwgPSBmYWxzZTtcbiAgQElucHV0KCkgbXVsdGlwbGUgPSB0cnVlO1xuICBmbGF0Tm9kZU1hcCA9IG5ldyBNYXA8SXRlbUZsYXROb2RlLCBJdGVtTm9kZT4oKTtcbiAgbmVzdGVkTm9kZU1hcCA9IG5ldyBNYXA8SXRlbU5vZGUsIEl0ZW1GbGF0Tm9kZT4oKTtcblxuICBzZWxlY3RlZFBhcmVudDogSXRlbUZsYXROb2RlIHwgbnVsbCA9IG51bGw7XG5cbiAgbmV3SXRlbU5hbWUgPSAnJztcblxuICB0cmVlQ29udHJvbDogRmxhdFRyZWVDb250cm9sPEl0ZW1GbGF0Tm9kZT47XG5cbiAgdHJlZUZsYXR0ZW5lcjogTWF0VHJlZUZsYXR0ZW5lcjxJdGVtTm9kZSwgSXRlbUZsYXROb2RlPjtcblxuICBkYXRhU291cmNlOiBNYXRUcmVlRmxhdERhdGFTb3VyY2U8SXRlbU5vZGUsIEl0ZW1GbGF0Tm9kZT47XG5cbiAgY2hlY2tsaXN0U2VsZWN0aW9uID0gbmV3IFNlbGVjdGlvbk1vZGVsPEl0ZW1GbGF0Tm9kZT4odGhpcy5tdWx0aXBsZSk7XG4gIGxvYWRlcklkOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGF0YWJhc2U6IE5neFRyZWVEYXRhU2VydmljZSkge1xuICAgIHRoaXMudHJlZUZsYXR0ZW5lciA9IG5ldyBNYXRUcmVlRmxhdHRlbmVyKHRoaXMudHJhbnNmb3JtZXIsIHRoaXMuZ2V0TGV2ZWwsXG4gICAgICB0aGlzLmlzRXhwYW5kYWJsZSwgdGhpcy5nZXRDaGlsZHJlbik7XG4gICAgdGhpcy50cmVlQ29udHJvbCA9IG5ldyBGbGF0VHJlZUNvbnRyb2w8SXRlbUZsYXROb2RlPih0aGlzLmdldExldmVsLCB0aGlzLmlzRXhwYW5kYWJsZSk7XG4gICAgdGhpcy5kYXRhU291cmNlID0gbmV3IE1hdFRyZWVGbGF0RGF0YVNvdXJjZSh0aGlzLnRyZWVDb250cm9sLCB0aGlzLnRyZWVGbGF0dGVuZXIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5kYXRhYmFzZS5kYXRhQ2hhbmdlLnN1YnNjcmliZSggZGF0YSA9PiB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RGaXJzdCkge1xuICAgICAgICBkYXRhLmZvckVhY2goIGVsID0+IHtcbiAgICAgICAgICBpZiAoZWwuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGVsLmNoaWxkcmVuLmZvckVhY2goIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmVtaXQoaXRlbSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdFRoaXMpIHtcbiAgICAgICAgZGF0YS5maWx0ZXIoIChvOiBJdGVtTm9kZSkgPT4gKG8uaWQgYXMgbnVtYmVyKSA9PT0gKHRoaXMuc2VsZWN0VGhpcyBhcyBudW1iZXIpIClcbiAgICAgICAgICAubWFwKCAoaXRlbTogSXRlbU5vZGUgKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkLmVtaXQoaXRlbSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGFTb3VyY2UuZGF0YSA9IGRhdGE7XG4gICAgfSk7XG4gIH1cblxuICBnZXRMZXZlbCA9IChub2RlOiBJdGVtRmxhdE5vZGUpID0+IG5vZGUubGV2ZWw7XG5cbiAgaXNFeHBhbmRhYmxlID0gKG5vZGU6IEl0ZW1GbGF0Tm9kZSkgPT4gbm9kZS5leHBhbmRhYmxlO1xuXG4gIGdldENoaWxkcmVuID0gKG5vZGU6IEl0ZW1Ob2RlKTogSXRlbU5vZGUgW10gPT4gbm9kZS5jaGlsZHJlbjtcblxuICBoYXNDaGlsZCA9IChfOiBudW1iZXIsIF9ub2RlRGF0YTogSXRlbUZsYXROb2RlKSA9PiBfbm9kZURhdGEuZXhwYW5kYWJsZTtcblxuICB0cmFuc2Zvcm1lciA9IChub2RlOiBJdGVtTm9kZSwgbGV2ZWw6IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nTm9kZSA9IHRoaXMubmVzdGVkTm9kZU1hcC5nZXQobm9kZSk7XG4gICAgbGV0IGZsYXROb2RlO1xuICAgIGZsYXROb2RlID0gZXhpc3RpbmdOb2RlICYmIGV4aXN0aW5nTm9kZS5pdGVtID09PSBub2RlLml0ZW0gPyBleGlzdGluZ05vZGUgOiBuZXcgSXRlbU5vZGUoKTtcbiAgICBmbGF0Tm9kZS5pdGVtID0gbm9kZS5pdGVtO1xuICAgIGZsYXROb2RlLmxldmVsID0gbGV2ZWw7XG4gICAgZmxhdE5vZGUuY29kZSA9IG5vZGUuY29kZTtcbiAgICBmbGF0Tm9kZS5kYXRhID0gbm9kZS5kYXRhO1xuICAgIGZsYXROb2RlLnNlbGVjdGVkID0gbm9kZS5zZWxlY3RlZDtcbiAgICBmbGF0Tm9kZS5pZCA9IG5vZGUuaWQ7XG4gICAgaWYgKGZsYXROb2RlLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5zZWxlY3QoZmxhdE5vZGUpO1xuICAgIH1cbiAgICBmbGF0Tm9kZS5leHBhbmRhYmxlID0gbm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG4gICAgdGhpcy5mbGF0Tm9kZU1hcC5zZXQoZmxhdE5vZGUsIG5vZGUpO1xuICAgIHRoaXMubmVzdGVkTm9kZU1hcC5zZXQobm9kZSwgZmxhdE5vZGUpO1xuICAgIHJldHVybiBmbGF0Tm9kZTtcbiAgfVxuXG4gIGRlc2NlbmRhbnRzQWxsU2VsZWN0ZWQobm9kZTogSXRlbUZsYXROb2RlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGVzY2VuZGFudHMgPSB0aGlzLnRyZWVDb250cm9sLmdldERlc2NlbmRhbnRzKG5vZGUpO1xuICAgIHJldHVybiBkZXNjZW5kYW50cy5ldmVyeShjaGlsZCA9PiB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5pc1NlbGVjdGVkKGNoaWxkKSk7XG4gIH1cblxuICBkZXNjZW5kYW50c1BhcnRpYWxseVNlbGVjdGVkKG5vZGU6IEl0ZW1GbGF0Tm9kZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGRlc2NlbmRhbnRzID0gdGhpcy50cmVlQ29udHJvbC5nZXREZXNjZW5kYW50cyhub2RlKTtcbiAgICBjb25zdCByZXN1bHQgPSBkZXNjZW5kYW50cy5zb21lKGNoaWxkID0+IHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmlzU2VsZWN0ZWQoY2hpbGQpKTtcbiAgICByZXR1cm4gcmVzdWx0ICYmICF0aGlzLmRlc2NlbmRhbnRzQWxsU2VsZWN0ZWQobm9kZSk7XG4gIH1cblxuICB0b2RvSXRlbVNlbGVjdGlvblRvZ2dsZShub2RlOiBJdGVtRmxhdE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi50b2dnbGUobm9kZSk7XG4gICAgY29uc3QgZGVzY2VuZGFudHMgPSB0aGlzLnRyZWVDb250cm9sLmdldERlc2NlbmRhbnRzKG5vZGUpO1xuICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmlzU2VsZWN0ZWQobm9kZSlcbiAgICAgID8gdGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uc2VsZWN0KC4uLmRlc2NlbmRhbnRzKVxuICAgICAgOiB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5kZXNlbGVjdCguLi5kZXNjZW5kYW50cyk7XG4gIH1cblxuICBmaWx0ZXJDaGFuZ2VkKGZpbHRlclRleHQ6IHN0cmluZykge1xuICAgIHRoaXMuZGF0YWJhc2UuZmlsdGVyKGZpbHRlclRleHQpO1xuICAgIGlmIChmaWx0ZXJUZXh0KSB7XG4gICAgICB0aGlzLnRyZWVDb250cm9sLmV4cGFuZEFsbCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyZWVDb250cm9sLmNvbGxhcHNlQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU3RhdHVzTm9kZShub2RlOiBJdGVtRmxhdE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi50b2dnbGUobm9kZSk7XG4gICAgdGhpcy5kYXRhYmFzZS51cGRhdGVEYXRhKHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnNlbGVjdGVkKTtcbiAgICB0aGlzLnNlbGVjdGVkLmVtaXQodGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uc2VsZWN0ZWQpO1xuICB9XG5cbiAgc2VsZWN0QWxsT3B0aW9ucyhtb2RlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKG1vZGUpIHtcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnNlbGVjdCguLi50aGlzLnRyZWVDb250cm9sLmRhdGFOb2Rlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmRlc2VsZWN0KC4uLnRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzKTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZC5lbWl0KHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnNlbGVjdGVkKTtcbiAgICB0aGlzLmRhdGFiYXNlLnVwZGF0ZURhdGEodGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uc2VsZWN0ZWQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhU291cmNlLmRhdGEgPSBbXTtcbiAgfVxufVxuIl19