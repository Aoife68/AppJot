if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://Aoife68:Not_12_Lego@ds243008.mlab.com:43008/appjot-prod'
  }
} else{
  module.exports = {mongoURI: 'mongodb://localhost/appjot-dev'}
}