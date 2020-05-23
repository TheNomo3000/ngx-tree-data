import { BehaviorSubject } from 'rxjs';
import { PlatformLocation } from '@angular/common';
import { ItemNode, TreeData, ItemFlatNode } from '../models/models';
export declare class NgxTreeDataService {
    private platformLocation;
    dataChange: BehaviorSubject<ItemNode[]>;
    treeData: any[];
    externalData: TreeData[];
    dataSource: any[];
    readonly data: ItemNode[];
    loaderId: string;
    constructor(platformLocation: PlatformLocation);
    initialize(data: TreeData[]): void;
    generateData(data: TreeData[]): ItemNode[];
    private generateDataWithCode;
    private buildFileTree;
    filter(filterText: string): void;
    updateData(items: ItemFlatNode[], externalData?: TreeData[] | null): void;
    recursiveUpdate(items: ItemFlatNode[], externalData: TreeData[]): TreeData[];
}
