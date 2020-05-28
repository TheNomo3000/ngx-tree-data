
# NgxTreeData

## Description

It is a complete and lightweight component for loading data in tree form using the Material CDK, such as Angular Material.

![demo](https://i.ibb.co/BCX7cLb/2019-08-06-1-49-27.gif)
  
## Installation

Just add the `NgxTreeDataModule` module to use the component.

``` typescript
import { NgxTreeDataModule } from 'ngx-tree-data';

@NgModule({
  imports: [
    ...
    NgxTreeDataModule
  ]
})

export class AppModule { }
```

Example use:

```html
<ngx-tree-data (selected)="dataSelected = $event" [config]="config">
  <div class="title">
      <h2>Ngx-tree-data</h2>
  </div>
</ngx-tree-data>
```

```typescript
export class AppComponent {
  config: NgxTreeDataConfig = {
    selectFirst: false,
    selectThis: -1,
    checkbox: true,
    search: false,
    selectAll: false,
    multiple: false,
  };

  data: TreeData [] = DATA;
  dataSelected;

  constructor(private treeService: NgxTreeDataService) {
    this.treeService.initialize(this.data);
  }
}

```

## API

The data we send to ``NgxTreeDataService`` must be in ``TreeData`` format.

```typescript
export class TreeData {
  text: string;
  id ?= -1;
  selected: boolean;
  children: TreeData [] | null;
  data ?: any = null;
}

export class NgxTreeDataConfig {
    selectFirst?: boolean;
    selectThis?: number;
    checkbox?: boolean;
    search?: boolean;
    selectAll?: boolean;
    multiple?: boolean;
}
```

### Example Data

```typescript
const DATA: TreeData [] = [
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

```

| Attribute | Description  |
|:-------------:|:-:|
| ``@Output() selected: ItemFlatNode [] or ItemNode`` | Depending on the mode you are in, `ItemFlatNode []` or `ItemNode` will be returned.  |
| ``@Input() config: NgxTreeDataConfig`` | You must pass a `NgxTreeDataConfig`|

