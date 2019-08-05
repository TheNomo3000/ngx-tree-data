
# NgxTreeData


## Description

It is a complete and lightweight component for loading data in tree form using the Material CDK, such as Angular Material.

![demo](https://i.ibb.co/BCX7cLb/2019-08-06-1-49-27.gif)
  

## Installation

Just add the `NgxTreeDataModule` module to use the component.
``` typescript
import { NgxTreeDataModule } from 'ngx-tree-data';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    NgxTreeDataModule
  ],
  declarations:  [AppComponent],
  bootstrap:  [AppComponent]

})

export class AppModule { }
```

Example use: 

```html
<mat-card class="example-card">
  <mat-card-content>
     <ngx-tree-data (selected)="dataSelected = $event" [checkbox]="true" [search]="true">
        <div class="title">
            <h2>Ngx-tree-data</h2>
        </div>
    </ngx-tree-data>
  </mat-card-content>
</mat-card>
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

```

### Data Example :

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
| ``@Input() checkbox: boolean`` | You must pass a `true` or `false` to enable/disable checkbox mode |
| ``@Input() search: boolean`` | You must pass a `true` or `false` to enable/disable searchbox |
| ``@Input() multiple: boolean`` | You must pass a `true` or `false` to set multiple select in checkbox mode|
You have an demo in [stackblitz](https://stackblitz.com/edit/ngx-tree-data?file=src/app/tree-data/tree-data.component.ts)
