import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { ItemNode } from '../models/models';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
var NgxTreeDataService = /** @class */ (function () {
    function NgxTreeDataService(platformLocation) {
        this.platformLocation = platformLocation;
        this.dataChange = new BehaviorSubject(null);
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
    NgxTreeDataService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NgxTreeDataService_Factory() { return new NgxTreeDataService(i0.ɵɵinject(i1.PlatformLocation)); }, token: NgxTreeDataService, providedIn: "root" });
    NgxTreeDataService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [PlatformLocation])
    ], NgxTreeDataService);
    return NgxTreeDataService;
}());
export { NgxTreeDataService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRyZWUtZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXRyZWUtZGF0YS8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9uZ3gtdHJlZS1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsUUFBUSxFQUEwQixNQUFNLGtCQUFrQixDQUFDOzs7QUFJcEU7SUFPRSw0QkFBb0IsZ0JBQWtDO1FBQWxDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFOdEQsZUFBVSxHQUFHLElBQUksZUFBZSxDQUFjLElBQUksQ0FBQyxDQUFDO1FBR3BELGVBQVUsR0FBRyxFQUFFLENBQUM7SUFHeUMsQ0FBQztJQUYxRCxzQkFBSSxvQ0FBSTthQUFSLGNBQTBCLE9BQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUkxRCx1Q0FBVSxHQUFWLFVBQVcsSUFBaUI7UUFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELHlDQUFZLEdBQVosVUFBYSxJQUFpQjtRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDaEMsT0FBTyxJQUFJLENBQUMs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SDlCLFVBQVUsQ0FBQztZQUNWLFVBQVUsRUFBRSxNQUFNO1NBQ25CLENBQUM7aURBUXNDLGdCQUFnQjtPQVAzQyxrQkFBa0IsQ0FzSDlCOzZCQTdIRDtDQTZIQyxBQXRIRCxJQXNIQztTQXRIWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFBsYXRmb3JtTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSXRlbU5vZGUsIFRyZWVEYXRhLCBJdGVtRmxhdE5vZGUgfSBmcm9tICcuLi9tb2RlbHMvbW9kZWxzJztcbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5neFRyZWVEYXRhU2VydmljZSB7XG4gIGRhdGFDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEl0ZW1Ob2RlIFtdPihudWxsKTtcbiAgdHJlZURhdGE6IGFueSBbXTtcbiAgZXh0ZXJuYWxEYXRhOiBUcmVlRGF0YSBbXTtcbiAgZGF0YVNvdXJjZSA9IFtdO1xuICBnZXQgZGF0YSgpOiBJdGVtTm9kZSBbXSB7IHJldHVybiAgdGhpcy5kYXRhQ2hhbmdlLnZhbHVlOyB9XG4gIGxvYWRlcklkOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGxhdGZvcm1Mb2NhdGlvbjogUGxhdGZvcm1Mb2NhdGlvbikge31cblxuICBpbml0aWFsaXplKGRhdGE6IFRyZWVEYXRhIFtdKSB7XG4gICAgdGhpcy5leHRlcm5hbERhdGEgPSBkYXRhO1xuICAgIGNvbnN0IG5ld0RhdGEgPSB0aGlzLmdlbmVyYXRlRGF0YSh0aGlzLmV4dGVybmFsRGF0YSk7XG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQobmV3RGF0YSk7XG4gIH1cblxuICBnZW5lcmF0ZURhdGEoZGF0YTogVHJlZURhdGEgW10pOiBJdGVtTm9kZSBbXSB7XG4gICAgdGhpcy5kYXRhU291cmNlID0gdGhpcy5nZW5lcmF0ZURhdGFXaXRoQ29kZShkYXRhKTtcbiAgICB0aGlzLnRyZWVEYXRhID0gdGhpcy5kYXRhU291cmNlO1xuICAgIHJldHVybiB0aGlzLmJ1aWxkRmlsZVRyZWUodGhpcy5kYXRhU291cmNlLCAnMCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZURhdGFXaXRoQ29kZShkYXRhOiBUcmVlRGF0YSBbXSk6IGFueVtdIHtcbiAgICBjb25zdCBuZXdEYXRhID0gW107XG4gICAgbGV0IHBhcmVudCA9IDE7XG4gICAgZGF0YS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgbmV3RGF0YS5wdXNoKFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogaXRlbS50ZXh0LFxuICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgIGNvZGU6IGAwLiR7cGFyZW50fWAsXG4gICAgICAgICAgc2VsZWN0ZWQ6IGl0ZW0uc2VsZWN0ZWQsXG4gICAgICAgICAgZGF0YTogaXRlbS5kYXRhXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICBjb25zdCBjaGlsZHJlbnMgPSBpdGVtLmNoaWxkcmVuO1xuICAgICAgaWYgKGNoaWxkcmVucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IDE7XG4gICAgICAgIGNoaWxkcmVucy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICBjb25zdCBpdGVtQ2hpbGRyZW4gPSB7XG4gICAgICAgICAgICB0ZXh0OiBlbC50ZXh0LFxuICAgICAgICAgICAgY29kZTogYDAuJHtwYXJlbnR9LiR7Y2hpbGRyZW59YCxcbiAgICAgICAgICAgIHNlbGVjdGVkOiBlbC5zZWxlY3RlZCxcbiAgICAgICAgICAgIGlkOiBlbC5pZCxcbiAgICAgICAgICAgIGRhdGE6IGVsLmRhdGFcbiAgICAgICAgICB9O1xuICAgICAgICAgIG5ld0RhdGEucHVzaChpdGVtQ2hpbGRyZW4pO1xuICAgICAgICAgIGNoaWxkcmVuKys7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcGFyZW50Kys7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ld0RhdGE7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkRmlsZVRyZWUob2JqOiBhbnlbXSwgbGV2ZWw6IHN0cmluZyk6IEl0ZW1Ob2RlIFtdIHtcbiAgICByZXR1cm4gb2JqLmZpbHRlcihvID0+XG4gICAgICAoby5jb2RlIGFzIHN0cmluZykuc3RhcnRzV2l0aChsZXZlbCArICcuJylcbiAgICAgICYmIChvLmNvZGUubWF0Y2goL1xcLi9nKSB8fCBbXSkubGVuZ3RoID09PSAobGV2ZWwubWF0Y2goL1xcLi9nKSB8fCBbXSkubGVuZ3RoICsgMVxuICAgIClcbiAgICAgIC5tYXAobyA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgSXRlbU5vZGUoKTtcbiAgICAgICAgbm9kZS5pdGVtID0gby50ZXh0O1xuICAgICAgICBub2RlLnNlbGVjdGVkID0gby5zZWxlY3RlZDtcbiAgICAgICAgbm9kZS5pZCA9IG8uaWQ7XG4gICAgICAgIG5vZGUuY29kZSA9IG8uY29kZTtcbiAgICAgICAgbm9kZS5kYXRhID0gby5kYXRhO1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IG9iai5maWx0ZXIoc28gPT4gKHNvLmNvZGUgYXMgc3RyaW5nKS5zdGFydHNXaXRoKGxldmVsICsgJy4nKSk7XG4gICAgICAgIGlmIChjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuID0gdGhpcy5idWlsZEZpbGVUcmVlKGNoaWxkcmVuLCBvLmNvZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBmaWx0ZXIoZmlsdGVyVGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy50cmVlRGF0YSA9IHRoaXMuZ2VuZXJhdGVEYXRhV2l0aENvZGUodGhpcy5leHRlcm5hbERhdGEpO1xuICAgIGxldCBmaWx0ZXJlZFRyZWVEYXRhO1xuICAgIGlmIChmaWx0ZXJUZXh0KSB7XG4gICAgICBmaWx0ZXJlZFRyZWVEYXRhID0gdGhpcy50cmVlRGF0YS5maWx0ZXIoZCA9PiBkLnRleHQudG9Mb2NhbGVMb3dlckNhc2UoKS5pbmRleE9mKGZpbHRlclRleHQudG9Mb2NhbGVMb3dlckNhc2UoKSkgPiAtMSk7XG4gICAgICBPYmplY3QuYXNzaWduKFtdLCBmaWx0ZXJlZFRyZWVEYXRhKS5mb3JFYWNoKGZ0ZCA9PiB7XG4gICAgICAgIGxldCBzdHIgPSAoZnRkLmNvZGUgYXMgc3RyaW5nKTtcbiAgICAgICAgd2hpbGUgKHN0ci5sYXN0SW5kZXhPZignLicpID4gLTEpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHN0ci5sYXN0SW5kZXhPZignLicpO1xuICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgIGlmIChmaWx0ZXJlZFRyZWVEYXRhLmZpbmRJbmRleCh0ID0+IHQuY29kZSA9PT0gc3RyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iaiA9IHRoaXMudHJlZURhdGEuZmluZChkID0+IGQuY29kZSA9PT0gc3RyKTtcbiAgICAgICAgICAgIGlmIChvYmopIHtcbiAgICAgICAgICAgICAgZmlsdGVyZWRUcmVlRGF0YS5wdXNoKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyZWRUcmVlRGF0YSA9IHRoaXMudHJlZURhdGE7XG4gICAgfVxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkRmlsZVRyZWUoZmlsdGVyZWRUcmVlRGF0YSwgJzAnKTtcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVEYXRhKGl0ZW1zOiBJdGVtRmxhdE5vZGUgW10sIGV4dGVybmFsRGF0YSA/OiBUcmVlRGF0YSBbXSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLmV4dGVybmFsRGF0YSA9IHRoaXMucmVjdXJzaXZlVXBkYXRlKGl0ZW1zLCB0aGlzLmV4dGVybmFsRGF0YSk7XG4gIH1cblxuICByZWN1cnNpdmVVcGRhdGUoaXRlbXM6IEl0ZW1GbGF0Tm9kZVtdLCBleHRlcm5hbERhdGE6IFRyZWVEYXRhIFtdKTogVHJlZURhdGEgW10ge1xuICAgIGV4dGVybmFsRGF0YS5tYXAoZGF0YSA9PiB7XG4gICAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICBpdGVtcy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgaWYgKGVsLmlkID09PSBkYXRhLmlkKSB7XG4gICAgICAgICAgZGF0YS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBkYXRhLmNoaWxkcmVuO1xuICAgICAgaWYgKGNoaWxkcmVuICYmIGRhdGEuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnJlY3Vyc2l2ZVVwZGF0ZShpdGVtcywgY2hpbGRyZW4pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBleHRlcm5hbERhdGE7XG4gIH1cbn1cbiJdfQ==