class ApiError extends Error {
  constructor(
statusCode,
message= "something went wrong",
errors= [],
stack=null
  ){
    {/*here we overwrite object*/}
super(message)
this.statusCode = statusCode
this.data = null
this.message= message
this.success= false
this.errors= errors


     if (stack) {
      this.stack =stack
     }
     else{
      Error.captureStackTrace(this, this.constructor)
     }
  }
}

export {ApiError}

/* ApiError is a custom error class that extends the built-in Error class in JavaScript.
 It is designed to represent API-specific errors with additional properties such as statusCode, success, errors, and stack trace information. */