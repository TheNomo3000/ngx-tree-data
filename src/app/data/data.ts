import { TreeData } from 'projects/ngx-tree-data/src/lib/models/models';

export const DATA: TreeData [] = [
    {
      id: 1,
      text: 'entity_1',
      selected: false,
      data: {
        example: 'data'
      },
      children: [
        {
          id: 2,
          text: 'entity_1.1',
          children: null,
          selected: false,
        },
        {
          id: 2,
          text: 'entity_1.2',
          children: null,
          selected: false,
        },
        {
          id: 2,
          text: 'entity_1.3',
          children: null,
          selected: false,
        }
      ],
    },
    {
      id: 3,
      text: 'entity_2',
      selected: false,
      children: [
        {
          id: 4,
          text: 'entity_2.1',
          children: null,
          selected: false,
        },
        {
          id: 4,
          text: 'entity_2.2',
          children: null,
          selected: false,
        }
      ],
    }
  ]