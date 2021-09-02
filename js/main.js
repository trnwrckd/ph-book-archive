const spinner = document.getElementById("spinner");
const noResult = document.getElementById("no-result");
const searchResult = document.getElementById("search-results");
const bookContainer = document.getElementById("books-container");

// toggle visibility 
const toggleVisibility = (id, dValue) => {
    id.style.display = dValue;
}

// API loading function
const loadAPI = () => {
    toggleVisibility(spinner, 'block');
    toggleVisibility(noResult, 'none');
    // clear prev results
    document.getElementById("books-container").textContent = '';
    toggleVisibility(searchResult, 'none');

    const searchField = document.getElementById("search-input");
    const searchText = searchField.value;
    searchField.value = '';
    // NOTE TO EXAMINER - changed url to https because of mixed content error
    const url = `https://openlibrary.org/search.json?q=${searchText}`;
    document.getElementById("search-handle").innerText = `"${searchText}"`
    // fetch 
    fetch(url).then(res => res.json()).then(data => displayData(data)).catch(error => console.log(error));
}

// display data
const displayData = (data) => {
    const numResults = data.num_found;
    toggleVisibility(spinner, 'none');

    // no result handling
    if (numResults === 0) {
        toggleVisibility(noResult, 'block');
    }
    else {
        data.docs.forEach(book => displaySingleBook(book));
        toggleVisibility(searchResult, 'block');
        const numResultsField = document.getElementsByClassName("num-results");
        for (const field of numResultsField) {
            field.innerText = `${numResults}`;
        }
    }
}


// display single book
const displaySingleBook = (book) => {
    // console.log(book);
    const div = document.createElement("div");
    const noImageURL = "./images/no-image.png";

    // data cleaning
    const bookCover = (book.cover_i !== undefined) ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : noImageURL;
    const bookTitle = (book.title !== undefined) ? book.title : "Not found";
    const authorName = (book.author_name !== undefined) ? book.author_name[0] : "Not found";
    const publisherName = (book.publisher !== undefined) ? book.publisher[0] : "Not found";
    const firstPublished = (book.first_publish_year !== undefined) ? book.first_publish_year : "Not found";
    div.classList.add("col");
    div.innerHTML = `
        <div class="card h-100 shadow">
            <div>
                <img src="${bookCover}" class="card-img-top" height="270"  alt="...">
            </div>
            <div class="card-body d-flex flex-column ">
                <h5 class="card-title">${bookTitle}</h5>
                <h6 class="card-subtitle pt-2">Author: <b>${authorName}</b></h6>
                <div class="py-3">
                    <p class="card-text">
                        Publisher: <span id="publisher">${publisherName}</span>
                        <br>
                        First Published: <span id="first-published">${firstPublished}</span>
                    </p>
                </div>
            </div>
        </div>`

    bookContainer.appendChild(div);
}

// scroll 
const scrollToTop = () => {
    window.scrollTo(0, 0);
}