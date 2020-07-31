const mongoose = require('mongoose');

const mongoDBConnectionStr = 'mongodb+srv://admin:Password01%21@cluster0.pmd5z.mongodb.net/lma?retryWrites=true&w=majority'

const connectionStr = process.env.DB || mongoDBConnectionStr;
mongoose.set('useFindAndModify', false);

mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;