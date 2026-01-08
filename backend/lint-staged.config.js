module.exports = {
  '*.{js,jsx,ts,tsx}': filenames => {
    if (filenames.length === 0) {
      return []
    }
    return [
      `oxfmt --write ${filenames.join(' ')}`,
      'oxlint --fix'
    ]
  },
  '*.{css,less,scss,pcss}': [
    'stylelint --fix'
  ]
}