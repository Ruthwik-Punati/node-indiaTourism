module.exports = class ApiFeatures {
  constructor(queryObj, query) {
    this.query = query
    this.queryObj = queryObj
  }
  filter() {
    const arr = ['fields', 'sort', 'page', 'limit']

    const filterObj = {}

    Object.keys(this.queryObj).forEach((key) => {
      if (arr.includes(key)) {
        return
      } else {
        filterObj[key] = this.queryObj[key]
      }
    })

     this.query.find(filterObj)

    return this
  }
  sort() {
    const sortt = this.queryObj.sort
    if (sortt) {
      this.query.sort(sortt.replace(',', ' '))
    }
    return this
  }
  fields() {
    const fieldss = this.queryObj.fields
    if (fieldss) {
      this.query.select(fieldss.replace(',', ' '))
    }
    return this
  }
  pagination() {
    const page = this.queryObj.page
    const limit = this.queryObj.limit || 2
    if (page) {
      this.query.skip(page * limit).limit(limit)
    }
    return this
  }
}
