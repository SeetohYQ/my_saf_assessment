import { Component, OnInit } from '@angular/core';
import { Book, BookResponse, ErrorResponse, ReviewResponse, Review } from '../models';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {

  book: BookResponse;
  bookReviews: ReviewResponse = {data: [], timestamp: null};  

  constructor(private bookSvc: BookService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const bookId = this.route.snapshot.params.book_id;
    this.bookSvc.getBook(bookId)
      .then(result => {
        this.book = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
    
    this.bookSvc.getBookReviews(bookId)
      .then(result => {
        this.bookReviews = result;
      }).catch(error => {
        const errorResponse = error as ErrorResponse;
        alert(`Status: ${errorResponse.status}\nMessage: ${errorResponse.message}`)
      })
  }
}
