'use strict'
var gcurrChoise

function onInit() {
  renderFilterByQueryStringParams()

  renderBooksByTable()
}

function displayChoise(choise) {
  renderBooksByTable(choise)
}

function renderBooksByTable() {
  var books = getBooks()
  document.querySelector('.cards-container').classList.add('hidden')
  document.querySelector('.table-container').classList.remove('hidden')
  var strHtml = books.map(
    (book) =>
      `<tr><td>${book.id}</td><td>${book.name}</td><td>${book.price.toFixed(2)}$</td>
      <td><button onclick="onOpenModal('${book.id}')" class="read-btn">Read</button></td>
      <td><button onclick="onUpdateBook('${book.id}')" class="update-btn">Update</button></td>
      <td><button onclick="onRemoveBook('${book.id}')" class="delete-btn">Delete</button></td>
      <td>${book.rate}</td><tr>`
  )
  var elTbody = document.querySelector('.table-container tbody')
  elTbody.innerHTML = strHtml.join('')
}

function renderBooksByCards() {
  var books = getBooks()
  document.querySelector('.table-container').classList.add('hidden')
  document.querySelector('.cards-container').classList.remove('hidden')
  var strHtml = books.map(
    (book) => `<div class="cards">
   <h3>Title:\n ${book.name}</h3>
   <h4>Id:\n ${book.id}</h4>
   <h5>Price:\n ${book.price.toFixed(2)}$</h5>
   <button onclick="onOpenModal('${book.id}')" class="read-btn">Read</button>
   <button onclick="onUpdateBook('${book.id}')" class="update-btn">Update</button>
   <button onclick="onRemoveBook('${book.id}')" class="delete-btn">Delete</button>
   <h5>Rate:\n ${book.rate}</h5></div>`
  )
  var elCards = document.querySelector('.cards-container')
  elCards.innerHTML = strHtml.join('')
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooksByTable()
}

function onAddBook() {
  var elBookName = document.querySelector('[name=add-book]')
  var elBookPrice = document.querySelector('[name=add-price]')
  if (!elBookName.value || !elBookPrice.value) return
  addBook(elBookName.value, parseInt(elBookPrice.value))
  renderBooksByTable()
  elBookName.value = ''
  elBookPrice.value = ''
}

function onUpdateBook(bookId) {
  var bookPrice = +prompt('Enter the update price')
  if (bookPrice === 0 || isNaN(bookPrice)) return
  updateBook(bookId, bookPrice)
  renderBooksByTable()
}

function onOpenModal(bookId) {
  var currBook = getBookById(bookId)
  var elModal = document.querySelector('.modal')
  elModal.querySelector('h3').innerText = currBook.name

  elModal.querySelector('div').innerHTML = `
  <button onclick="onDowngrading('${currBook.id}')">➖</button>
  <span class="rate">0</span>
  <button onclick="onUpgrading('${currBook.id}')">➕</button>
  `

  elModal.querySelector('p').innerText = makeLorem(50)
  elModal.querySelector('img').src = currBook.imgUrl
  elModal.classList.add('open')
}

function onCloseModal() {
  document.querySelector('.modal').classList.remove('open')
  renderBooksByTable()
}

function onDowngrading(bookId) {
  var elBookRate = document.querySelector('.rate')
  if (elBookRate.innerText === '0') return
  elBookRate.innerText--
  updateRate(bookId, parseInt(elBookRate.innerText))
}

function onUpgrading(bookId) {
  var elBookRate = document.querySelector('.rate')
  if (elBookRate.innerText === '10') return
  elBookRate.innerText++
  updateRate(bookId, parseInt(elBookRate.innerText))
}

function onSetFilter(filterBy) {
  document.querySelector('[name=price]').max = getMaxPrice()
  filterBy = setBooksFilter(filterBy)
  renderBooksByTable()
  const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetFilterByName(bookName) {
  setBookFilterByName(bookName)
  renderBooksByTable()
}

function onNextPage(gcurrChoise) {
  nextPage()
  renderBooksByTable(gcurrChoise)
}
function onPrevPage(gcurrChoise) {
  prevPage()
  renderBooksByTable(gcurrChoise)
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    maxPrice: +queryStringParams.get('maxPrice') || '',
    minRate: +queryStringParams.get('minRate') || 0,
  }

  if (!filterBy.maxPrice && !filterBy.minRate) return
  document.querySelector('[name=price]').value = filterBy.maxPrice
  document.querySelector('[name=rate]').value = filterBy.minRate
  setBooksFilter(filterBy)
}
