export class ItemNode {
    children: ItemNode[];
    item: string;
    code: string;
    data: any;
}

export class ItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
    code: string;
    data: any;
}

export interface TreeData {
    text: string;
    code: string;
    data: any;
}
