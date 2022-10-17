'use strict'

var gCurrDisplay = 'table'
var gCurrPageEl

function onInit() {
  renderFilterByQueryStringParams()
  renderLangByQueryStringParams()
  renderBooks()
  doTrans()
}

function changeDisplay(el, choise) {
  if (choise === 'table') {
    el.classList.add('chosen')
    document.querySelector('.cards-btn').classList.remove('chosen')
  } else {
    el.classList.add('chosen')
    document.querySelector('.table-btn').classList.remove('chosen')
  }
  gCurrDisplay = choise
  renderBooks()
  doTrans()
}

function renderBooks() {
  var books = getBooks()
  const elTable = document.querySelector('.table-container')
  const elCards = document.querySelector('.cards-container')
  if (gCurrDisplay === 'table') {
    elCards.classList.add('hidden')
    elTable.classList.remove('hidden')
    var strHtml = books.map(
      (book) =>
        `<tr><td>${book.id}</td><td>${book.name}</td><td data-id="${book.id}" data-trans="price-currency">${book.price}$</td>
      <td><button onclick="onOpenModal('${book.id}')" data-trans="read-btn" class="btn btn-success btn-sm btn-sm">Read</button></td>
      <td><button onclick="onUpdateBook('${book.id}')" data-trans="update-btn" class="btn btn-warning btn-sm btn-sm">Update</button></td>
      <td><button onclick="onRemoveBook('${book.id}')" data-trans="delete-btn" class="btn btn-danger btn-sm btn-sm">Delete</button></td>
      <td>${book.rate}</td><tr>`
    )

    var elTbody = document.querySelector('.table-container tbody')
    elTbody.innerHTML = strHtml.join('')
  } else {
    elTable.classList.add('hidden')
    elCards.classList.remove('hidden')

    var strHtml = books.map(
      (book) => `<div class="card text-bg-info text-center shadow p-3 mb-5 bg-info rounded" style="width: 18rem;">
     <img src="images/${book.name}.jpg" class="card-img-top" alt="...">
     <div class="card-body">
     <h3 class="card-title"><span data-trans="book-name">Title:</span>: ${book.name}</h3>
     <h4 class="card-text"><span data-trans="book-id"> Id:</span>:\n ${book.id}</h4>
     <h5 class="card-text" data-id="${book.id}" data-trans="price-currency">Price:\n ${book.price.toFixed(2)}$</h5>
     <div class="btn-group" role="group" aria-label="Basic mixed styles example">
     <button type="button" onclick="onOpenModal('${book.id}')" class="btn btn-success btn-sm">Read</button>
     <button type="button" onclick="onUpdateBook('${book.id}')" class="btn btn-warning btn-sm">Update</button>
     <button type="button" onclick="onRemoveBook('${book.id}')" class="btn btn-danger btn-sm">Delete</button>
     </div>
     <h5 class="card-text"><span data-trans="book-rate">Rate:</span>\n  ${book.rate}</h5></div></div>
     `
    )
    elCards.innerHTML = strHtml.join('')
  }
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
  doTrans()
}

function onAddBook() {
  var elBookName = document.querySelector('[name=add-book]')
  var elBookPrice = document.querySelector('[name=add-price]')
  if (!elBookName.value || !elBookPrice.value) return
  addBook(elBookName.value, parseInt(elBookPrice.value))
  renderBooks()
  doTrans()
  elBookName.value = ''
  elBookPrice.value = ''
}

function onUpdateBook(bookId) {
  var bookPrice = +prompt('Enter the update price')
  if (bookPrice === 0 || isNaN(bookPrice)) return
  updateBook(bookId, bookPrice)
  renderBooks()
  doTrans()
}

function onOpenModal(bookId) {
  var currBook = getBookById(bookId)
  var elModal = document.querySelector('.modal-card')
  elModal.querySelector('h3').innerText = currBook.name

  elModal.querySelector('div').innerHTML = `
  <button onclick="onDowngrading('${currBook.id}')">➖</button>
  <span class="rate">0</span>
  <button onclick="onUpgrading('${currBook.id}')">➕</button>
  `

  elModal.querySelector('p').innerText = makeLorem(40)
  elModal.querySelector('img').src = currBook.imgUrl
  elModal.classList.add('open')
}

function onCloseModal() {
  document.querySelector('.modal-card').classList.remove('open')
  renderBooks()
  doTrans()
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
  renderBooks()
  doTrans()
  const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
  const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetFilterByName(bookName) {
  setBookFilterByName(bookName)
  renderBooks()
}

function onChangePage(diff) {
  debugger
  if (gCurrPageEl) gCurrPageEl.classList.remove('pages-btns')
  var currIdx = nextPage(diff)
  var elPage = document.querySelectorAll('.page-item')
  elPage.forEach((el) => {
    if (el.value === currIdx) {
      el.classList.add('pages-btns')
      gCurrPageEl = el
    }
  })
  renderBooks()
  doTrans()
}

function onPageByNum(el, idx) {
  if (pageByNum(idx) === null) return
  if (gCurrPageEl) gCurrPageEl.classList.remove('pages-btns')
  gCurrPageEl = el
  renderBooks()
  doTrans()
  gCurrPageEl.classList.add('pages-btns')
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

function renderLangByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const lang = queryStringParams.get('lang') || ''

  if (!lang) return
  onSetLang(lang)
  document.querySelector('.lang').value = lang
}

function onSetLang(lang) {
  setLang(lang)
  onSetDirection(lang)
  doTrans()
  const queryStringParams = `?lang=${gCurrLang}`
  const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetDirection(lang) {
  lang === 'he' ? document.body.classList.add('rtl') : document.body.classList.remove('rtl')
}

function onSortBy(sortBy) {
  setSortBy(sortBy)
  renderBooks()
  doTrans()
}
