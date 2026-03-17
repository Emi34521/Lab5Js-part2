# Lab5Js-part2
# Mini Blog — JavaScript + DOM + REST API Lab

## Description
A Mini Blog / Bulletin Board web application built with plain HTML, CSS, and JavaScript (no libraries or frameworks). It consumes the public [DummyJSON – Posts](https://dummyjson.com/docs/posts) API.

## Features
- Post listing fetched from the API (GET /posts)
- Text-based post search using query params (GET /posts/search?q=text)
- Form to create new posts (POST /posts/add with JSON body)
- Full UI States on both views: idle, loading, success, empty, error (with retry button)
- Locally created posts are stored in memory and displayed alongside API posts, labeled "Tu post"

## Endpoints used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/posts` | Load all posts on startup |
| GET | `/posts/search?q=text` | Search posts by text |
| POST | `/posts/add` | Create a new post |

## Project structure
```
/
├── index.html          <- only file at the root
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── .gitignore
└── README.md
```

## Installation
No dependencies. Just clone the repository and open `index.html` in a browser.

```bash
git clone <repo-url>
cd mini-blog
# Open index.html in your browser
```

Also published on GitHub Pages: [Live demo](#) *(update link before submitting)*

## Screenshots
*(Add screenshots here before final submission)*

## Demo video
*(Add video link here)*

## Commit history
| # | Description |
|---|-------------|
| 1 | HTML structure + base CSS: layout, static cards, form, UI state containers |
| 2 | JS: API fetch, search with query params, dynamic UI states |
| 3 | POST to create posts, local post storage, retry with saved data, final README |

Video: https://youtu.be/TjNJxRGY8R4 