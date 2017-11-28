'use strict';
var mongodb = require('mongodb').MongoClient; 

// if url is in database reroute to website
// else present error
function routeShortUrl( req, res, url ){
  console.log( 'url is ')
  console.log( url )
  mongodb.connect( process.env.DB, (err, db)=>{
    db.collection('urls').find({ short_url: url }).toArray( (err, docs)=>{
      console.log( 'doc found ')
      console.log( docs )
      if( docs.length === 0 ){
        res.json( { error: "An entry has not been made for this item yet. Please use the api as instructed on the home page to get started"} )
      } else {
        res.redirect( docs[0].original_url );
      }      
    })
  })
}

module.exports = routeShortUrl;