//Load the libraries
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const mkQuery = require('./db-util');
const rp = require('request-promise');

//Configure the application
const app = express();
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;
const pool = mysql.createPool(require('./config').connectionConfiguration);
const API_KEY = require('./config').API_KEY;

//SQL Statements
const SEARCH_BOOKS = 'select * from book2018 where title like ? or authors like ? order by rating desc limit ? offset ?';
const GET_ALL_BOOKS = 'select * from book2018 where title like ? or authors like ?';
const GET_BOOK_BY_ID = 'select * from book2018 where book_id = ?'
//
const GET_BOOKS = mkQuery(SEARCH_BOOKS, pool);
const TOTAL_BOOKS = mkQuery(GET_ALL_BOOKS, pool);
const BOOK_BY_ID = mkQuery(GET_BOOK_BY_ID, pool);

//Install standard middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/api/search', (req,res) => {
    const searchCriteria = `%${req.query.searchCriteria}%`;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const q0 = TOTAL_BOOKS([searchCriteria, searchCriteria]);
    const q1 = GET_BOOKS([searchCriteria, searchCriteria, limit, offset]);

    Promise.all([q0, q1]).then(result => {
        const r0 = result[0];
        const r1 = result[1];

        if (r0.length === 0) {
            return res.status(404).json({error : 'No books found'});
        }
        else if (r0.length > 0) {
            books = [];
            r1.forEach(book => {
                books.push({
                    book_id: book.book_id,
                    title: book.title,
                    authors: [book.authors],
                    rating: book.rating
                });
            }) 
            const processed = {
                data: books,
                timestamp: new Date().getTime(),
                total: r0.length,
                limit: limit,
                offset: offset
            }
            return res.status(200).json(processed);
        }
    }).catch(error => {
        const err = {
            status: error.status,
            message: error.statusText,
            timestamp: new Date().getTime()
        }
        res.status(500).json({ error: JSON.stringify(err) });
    })

    // GET_BOOKS([searchCriteria, searchCriteria, limit, offset])
    //     .then(result => {
    //         if (result.length > 0) {
    //             books = [];
    //             result.forEach(book => {
    //                 books.push({
    //                     book_id: book.book_id,
    //                     title: book.title,
    //                     authors: [book.authors],
    //                     rating: book.rating
    //                 });
    //             })
    //             const processed = {
    //                 data: books,
    //                 timestamp: new Date().getTime(),
    //                 total: result.length,
    //                 limit: limit,
    //                 offset: offset
    //             }
    //             res.status(200).json(processed);
    //         }
    //         else {
    //             res.status(404).json({error : 'No books found'});
    //         }
    //     })
    //     .catch(error => {
    //         res.status(500).json({ error: JSON.stringify(error) });
    //     })
});

app.get('/api/book/:book_id', (req, res) => {
    const bookId = req.params.book_id;

    BOOK_BY_ID([bookId])
        .then(result => {
            const processed = {
                data: result[0],
                timestamp: new Date().getTime()
            }
            res.status(200).json(processed);
        })
        .catch(error => {
            const err = {
                status: error.status,
                message: error.statusText,
                timestamp: new Date().getTime()
            }
            res.status(500).json({ error: JSON.stringify(err) });
        })
});

app.get('/api/book/:book_id/review', (req, res) => {
    const bookId = req.params.book_id;
    
    BOOK_BY_ID([bookId])
        .then(result => {
            const processed = {
                data: result[0],
                timestamp: new Date().getTime()
            }
            const options = {
                uri: 'https://api.nytimes.com/svc/books/v3/reviews.json',
                qs: {
                    title : processed.data.title,
                    'api-key' : API_KEY
                },
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true
            }

            rp(options).then(result => {
                if (result.num_results === 0) {
                    return res.status(200).json({data: [], timestamp: new Date().getTime()});
                }
                else {
                    let reviews = [];
                    result.results.forEach(r => {
                        reviews.push({
                                book_id: processed.data.book_id,
                                title: processed.data.title,
                                authors: [processed.data.authors],
                                byline: r.byline,
                                summary: r.summary,
                                url: r.url
                            })
                    });
                    return res.status(200).json({data: reviews, timestamp: new Date().getTime()});
                }
            })
            .catch(error => {
                const err = {
                    status: error.status,
                    message: error.statusText,
                    timestamp: new Date().getTime()
                }
                res.status(500).json({ error: JSON.stringify(err) });
            })
        })
})

//Response 404 in JSON
app.use((req, res) => {
    res.status(404).json({ message: `Error. ${req.url} is not found.` })
});

//Start up server
app.listen(PORT, () => {
    console.log(`App started and is listening on port ${PORT} at ${new Date()}.`);
})
