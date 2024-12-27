// function wrapAsync (fn){
//     return function (req, res, next){
//         fn(req, res, next).catch(next); // .catch((err)=>next(err)) maybe same
//     }
// }

// module.exports=wrapAsync;
const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
};
module.exports = wrapAsync;
