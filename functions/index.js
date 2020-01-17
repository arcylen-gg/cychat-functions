const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/messages', (req, res) => {
    admin
        .firestore()
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let messages = [];
            data.forEach((doc) => {
                messages.push(doc.data());
            });
            return res.json(messages)
        })
        .catch((err) => console.error(err));
})

app.post('/message', (req, res) => {
    const newMessage = {
        message: req.body.message,
        username: req.body.username,
        read: false,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    admin
        .firestore()
        .collection('messages')
        .add(newMessage)
        .then((doc) => {
            res.json({ message : `document ${doc.id} created succesfully`});
        })
        .catch((err) => {
            res.status(500).json({error: `Something went wrong`});
            console.error(err);
        });
});

exports.api = functions.https.onRequest(app);