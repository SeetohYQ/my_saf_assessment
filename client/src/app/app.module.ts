import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRouteModule } from './approute.module';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search.component';
import { BookListComponent } from './components/book-list.component';
import { BookService } from './book.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookDetailsComponent } from './components/book-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    BookListComponent,
    BookDetailsComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule, FormsModule,
    AppRouteModule,
    BrowserAnimationsModule
  ],
  providers: [ BookService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
