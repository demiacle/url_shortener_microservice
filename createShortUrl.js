'use strict';

var mongodb = require('mongodb').MongoClient;
var randomWords = require('random-words');

function createShortUrl( res, urlToStore ){
  let randomWord = randomWords() + randomWords();
  
  mongodb.connect( process.env.DB, (err, db)=>{
    db.collection('urls').find( { $or: [{ short_url: randomWord }, { original_url: urlToStore }]}).toArray( (err, docs)=>{
      if(err)
        console.log(err)
      
      if( docs.length === 0 ){     
        let newDoc = { original_url : urlToStore, short_url: randomWord };
        db.collection('urls').insertOne( newDoc ).then( function(result) {
          console.log('adding new entry')   
          res.json( cleanResponse( newDoc ) );
        })
      } else if( docs[0].original_url === urlToStore ) {
        console.log( 'found original in use')
        res.json( cleanResponse( docs[0] ) )
      } else {
        console.log('error')
        res.json( { error: "An error occurred while processing your request" } )
      }
    })
  })
}

function cleanResponse( jsonResponse ){
  delete jsonResponse._id
  jsonResponse.short_url = 'https://neat-snail.glitch.me/' + jsonResponse.short_url;
  return jsonResponse;
}
  
module.exports = createShortUrl;