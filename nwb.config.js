module.exports = {
  npm: {
    umd: {
      externals: {
        'react': 'React',
        'react-redux': 'react-redux',
        'react-dom': 'react-dom',
        'redux': 'redux',
        'redux-saga': 'redux-saga'
      }
    }
  }
}