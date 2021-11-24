module.exports = {
    errorHandler(err, req, res, next) {
      console.log(err);
      if (err.code === 11000) err.code = 400
      if (err.code) {
        res.status(err.code).json({status : "failed", message :err.message});
      } else {
        if (err.errors) {
          let error = Object.keys(err.errors);
          let message = err.errors[error].properties.message;
          res.status(500).json({status : "failed", message :message})
        } else {
          res.status(500).json({err: 'Something Error in our side!'});
        }
      }
    }
  }