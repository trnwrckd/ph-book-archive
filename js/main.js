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
    toggleVisibility(searchResult, 'none');

    const searchField = document.getElementById("search-input");
    const searchText = searchField.value;
    searchField.value = '';
    const url = `http://openlibrary.org/search.json?q=${searchText}`;
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
        const numResultsField = document.getElementById("num-results");
        numResultsField.innerText = `${numResults} items found.`
    }
}


// display single book
const displaySingleBook = (book) => {
    // console.log(book);
    const div = document.createElement("div");
    const noImageURL = "./images/no-image.png";
    // data cleaning
    const bookCover = (book.cover_i != undefined) ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : noImageURL;
    const authorName = (book.author_name != undefined) ? book.author_name[0] : "Not Found";
    const publisherName = (book.publisher != undefined) ? book.publisher[0] : "Not Found";

    div.classList.add("col");
    div.innerHTML = `
        <div class="card h-100">
            <img src="${bookCover}" class="card-img-top img-fluid" alt="...">
            <div class="card-body d-flex flex-column justify-content-end">
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-subtitle">Author: ${authorName}</h6>
                <p class="card-text">
                    Publisher: <span id="publisher">${publisherName}</span>
                    <br>
                    First Published: <span id="first-published">${book.first_publish_year}</span>
                </p>
            </div>
        </div>`

    bookContainer.appendChild(div);
}