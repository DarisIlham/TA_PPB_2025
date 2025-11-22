// middlewares/error.handler.js
export default (err, req, res, next) => {
  console.error(err.stack);
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({ 
      error: 'Validation Error',
      messages: errors 
    });
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ 
      error: 'Duplicate Field Error',
      message: `${field} already exists` 
    });
  }
  
  // Handle ObjectId errors
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      error: 'Invalid ID',
      message: 'The provided ID is not valid' 
    });
  }
  
  // Default error handler
  res.status(err.statusCode || 500).json({
    error: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};