 import multer from "multer";

 const storage= multer.diskStorage({

  //destination to store files
  //here we have access to the files coming in the request and here cb is a callback function
  destination: function(req, file, cb){
    cb(null, "./public/temp")
  },

  filename: function(req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname)
  }
 })

 export const upload= multer({storage: storage});