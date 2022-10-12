"use strict"
const STORAGE_KEY = "bookDB"
var gBooks
const PAGE_SIZE = 4
var gPageIdx = 0
var gFilterBy = {
  maxPrice: Infinity,
  minRate: 0,
  name: "",
}
const gFirst_Books = [
  { name: "Jungle Book", price: 65 },
  { name: "Lion King", price: 150 },
  { name: "Rapunzel", price: 50 },
  { name: "Harry Poter", price: 100 },
]

_creatBooks()

function _creatBook(name = "Rapunzel", price = 100) {
  return {
    id: makeId(),
    name,
    price,
    imgUrl: "https://www.clipartqueen.com/image-files/orange-book-clipart.png",
    rate: 0,
  }
}

function _creatBooks() {
  var books = loadFromStorage(STORAGE_KEY)
  if (!books || !books.length) {
    books = []
    gFirst_Books.map((book) => {
      books.push(_creatBook(book.name, book.price))
    })
  }
  gBooks = books
  saveToStorage(STORAGE_KEY, gBooks)
}

function getBooks() {
  var books = gBooks.filter(
    (book) => book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate
  )
  books.sort((book1, book2) => book1.price - book2.price)

  const startIdx = gPageIdx * PAGE_SIZE
  books = books.slice(startIdx, startIdx + PAGE_SIZE)

  if (gFilterBy.name)
    books = gBooks.filter((book) => book.name.toLowerCase().includes(gFilterBy.name.toLowerCase()))
  return books
}

function nextPage() {
  if ((gPageIdx + 1) * PAGE_SIZE >= gBooks.length) return
  gPageIdx++
}

function prevPage() {
  if (gPageIdx === 0) return
  gPageIdx--
}

function removeBook(bookId) {
  const book_Idx = gBooks.findIndex((book) => book.id === bookId)
  gBooks.splice(book_Idx, 1)
  saveToStorage(STORAGE_KEY, gBooks)
}

function addBook(name, price) {
  gBooks.push(_creatBook(name, price))
  saveToStorage(STORAGE_KEY, gBooks)
}

function updateBook(bookId, bookPrice) {
  var currBook = getBookById(bookId)
  currBook.price = bookPrice
  saveToStorage(STORAGE_KEY, gBooks)
}

function getBookById(bookId) {
  return gBooks.find((book) => book.id === bookId)
}

function updateRate(bookId, bookRate) {
  var currBook = getBookById(bookId)
  currBook.rate = bookRate
  saveToStorage(STORAGE_KEY, gBooks)
}

function setBooksFilter(filterBy) {
  if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
  if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
  return gFilterBy
}

function getMaxPrice() {
  return gBooks.reduce((a, b) => Math.max(a, b.price), -Infinity)
}

function setBookFilterByName(bookName) {
  gFilterBy.name = bookName.name
}
