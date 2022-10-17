const gTrans = {
  title: {
    en: 'Book Shop - Inventory',
    he: 'חנות ספרים - מלאי',
  },
  'book-name': {
    en: 'Title',
    he: 'שם ',
  },
  'book-price': {
    en: 'Price',
    he: 'מחיר',
  },
  'add-btn': {
    en: 'Add Book',
    he: 'הוסף ספר',
  },
  'enter-name': {
    en: 'Enter book title...',
    he: 'הכנס את שם הספר...',
  },
  'enter-price': {
    en: 'Enter book price...',
    he: 'הכנס את מחיר הספר...',
  },
  'filter-price': {
    en: 'Sort by price',
    he: 'מיין לפי מחיר',
  },
  'filter-rate': {
    en: 'Sort by rate',
    he: 'מיין לפי דירוג',
  },
  search: {
    en: 'Search:',
    he: 'חפש:',
  },
  'book-id': {
    en: 'ID',
    he: 'מזהה',
  },
  'price-currency': {
    en: 'USD',
    he: 'ILS',
  },
  'book-actions': {
    en: 'Actions',
    he: 'פעולות',
  },
  'book-rate': {
    en: 'Rate',
    he: 'דירוג',
  },
  'read-btn': {
    en: 'Read',
    he: 'קרא',
  },
  'update-btn': {
    en: 'Update',
    he: 'עדכן',
  },
  'delete-btn': {
    en: 'Delete',
    he: 'מחק',
  },
  'close-modal': {
    en: 'Close',
    he: 'סגור'
  },
  'change-book': {
    en: 'Save changes',
    he: 'שמור שינויים'
  },
  'sort-by': {
    en: 'Sort By',
    he: 'מיין לפי'
  },
  navbar: {
    en: 'Books',
    he: 'ספרים'
  }
}

let gCurrLang = 'en'

function getTrans(transKey) {
  const transMap = gTrans[transKey]
  if (!transMap) return 'UNKNOWN'

  let trans = transMap[gCurrLang]
  if (!trans) trans = transMap.en
  return trans
}

function doTrans() {
  const els = document.querySelectorAll('[data-trans]')
  els.forEach((el) => {
    const transKey = el.dataset.trans
    const trans = getTrans(transKey)
    if (el.dataset.id) {
      var book = getBookById(el.dataset.id)
      el.innerText = formatCurrency(book.price, trans)
      if (trans === 'ILS') el.style.direction = 'ltr'
    } else {
      el.innerText = trans
      if (el.placeholder) el.placeholder = trans
    }
  })
}

function setLang(lang) {
  gCurrLang = lang
}

function formatNum(num) {
  return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatCurrency(num, currency) {
  if (currency === 'ILS') num /= 3.55
  return new Intl.NumberFormat(gCurrLang, { style: 'currency', currency: currency }).format(num)
}

function formatDate(time) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}
