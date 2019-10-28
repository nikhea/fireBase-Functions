const express = require("express");
const cors = require("cors");
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const uuidv5 = require('uuid/v5')
const imonikhea = require ('uuid/v1')()

admin.initializeApp(functions.config().firebase)

const app = express();
cors({ origin: true })

const db = admin.database().ref('/users')
const db2 = functions.database.ref("/users/{userID}")

  //@desc get A user
  //@access Public

app.get("/", (req, res) => {
  return db.on("value", user => {
      return res.status(200).send(user.val());
  }, error => {
   
    return res.status(500).send(`Oops Error ${error}`);
  });
});




  //@desc Create A User
    //@access Public
  app.post("/", (req, res) => {
    
    const NewUsers = req.body;
         return db.push(NewUsers)
        .then(() => {
            return res.status(200).send(NewUsers)
        }).catch(error => {
            
            return res.status(500).send(error);
        });
  });


exports.UpdateUsers = db2.onCreate((snapShot, contex) => {
      const userID =contex.params.userID
     const userData = snapShot.val();
     const key = uuidv5(userID, imonikhea);
     return snapShot.ref.update({key});
    })

exports.firebaseusers = functions.https.onRequest(app);