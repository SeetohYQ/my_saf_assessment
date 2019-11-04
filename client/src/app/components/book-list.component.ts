import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { SearchCriteria, ErrorResponse, BooksResponse } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {

  limit = 10;
  offset = 0;
  terms = '';
  currentCount = 0;
  numberOfResults = 0;
  lastPageCount = 0;
  
  books: BooksResponse = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute
      , private bookSvc: BookService) { }

  ngOnInit() {
    const state = window.history.state;
    if (!state['terms'])
      return this.router.navigate(['/']);

    this.terms = state.terms;
    this.limit = state.limit || 10;
    this.currentCount = this.limit;

    const searchCriterial: SearchCriteria = {
      terms: this.terms,
      limit: this.limit
    }

    this.bookSvc.getBooks(searchCriterial)
      .then(result => {
        this.books = result;
        this.numberOfResults = result.total;
        this.currentCount = Math.min(this.limit, result.total);
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })

  }

  next() {
    //TODO - for Task 4
    //First check: Check if number of results is more than limit. If not, then no need to proceed.
    if (this.numberOfResults > this.limit) {
      //Check for last page 
      if (this.lastPageCount === 0) {
        const searchCriterial: SearchCriteria = {
          terms: this.terms,
          limit: this.limit,
          offset: +this.offset + +this.limit
        };
    
        //if last page, offset will not be based on the limit
        if ((this.numberOfResults - this.currentCount) < this.limit){
          this.lastPageCount = this.numberOfResults - this.currentCount;
          this.currentCount = +this.currentCount + +(this.numberOfResults - this.currentCount);
          this.offset += +(this.numberOfResults - this.currentCount);
        }
        else {
          this.currentCount = +this.currentCount + +this.limit;
          this.offset += +this.limit;
        }
    
        this.bookSvc.getBooks(searchCriterial)
          .then(result => {
            this.books = result;
          })
          .catch(error => {
            const errorResponse = error as ErrorResponse;
            alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
          });
      }
    }
  }

  previous() {
    //TODO - for Task 4
    if (this.offset > 0) {
      if (this.lastPageCount > 0) {
        this.currentCount -= this.lastPageCount;
        this.lastPageCount = 0;
      }
      else {
        this.currentCount -= +this.limit;
        this.offset-= +this.limit;
      }
      
      const searchCriterial: SearchCriteria = {
        terms: this.terms,
        limit: this.limit,
        offset: +this.offset
      };
  
      console.log('limit' + this.limit);
      console.log('current count: ' + this.currentCount);
      console.log('offset: ' + this.offset);
  
      this.bookSvc.getBooks(searchCriterial)
        .then(result => {
          this.books = result;
        }).catch(error => {
          const errorResponse = error as ErrorResponse;
          alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
        });
    }
  }

  bookDetails(book_id: string) {
    //TODO
    console.info('Book id: ', book_id);
    this.router.navigate(['books', book_id]);
  }

  back() {
    this.router.navigate(['/']);
  }

}
