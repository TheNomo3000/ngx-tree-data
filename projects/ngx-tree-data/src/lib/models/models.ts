export class ItemNode {
    children: ItemNode[];
    id ?= -1;
    item: string;
    code: string;
    selected: boolean;
    data: any;
}

export class ItemFlatNode {
    id ?= -1;
    item: string;
    level: number;
    expandable: boolean;
    selected: boolean;
    code: string;
    data: any;
}

export class TreeData {
    text: string;
    id ?= -1;
    selected = false;
    children: TreeData [] | null;
    data ?: any = null;
}