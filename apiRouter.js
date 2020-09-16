// Imports
var express = require('express');
var catsController = require('./controllers/catsController');

//Router
exports.router = (function() {
  var apiRouter = express.Router();

  // cat routes
  apiRouter.route('/cats/').post(catsController.addCat);
  apiRouter.route('/cats/').get(catsController.getAllCats);
  apiRouter.route('/cats/:id').get(catsController.getCatById);
  apiRouter.route('/cats/:id').delete(catsController.deleteCatById);
  apiRouter.route('/cats/').delete(catsController.deleteAllCats);
  
  //vote routes
  apiRouter.route('/vote/cats/:id').put(catsController.voteForCatById);
  apiRouter.route('/unvote/cats/:id').put(catsController.unvoteForCatById);
  apiRouter.route('/votes').get(catsController.getAllCatOrderByVotes);

  //Latelier routes
  apiRouter.route('/cats/from/latelier').get(catsController.getAllCatsFromLatelier);


  
  return apiRouter;
})();