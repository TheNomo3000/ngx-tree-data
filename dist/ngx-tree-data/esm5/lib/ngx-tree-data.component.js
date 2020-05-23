import * as tslib_1 from "tslib";
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { ItemNode } from './models/models';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxTreeDataService } from './services/ngx-tree-data.service';
var NgxTreeDataComponent = /** @class */ (function () {
    function NgxTreeDataComponent(database) {
        var _this = this;
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
        this.getLevel = function (node) { return node.level; };
        this.isExpandable = function (node) { return node.expandable; };
        this.getChildren = function (node) { return node.children; };
        this.hasChild = function (_, _nodeData) { return _nodeData.expandable; };
        this.transformer = function (node, level) {
            var existingNode = _this.nestedNodeMap.get(node);
            var flatNode;
            flatNode = existingNode && existingNode.item === node.item ? existingNode : new ItemNode();
            flatNode.item = node.item;
            flatNode.level = level;
            flatNode.code = node.code;
            flatNode.data = node.data;
            flatNode.selected = node.selected;
            flatNode.id = node.id;
            if (flatNode.selected) {
                _this.checklistSelection.select(flatNode);
            }
            flatNode.expandable = node.children && node.children.length > 0;
            _this.flatNodeMap.set(flatNode, node);
            _this.nestedNodeMap.set(node, flatNode);
            return flatNode;
        };
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }
    NgxTreeDataComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.database.dataChange.subscribe(function (data) {
            if (_this.selectFirst) {
                data.forEach(function (el) {
                    if (el.children) {
                        el.children.forEach(function (item) {
                            _this.selected.emit(item);
                        });
                    }
                });
            }
            else if (_this.selectThis) {
                data.filter(function (o) { return o.id === _this.selectThis; })
                    .map(function (item) {
                    _this.selected.emit(item);
                });
            }
            _this.dataSource.data = data;
        });
    };
    NgxTreeDataComponent.prototype.descendantsAllSelected = function (node) {
        var _this = this;
        var descendants = this.treeControl.getDescendants(node);
        return descendants.every(function (child) { return _this.checklistSelection.isSelected(child); });
    };
    NgxTreeDataComponent.prototype.descendantsPartiallySelected = function (node) {
        var _this = this;
        var descendants = this.treeControl.getDescendants(node);
        var result = descendants.some(function (child) { return _this.checklistSelection.isSelected(child); });
        return result && !this.descendantsAllSelected(node);
    };
    NgxTreeDataComponent.prototype.todoItemSelectionToggle = function (node) {
        var _a, _b;
        this.checklistSelection.toggle(node);
        var descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? (_a = this.checklistSelection).select.apply(_a, tslib_1.__spread(descendants)) : (_b = this.checklistSelection).deselect.apply(_b, tslib_1.__spread(descendants));
    };
    NgxTreeDataComponent.prototype.filterChanged = function (filterText) {
        this.database.filter(filterText);
        if (filterText) {
            this.treeControl.expandAll();
        }
        else {
            this.treeControl.collapseAll();
        }
    };
    NgxTreeDataComponent.prototype.changeStatusNode = function (node) {
        this.checklistSelection.toggle(node);
        this.database.updateData(this.checklistSelection.selected);
        this.selected.emit(this.checklistSelection.selected);
    };
    NgxTreeDataComponent.prototype.selectAllOptions = function (mode) {
        var _a, _b;
        if (mode) {
            (_a = this.checklistSelection).select.apply(_a, tslib_1.__spread(this.treeControl.dataNodes));
        }
        else {
            (_b = this.checklistSelection).deselect.apply(_b, tslib_1.__spread(this.treeControl.dataNodes));
        }
        this.selected.emit(this.checklistSelection.selected);
        this.database.updateData(this.checklistSelection.selected);
    };
    NgxTreeDataComponent.prototype.ngOnDestroy = function () {
        this.dataSource.data = [];
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
    return NgxTreeDataComponent;
}());
export { NgxTreeDataComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRyZWUtZGF0YS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdHJlZS1kYXRhLyIsInNvdXJjZXMiOlsibGliL25neC10cmVlLWRhdGEuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUMxRixPQUFPLEVBQUUsUUFBUSxFQUFnQixNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFPdEU7SUF3QkUsOEJBQW9CLFFBQTRCO1FBQWhELGlCQUtDO1FBTG1CLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBdkJ0QyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQThCLENBQUM7UUFDM0QsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixlQUFVLEdBQVcsSUFBSSxDQUFDO1FBQzFCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsYUFBUSxHQUFHLElBQUksQ0FBQztRQUN6QixnQkFBVyxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBQ2hELGtCQUFhLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFFbEQsbUJBQWMsR0FBd0IsSUFBSSxDQUFDO1FBRTNDLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBUWpCLHVCQUFrQixHQUFHLElBQUksY0FBYyxD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TTtZQUNMLENBQUEsS0FBQSxJQUFJLENBQUMsa0JBQWtCLENBQUEsQ0FBQyxRQUFRLDRCQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFFO1NBQ2pFO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsMENBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBM0hTO1FBQVQsTUFBTSxFQUFFOzswREFBMkQ7SUFDM0Q7UUFBUixLQUFLLEVBQUU7OzBEQUFpQjtJQUNoQjtRQUFSLEtBQUssRUFBRTs7NkRBQXFCO0lBQ3BCO1FBQVIsS0FBSyxFQUFFOzs0REFBMkI7SUFDMUI7UUFBUixLQUFLLEVBQUU7OzBEQUFrQjtJQUNqQjtRQUFSLEtBQUssRUFBRTs7d0RBQWdCO0lBQ2Y7UUFBUixLQUFLLEVBQUU7OzJEQUFtQjtJQUNsQjtRQUFSLEtBQUssRUFBRTs7MERBQWlCO0lBUmQsb0JBQW9CO1FBTGhDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLDAzREFBMkM7O1NBRTVDLENBQUM7aURBeUI4QixrQkFBa0I7T0F4QnJDLG9CQUFvQixDQTZIaEM7SUFBRCwyQkFBQztDQUFBLEFBN0hELElBNkhDO1NBN0hZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT3V0cHV0LCBJbnB1dCwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSXRlbU5vZGUsIEl0ZW1GbGF0Tm9kZSB9IGZyb20gJy4vbW9kZWxzL21vZGVscyc7XG5pbXBvcnQgeyBGbGF0VHJlZUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQgeyBNYXRUcmVlRmxhdHRlbmVyLCBNYXRUcmVlRmxhdERhdGFTb3VyY2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90cmVlJztcbmltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7IE5neFRyZWVEYXRhU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbmd4LXRyZWUtZGF0YS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXRyZWUtZGF0YScsXG4gIHRlbXBsYXRlVXJsOiBgbmd4LXRyZWUtZGF0YS5jb21wb25lbnQuaHRtbGAsXG4gIHN0eWxlVXJsczogW2BuZ3gtdHJlZS1kYXRhLmNvbXBvbmVudC5zY3NzYF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4VHJlZURhdGFDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIEBPdXRwdXQoKSBzZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8SXRlbU5vZGUgfCBJdGVtRmxhdE5vZGUgW10+KCk7XG4gIEBJbnB1dCgpIGF1dG9TYXZlID0gdHJ1ZTtcbiAgQElucHV0KCkgc2VsZWN0Rmlyc3QgPSBmYWxzZTtcbiAgQElucHV0KCkgc2VsZWN0VGhpczogbnVtYmVyID0gbnVsbDtcbiAgQElucHV0KCkgY2hlY2tib3ggPSBmYWxzZTtcbiAgQElucHV0KCkgc2VhcmNoID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNlbGVjdEFsbCA9IGZhbHNlO1xuICBASW5wdXQoKSBtdWx0aXBsZSA9IHRydWU7XG4gIGZsYXROb2RlTWFwID0gbmV3IE1hcDxJdGVtRmxhdE5vZGUsIEl0ZW1Ob2RlPigpO1xuICBuZXN0ZWROb2RlTWFwID0gbmV3IE1hcDxJdGVtTm9kZSwgSXRlbUZsYXROb2RlPigpO1xuXG4gIHNlbGVjdGVkUGFyZW50OiBJdGVtRmxhdE5vZGUgfCBudWxsID0gbnVsbDtcblxuICBuZXdJdGVtTmFtZSA9ICcnO1xuXG4gIHRyZWVDb250cm9sOiBGbGF0VHJlZUNvbnRyb2w8SXRlbUZsYXROb2RlPjtcblxuICB0cmVlRmxhdHRlbmVyOiBNYXRUcmVlRmxhdHRlbmVyPEl0ZW1Ob2RlLCBJdGVtRmxhdE5vZGU+O1xuXG4gIGRhdGFTb3VyY2U6IE1hdFRyZWVGbGF0RGF0YVNvdXJjZTxJdGVtTm9kZSwgSXRlbUZsYXROb2RlPjtcblxuICBjaGVja2xpc3RTZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uTW9kZWw8SXRlbUZsYXROb2RlPih0aGlzLm11bHRpcGxlKTtcbiAgbG9hZGVySWQ6IHN0cmluZztcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkYXRhYmFzZTogTmd4VHJlZURhdGFTZXJ2aWNlKSB7XG4gICAgdGhpcy50cmVlRmxhdHRlbmVyID0gbmV3IE1hdFRyZWVGbGF0dGVuZXIodGhpcy50cmFuc2Zvcm1lciwgdGhpcy5nZXRMZXZlbCxcbiAgICAgIHRoaXMuaXNFeHBhbmRhYmxlLCB0aGlzLmdldENoaWxkcmVuKTtcbiAgICB0aGlzLnRyZWVDb250cm9sID0gbmV3IEZsYXRUcmVlQ29udHJvbDxJdGVtRmxhdE5vZGU+KHRoaXMuZ2V0TGV2ZWwsIHRoaXMuaXNFeHBhbmRhYmxlKTtcbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBuZXcgTWF0VHJlZUZsYXREYXRhU291cmNlKHRoaXMudHJlZUNvbnRyb2wsIHRoaXMudHJlZUZsYXR0ZW5lcik7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmRhdGFiYXNlLmRhdGFDaGFuZ2Uuc3Vic2NyaWJlKCBkYXRhID0+IHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdEZpcnN0KSB7XG4gICAgICAgIGRhdGEuZm9yRWFjaCggZWwgPT4ge1xuICAgICAgICAgIGlmIChlbC5jaGlsZHJlbikge1xuICAgICAgICAgICAgZWwuY2hpbGRyZW4uZm9yRWFjaCggaXRlbSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuZW1pdChpdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0VGhpcykge1xuICAgICAgICBkYXRhLmZpbHRlciggKG86IEl0ZW1Ob2RlKSA9PiAoby5pZCBhcyBudW1iZXIpID09PSAodGhpcy5zZWxlY3RUaGlzIGFzIG51bWJlcikgKVxuICAgICAgICAgIC5tYXAoIChpdGVtOiBJdGVtTm9kZSApID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQuZW1pdChpdGVtKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGF0YVNvdXJjZS5kYXRhID0gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldExldmVsID0gKG5vZGU6IEl0ZW1GbGF0Tm9kZSkgPT4gbm9kZS5sZXZlbDtcblxuICBpc0V4cGFuZGFibGUgPSAobm9kZTogSXRlbUZsYXROb2RlKSA9PiBub2RlLmV4cGFuZGFibGU7XG5cbiAgZ2V0Q2hpbGRyZW4gPSAobm9kZTogSXRlbU5vZGUpOiBJdGVtTm9kZSBbXSA9PiBub2RlLmNoaWxkcmVuO1xuXG4gIGhhc0NoaWxkID0gKF86IG51bWJlciwgX25vZGVEYXRhOiBJdGVtRmxhdE5vZGUpID0+IF9ub2RlRGF0YS5leHBhbmRhYmxlO1xuXG4gIHRyYW5zZm9ybWVyID0gKG5vZGU6IEl0ZW1Ob2RlLCBsZXZlbDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmdOb2RlID0gdGhpcy5uZXN0ZWROb2RlTWFwLmdldChub2RlKTtcbiAgICBsZXQgZmxhdE5vZGU7XG4gICAgZmxhdE5vZGUgPSBleGlzdGluZ05vZGUgJiYgZXhpc3RpbmdOb2RlLml0ZW0gPT09IG5vZGUuaXRlbSA/IGV4aXN0aW5nTm9kZSA6IG5ldyBJdGVtTm9kZSgpO1xuICAgIGZsYXROb2RlLml0ZW0gPSBub2RlLml0ZW07XG4gICAgZmxhdE5vZGUubGV2ZWwgPSBsZXZlbDtcbiAgICBmbGF0Tm9kZS5jb2RlID0gbm9kZS5jb2RlO1xuICAgIGZsYXROb2RlLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgZmxhdE5vZGUuc2VsZWN0ZWQgPSBub2RlLnNlbGVjdGVkO1xuICAgIGZsYXROb2RlLmlkID0gbm9kZS5pZDtcbiAgICBpZiAoZmxhdE5vZGUuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnNlbGVjdChmbGF0Tm9kZSk7XG4gICAgfVxuICAgIGZsYXROb2RlLmV4cGFuZGFibGUgPSBub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB0aGlzLmZsYXROb2RlTWFwLnNldChmbGF0Tm9kZSwgbm9kZSk7XG4gICAgdGhpcy5uZXN0ZWROb2RlTWFwLnNldChub2RlLCBmbGF0Tm9kZSk7XG4gICAgcmV0dXJuIGZsYXROb2RlO1xuICB9XG5cbiAgZGVzY2VuZGFudHNBbGxTZWxlY3RlZChub2RlOiBJdGVtRmxhdE5vZGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBkZXNjZW5kYW50cyA9IHRoaXMudHJlZUNvbnRyb2wuZ2V0RGVzY2VuZGFudHMobm9kZSk7XG4gICAgcmV0dXJuIGRlc2NlbmRhbnRzLmV2ZXJ5KGNoaWxkID0+IHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmlzU2VsZWN0ZWQoY2hpbGQpKTtcbiAgfVxuXG4gIGRlc2NlbmRhbnRzUGFydGlhbGx5U2VsZWN0ZWQobm9kZTogSXRlbUZsYXROb2RlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGVzY2VuZGFudHMgPSB0aGlzLnRyZWVDb250cm9sLmdldERlc2NlbmRhbnRzKG5vZGUpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGRlc2NlbmRhbnRzLnNvbWUoY2hpbGQgPT4gdGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uaXNTZWxlY3RlZChjaGlsZCkpO1xuICAgIHJldHVybiByZXN1bHQgJiYgIXRoaXMuZGVzY2VuZGFudHNBbGxTZWxlY3RlZChub2RlKTtcbiAgfVxuXG4gIHRvZG9JdGVtU2VsZWN0aW9uVG9nZ2xlKG5vZGU6IEl0ZW1GbGF0Tm9kZSk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnRvZ2dsZShub2RlKTtcbiAgICBjb25zdCBkZXNjZW5kYW50cyA9IHRoaXMudHJlZUNvbnRyb2wuZ2V0RGVzY2VuZGFudHMobm9kZSk7XG4gICAgdGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uaXNTZWxlY3RlZChub2RlKVxuICAgICAgPyB0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5zZWxlY3QoLi4uZGVzY2VuZGFudHMpXG4gICAgICA6IHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLmRlc2VsZWN0KC4uLmRlc2NlbmRhbnRzKTtcbiAgfVxuXG4gIGZpbHRlckNoYW5nZWQoZmlsdGVyVGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5kYXRhYmFzZS5maWx0ZXIoZmlsdGVyVGV4dCk7XG4gICAgaWYgKGZpbHRlclRleHQpIHtcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wuZXhwYW5kQWxsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJlZUNvbnRyb2wuY29sbGFwc2VBbGwoKTtcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTdGF0dXNOb2RlKG5vZGU6IEl0ZW1GbGF0Tm9kZSk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tsaXN0U2VsZWN0aW9uLnRvZ2dsZShub2RlKTtcbiAgICB0aGlzLmRhdGFiYXNlLnVwZGF0ZURhdGEodGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uc2VsZWN0ZWQpO1xuICAgIHRoaXMuc2VsZWN0ZWQuZW1pdCh0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5zZWxlY3RlZCk7XG4gIH1cblxuICBzZWxlY3RBbGxPcHRpb25zKG1vZGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAobW9kZSkge1xuICAgICAgdGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uc2VsZWN0KC4uLnRoaXMudHJlZUNvbnRyb2wuZGF0YU5vZGVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uZGVzZWxlY3QoLi4udGhpcy50cmVlQ29udHJvbC5kYXRhTm9kZXMpO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkLmVtaXQodGhpcy5jaGVja2xpc3RTZWxlY3Rpb24uc2VsZWN0ZWQpO1xuICAgIHRoaXMuZGF0YWJhc2UudXBkYXRlRGF0YSh0aGlzLmNoZWNrbGlzdFNlbGVjdGlvbi5zZWxlY3RlZCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGFTb3VyY2UuZGF0YSA9IFtdO1xuICB9XG59XG4iXX0=