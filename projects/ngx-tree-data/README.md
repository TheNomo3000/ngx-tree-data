
# NgxTreeData


## Description

It is a complete and lightweight component for loading data in tree form using the Material CDK, such as Angular Material.

![demo](https://i.ibb.co/FmwL4h2/ngx-tree-data.png)
  

## Installation

Just add the `NgxTreeDataModule` module to use the component.
``` typescript
import { NgxTreeDataModule } from 'ngx-toggle-switch';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    UiSwitchModule
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
     <ngx-tree-data (data)="dataSelected = $event" [checkbox]="true" [search]="true">
        <div class="title">
            <h2>Ngx-tree-data</h2>
        </div>
    </ngx-tree-data>
  </mat-card-content>
</mat-card>
```

## API

| Attribute | Description  |
|:-------------:|:-:|
| ``@Output() data: ItemFlatNode [] OR ItemNode`` | Depending on the mode you are in, `ItemFlatNode []` or `ItemNode` will be returned.  |
| ``@Input() checkbox: boolean`` | You must pass a `true` or `false` to enable/disable checkbox mode |
| ``@Input() search: boolean`` | You must pass a `true` or `false` to enable/disable searchbox |
You have an demo in [stackblitz](https://stackblitz.com/edit/ngx-tree-data?file=src/app/tree-data/tree-data.component.ts)
