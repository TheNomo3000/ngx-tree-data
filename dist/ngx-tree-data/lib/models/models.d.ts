export declare class ItemNode {
    children: ItemNode[];
    id?: number;
    item: string;
    code: string;
    selected: boolean;
    data: any;
}
export declare class ItemFlatNode {
    id?: number;
    item: string;
    level: number;
    expandable: boolean;
    selected: boolean;
    code: string;
    data: any;
}
export declare class TreeData {
    text: string;
    id?: number;
    selected: boolean;
    children: TreeData[] | null;
    data?: any;
}
