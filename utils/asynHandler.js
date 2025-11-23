/*2nd approach
using promises*/

const asyncHandler = (requestHandler) =>{
return (req,res,next) =>{
  Promise.resolve(requestHandler(req, res, next)).catch((err) =>
next(err))
  }
}

export {asyncHandler} 

/* asynHandler
is a higher-order functioni
 a higher-order functioni is a fuction that does one of the following:

Takes another function as an argumentor parameter.
Returns another function as its result.*/


/* 1st approach
using try catch block

//const asyncHandler = ()=>{}
  //const asyncHandler = (fn)=> () => {}
    //const asyncHandler = (fn) => async() => {}

const asyncHandler = (fn) => async (req, res, next) => {
try{
await fn(req,res,next)
}
catch (error){
res.status(err.code || 500).json({
  success:false,
  message: err.message
})
}
}
*/
