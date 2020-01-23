import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { routing } from './index.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 


@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,
    ],
    declarations: [
        IndexComponent,
    ],
    schemas: [
    ],
})
export class IndexModule { }
