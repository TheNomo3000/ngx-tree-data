import { TreeData } from 'projects/ngx-tree-data/src/lib/models/models';

export const DATA: TreeData [] = [
    {
      id: 1,
      text: 'item_1',
      selected: false,
      data: {
        example: 'data'
      },
      children: [
        {
          id: 2,
          text: 'item_1.1',
          children: null,
          selected: false,
        },
        {
          id: 2,
          text: 'item_1.2',
          children: null,
          selected: false,
        },
        {
          id: 2,
          text: 'item_1.3',
          children: null,
          selected: false,
        }
      ],
    },
    {
      id: 3,
      text: 'item_2',
      selected: false,
      children: [
        {
          id: 4,
          text: 'item_2.1',
          children: null,
          selected: false,
        },
        {
          id: 4,
          text: 'item_2.2',
          children: null,
          selected: false,
        }
      ],
    }
  ]