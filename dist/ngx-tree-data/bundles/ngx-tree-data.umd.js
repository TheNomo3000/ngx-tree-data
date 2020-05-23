(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common'), require('@angular/cdk/tree'), require('@angular/material/tree'), require('@angular/cdk/collections'), require('@angular/platform-browser'), require('@angular/material/button'), require('@angular/material/checkbox'), require('@angular/material/form-field'), require('@angular/material/icon'), require('@angular/material/input')) :
    typeof define === 'function' && define.amd ? define('ngx-tree-data', ['exports', '@angular/core', 'rxjs', '@angular/common', '@angular/cdk/tree', '@angular/material/tree', '@angular/cdk/collections', '@angular/platform-browser', '@angular/material/button', '@angular/material/checkbox', '@angular/material/form-field', '@angular/material/icon', '@angular/material/input'], factory) :
    (global = global || self, factory(global['ngx-tree-data'] = {}, global.ng.core, global.rxjs, global.ng.common, global.ng.cdk.tree, global.ng.material.tree, global.ng.cdk.collections, global.ng.platformBrowser, global.ng.material.button, global.ng.material.checkbox, global.ng.material['form-field'], global.ng.material.icon, global.ng.material.input));
}(this, function (exports, core, rxjs, common, tree, tree$1, collections, platformBrowser, button, checkbox, formField, icon, input) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var ItemNode = /** @class */ (function () {
        function ItemNode() {
            this.id = -1;
        }
        return ItemNode;
    }());

    var NgxTreeDataService = /** @class */ (function () {
        function NgxTreeDataService(platformLocation) {
            this.platformLocation = platformLocation;
            this.dataChange = new rxjs.BehaviorSubject(null);
            this.dataSource = [];
        }
        Object.defineProperty(NgxTreeDataService.prototype, "data", {
            get: function () { return this.dataChange.value; },
            enumerable: true,
            configurable: true
        });
        NgxTreeDataService.prototype.initialize = function (data) {
            this.externalData = data;
            var newData = this.generateData(this.externalData);
            this.dataChange.next(newData);
        };
        NgxTreeDataService.prototype.generateData = function (data) {
            this.dataSource = this.generateDataWithCode(data);
            this.treeData = this.dataSource;
            return this.buildFileTree(this.dataSource, '0');
        };
        NgxTreeDataService.prototype.generateDataWithCode = function (data) {
            var newData = [];
            var parent = 1;
            data.forEach(function (item) {
                newData.push({
                    text: item.text,
                    id: item.id,
                    code: "0." + parent,
                    selected: item.selected,
                    data: item.data
                });
                var childrens = item.children;
                if (childrens.length > 0) {
                    var children_1 = 1;
                    childrens.forEach(function (el) {
                        var itemChildren = {
                            text: el.text,
                            code: "0." + parent + "." + children_1,
                            selected: el.selected,
                            id: el.id,
                            data: el.data
                        };
                        newData.push(itemChildren);
                        children_1++;
                    });
                }
                parent++;
            });
            return newData;
        };
        NgxTreeDataService.prototype.buildFileTree = function (obj, level) {
            var _this = this;
            return obj.filter(function (o) {
                return o.code.startsWith(level + '.')
                    && (o.code.match(/\./g) || []).length === (level.match(/\./g) || []).length + 1;
            })
                .map(function (o) {
                var node = new ItemNode();
                node.item = o.text;
                node.selected = o.selected;
                node.id = o.id;
                node.code = o.code;
                node.data = o.data;
                var children = obj.filter(function (so) { return so.code.startsWith(level + '.'); });
                if (children && children.length > 0) {
                    node.children = _this.buildFileTree(children, o.code);
                }
                return node;
            });
        };
        NgxTreeDataService.prototype.filter = function (filterText) {
            var _this = this;
            this.treeData = this.generateDataWithCode(this.externalData);
            var filteredTreeData;
            if (filterText) {
                filteredTreeData = this.treeData.filter(function (d) { return d.text.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1; });
                Object.assign([], filteredTreeData).forEach(function (ftd) {
                    var str = ftd.code;
                    while (str.lastIndexOf('.') > -1) {
                        var index = str.lastIndexOf('.');
                        str = str.substring(0, index);
                        if (filteredTreeData.findIndex(function (t) { return t.code === str; }) === -1) {
                            var obj = _this.treeData.find(function (d) { return d.code === str; });
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
            var data = this.buildFileTree(filteredTreeData, '0');
            this.dataChange.next(data);
        };
        NgxTreeDataService.prototype.updateData = function (items, externalData) {
            this.externalData = this.recursiveUpdate(items, this.externalData);
        };
        NgxTreeDataService.prototype.recursiveUpdate = function (items, externalData) {
            var _this = this;
            externalData.map(function (data) {
                data.selected = false;
                items.forEach(function (el) {
                    if (el.id === data.id) {
                        data.selected = true;
                    }
                });
                var children = data.children;
                if (children && data.children.length > 0) {
                    _this.recursiveUpdate(items, children);
                }
            });
            return externalData;
        };
        NgxTreeDataService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function NgxTreeDataService_Factory() { return new NgxTreeDataService(core.ɵɵinject(common.PlatformLocation)); }, token: NgxTreeDataService, providedIn: "root" });
        NgxTreeDataService = __decorate([
            core.Injectable({
                providedIn: 'root'
            }),
            __metadata("design:paramtypes", [common.PlatformLocation])
        ], NgxTreeDataService);
        return NgxTreeDataService;
    }());

    var NgxTreeDataComponent = /** @class */ (function () {
        function NgxTreeDataComponent(database) {
            var _this = this;
            this.database = database;
            this.selected = new core.EventEmitter();
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
            this.checklistSelection = new collections.SelectionModel(this.multiple);
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
            this.treeFlattener = new tree$1.MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
            this.treeControl = new tree.FlatTreeControl(this.getLevel, this.isExpandable);
            this.dataSource = new tree$1.MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
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
                ? (_a = this.checklistSelection).select.apply(_a, __spread(descendants)) : (_b = this.checklistSelection).deselect.apply(_b, __spread(descendants));
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
                (_a = this.checklistSelection).select.apply(_a, __spread(this.treeControl.dataNodes));
            }
            else {
                (_b = this.checklistSelection).deselect.apply(_b, __spread(this.treeControl.dataNodes));
            }
            this.selected.emit(this.checklistSelection.selected);
            this.database.updateData(this.checklistSelection.selected);
        };
        NgxTreeDataComponent.prototype.ngOnDestroy = function () {
            this.dataSource.data = [];
        };
        __decorate([
            core.Output(),
            __metadata("design:type", Object)
        ], NgxTreeDataComponent.prototype, "selected", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxTreeDataComponent.prototype, "autoSave", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxTreeDataComponent.prototype, "selectFirst", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Number)
        ], NgxTreeDataComponent.prototype, "selectThis", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxTreeDataComponent.prototype, "checkbox", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxTreeDataComponent.prototype, "search", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxTreeDataComponent.prototype, "selectAll", void 0);
        __decorate([
            core.Input(),
            __metadata("design:type", Object)
        ], NgxTreeDataComponent.prototype, "multiple", void 0);
        NgxTreeDataComponent = __decorate([
            core.Component({
                selector: 'ngx-tree-data',
                template: "<div class=\"flex\">\r\n    <div class=\"box-flex align-self-center\">\r\n      <ng-content select=\".title\"></ng-content>\r\n    </div>\r\n    <div *ngIf=\"search\" class=\"box-flex float-right\">\r\n      <mat-form-field>\r\n        <input matInput placeholder=\"Search\" (input)=\"filterChanged($event.target.value)\" autocomplete=\"off\">\r\n      </mat-form-field>\r\n    </div>\r\n  </div>\r\n  <div class=\"flex\" *ngIf=\"selectAll\">\r\n    <div class=\"box-flex\">\r\n      <button mat-stroked-button (click)=\"selectAllOptions(true)\">Select All</button>\r\n    </div>\r\n    <div class=\"box-flex\">\r\n      <button mat-stroked-button (click)=\"selectAllOptions(false)\">Deselect All</button>\r\n    </div>\r\n  </div>\r\n  <mat-tree [dataSource]=\"dataSource\" [treeControl]=\"treeControl\">\r\n    <mat-tree-node *matTreeNodeDef=\"let node\" matTreeNodePadding [style.padding]=\"checkbox ? '0px': '40px'\">\r\n      <button mat-button (click)=\"selected.emit(node)\" [disabled]=\"node.id == -1 ? true : false\">\r\n        <span *ngIf=\"!checkbox\">{{node.item}}</span>\r\n      </button>\r\n      <mat-checkbox *ngIf=\"checkbox\"\r\n        [checked]=\"checklistSelection.isSelected(node)\"\r\n        (change)=\"changeStatusNode(node)\">{{node.item}}</mat-checkbox>\r\n    </mat-tree-node>\r\n    <mat-tree-node *matTreeNodeDef=\"let node;when: hasChild\" matTreeNodePadding>\r\n      <button mat-icon-button matTreeNodeToggle\r\n              [attr.aria-label]=\"'toggle ' + node.name\">\r\n        <mat-icon> {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}} </mat-icon>\r\n      </button>\r\n      <mat-checkbox *ngIf=\"checkbox\" \r\n        [checked]=\"checklistSelection.isSelected(node)\"\r\n        (change)=\"changeStatusNode(node)\">{{node.item}}</mat-checkbox>\r\n      <span *ngIf=\"!checkbox\">{{node.item}}</span>\r\n    </mat-tree-node>\r\n  </mat-tree>",
                styles: [":host .flex{display:flex;justify-content:space-between}:host form{width:100%}:host form mat-form-field{width:100%}"]
            }),
            __metadata("design:paramtypes", [NgxTreeDataService])
        ], NgxTreeDataComponent);
        return NgxTreeDataComponent;
    }());

    var NgxTreeDataModule = /** @class */ (function () {
        function NgxTreeDataModule() {
        }
        NgxTreeDataModule = __decorate([
            core.NgModule({
                declarations: [
                    NgxTreeDataComponent
                ],
                imports: [
                    platformBrowser.BrowserModule,
                    button.MatButtonModule,
                    checkbox.MatCheckboxModule,
                    formField.MatFormFieldModule,
                    tree$1.MatTreeModule,
                    icon.MatIconModule,
                    input.MatInputModule
                ],
                exports: [
                    NgxTreeDataComponent
                ],
            })
        ], NgxTreeDataModule);
        return NgxTreeDataModule;
    }());

    exports.NgxTreeDataComponent = NgxTreeDataComponent;
    exports.NgxTreeDataModule = NgxTreeDataModule;
    exports.NgxTreeDataService = NgxTreeDataService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-tree-data.umd.js.map
