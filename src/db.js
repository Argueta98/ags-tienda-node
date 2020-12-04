const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ro_user14:eSowUkUgMhUDsFkz@clasebdd.hjuyp.mongodb.net/parcial2?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(db => console.log('Conectado a MongoDB'))
    .catch(err => console.log(err));