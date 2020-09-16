//imports
var models    = require('../models');
var asyncLib  = require('async');
var https = require('https');

 
//routes
module.exports ={

    //Add cat to database
    addCat:function(req,res){
        
        //Params
        var id=req.body.id;
        var url=req.body.url;

        //Check if params not null
        if (id==null || url==null){
            return res.status(400).json({'error':'Missing parameters'});
        }

        // using async callback to verify if cat doesn't already exist
        asyncLib.waterfall([
          function(done) {
          models.Cat.findOne({
              where: { id: id }
          }).then(function (catFound) {
              done(null, catFound);
          })
          .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify cat' });
          });
          },
          function(catFound, done) {
              if(!catFound) {
                var newCat= models.Cat.create({
                  id:id,
                  url:url,
                })
                .then(function(newCat) {
                  done(newCat);   
                })
                .catch(function(err) {
                  console.log(err);
                  return res.status(500).json({ 'error': 'cannot add cat' });
                });
              } else {
              res.status(409).json({ 'error': 'cat already exist' });
          }
          },
      ], function(newCat) {
          if (newCat) {
            return res.status(201).json({
              'CatId':newCat.id
            });
          } else {
          return res.status(500).json({ 'error': 'cannot add cat' });
          }
      });  
        
    },


    //get specific cat by id
    getCatById:function(req,res){
      var id=req.params.id;
      
      models.Cat.findOne({
          where: { id: id }
      }).then(function(catFound){
          if(catFound){
              res.status(200).json(catFound);
          }
          else {
              res.status(404).json({ 'error': 'cat not found' });
          }
      }).catch(function(err) {
          console.log(err);
          res.status(500).json({ 'error': 'cannot fetch cat' });
      });
    },

    //get all cats from database
    getAllCats:function(req,res){
      models.Cat.findAll({
      }).then(function(cats){
          if(cats.length!=0){
              res.status(200).json(cats);
          }
          else {
              res.status(204).json({ 'message': 'no cats found' });
          }
      }).catch(function(err) {
          console.log(err);
          res.status(500).json({ 'error': 'cannot fetch cat' });
      });
    },


    //get all cats order by number of votes
    getAllCatOrderByVotes:function(req,res){
        models.Cat.findAll({
            order: [
                ['votes', 'DESC'],
                ['updatedAt', 'ASC'],
            ],
        }).then(function(cats){
            if(cats.length!=0){
                res.status(200).json(cats);
            }
            else {
                res.status(204).json({ 'message': 'no cats found' });
            }
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({ 'error': 'cannot fetch cat' });
        });
      },

    // increment the number of votes for a specific cat
    voteForCatById:function(req,res){
      
      //params
      var id=req.params.id;

      asyncLib.waterfall([
        function(done) {
        models.Cat.findOne({
            where: { id: id }
        }).then(function (catFound) {
            done(null, catFound);
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify cat' });
        });
        },
        function(catFound, done) {
            if(catFound) {
                
                var nb_votes=catFound.votes+1;
                
                catFound.update({
                  votes:nb_votes
                }).then(function(catFound) {
                    done(catFound);
                }).catch(function(err) {
                    res.status(500).json({ 'error': 'cannot update cat' });
            });
            } else {
            res.status(404).json({ 'error': 'cat not found' });
        }
        },
      ], function(catFound) {
        if (catFound) {
        return res.status(200).json({'messages':"cat updated"});
        } else {
        return res.status(500).json({ 'error': 'cannot update cat' });
        }
    });  


    },


    //decrement the number of votes for a specific cat
    unvoteForCatById:function(req,res){
      
        //params
        var id=req.params.id;
  
        asyncLib.waterfall([
          function(done) {
          models.Cat.findOne({
              where: { id: id }
          }).then(function (catFound) {
              done(null, catFound);
          })
          .catch(function(err) {
              return res.status(500).json({ 'error': 'unable to verify cat' });
          });
          },
          function(catFound, done) {
              if(catFound) {

                var nb_votes=catFound.votes-1;

                //check if the number of votes is not under 0
                if (nb_votes<0){
                    nb_votes=0;
                }
                  catFound.update({
                    votes:nb_votes
                  }).then(function(catFound) {
                      done(catFound);
                  }).catch(function(err) {
                      res.status(500).json({ 'error': 'cannot update cat' });
              });
              } else {
              res.status(404).json({ 'error': 'cat not found' });
          }
          },
        ], function(catFound) {
          if (catFound) {
          return res.status(200).json({'message':"cat updated"});
          } else {
          return res.status(500).json({ 'error': 'cannot update cat' });
          }
      });  
  
  
      },
  
    

    //delete cat by id
    deleteCatById:function(req,res){
      var id=req.params.id;

        models.Cat.destroy({
            where: { id: id }
        }).then(function(catDeleted){
            if(catDeleted){
                res.status(200).json({'message':"cat deleted"});
            }
            else {
                res.status(404).json({ 'error': 'Cat not found' });
            }
        }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot fetch cat' });
        });
    },
    
    //delete all cats in database
    deleteAllCats:function(req,res){  
          models.Cat.destroy({
          }).then(function(catDeleted){
              if(catsDeleted){
                  res.status(200).json({'message':"cat deleted"});
              }
              else {
                  res.status(404).json({ 'error': 'no cat found' });
              }
          }).catch(function(err) {
              res.status(500).json({ 'error': 'cannot fetch cat' });
          });
      },

      
    //get all cats from the json file in latelier website
    getAllCatsFromLatelier:function(req,response){
        var url = 'https://latelier.co/data/cats.json';

        https.get(url, function(res){
            var body = '';

            res.on('data', function(chunk){
                body += chunk;
            });

            res.on('end', function(){
                var fbResponse = JSON.parse(body);
                response.status(200).json(fbResponse);
                
            });
        }).on('error', function(e){
            console.log("Got an error: ", e);
        });
    },


    


}