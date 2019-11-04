import { Injectable } from "@angular/core";
import { SearchCriteria, BooksResponse, BookResponse, ReviewResponse, Review } from './models';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class BookService {
  constructor(private http: HttpClient) { }

  getBooks(searchCriteria: SearchCriteria): Promise<BooksResponse> {
    //TODO - for Task 3 and Task 4
    const limit = searchCriteria.limit || 10;
    const offset = searchCriteria.offset || 0;

    const params = new HttpParams()
      .set('searchCriteria', searchCriteria.terms)
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<BooksResponse>('http://localhost:3000/api/search', {params}).toPromise();
  }

  getBook(bookId: string): Promise<BookResponse> {
    //TODO - for Task 5
    return this.http.get<BookResponse>(`http://localhost:3000/api/book/${bookId}`).toPromise();
  }

  getBookReviews(bookId: string): Promise<ReviewResponse> {
    return this.http.get<ReviewResponse>(`http://localhost:3000/api/book/${bookId}/review`).toPromise();
  }
}
