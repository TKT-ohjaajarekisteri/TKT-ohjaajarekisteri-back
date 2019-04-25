//Returns a date object from date format DD.MM.YYYY String
const parseDate = (date) => {
  const day = date.substring(0,2)
  const month = date.substring(3,5)
  const year = date.substring(6, date.length)
  return new Date(year + '-' + month + '-' + day)
}

module.exports = {
  parseDate
}