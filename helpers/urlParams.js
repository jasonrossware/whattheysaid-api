function assembleUrlParams(object) {
  const parts = Object.keys(object).map((key, i) => {
    if (i === 0) {
      return `?${key}=${object[key]}`
    } else {
      return `&${key}=${object[key]}`
    }
  })
  return parts.join('');
}

module.exports = { assembleUrlParams };