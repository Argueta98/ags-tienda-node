const express = require('express');
const expressHbs = require('express-handlebars');
const path = require('path');
const methodOver = require('method-override');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport');

//agregados
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const index = require('./routes/index');
const products = require('./routes/products');
const product = require('./models/product');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');



//Agregados
mongoose.connect("mongodb+srv://ro_user14:eSowUkUgMhUDsFkz@clasebdd.hjuyp.mongodb.net/parcial2?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(db => console.log('Conectado a MongoDB'))
    .catch(err => console.log(err));

// Inicializaciones.
const app = express();
require('./db');
require('./config/passport');

//agregados
app.use(favicon(path.join(__dirname, 'favicon.png')));

// Configuraciones.
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');
app.engine('.hbs', expressHbs({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares.
app.use(logger('dev')); //agregada
app.use(bodyParser.json()); //agregada
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //agregada
app.use(methodOver('_method'));
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());





// Variables globales.
app.use((req, res, next) => {
    res.locals.session = req.session; // res.locals is an object passed to hbs engine
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Rutas
app.use(require('./routes/index'));
app.use(require('./routes/user'));
app.use(require('./routes/sales'));
app.get('/saveitem', products.create); //agregadas
app.post('/additem', products.store); //agregadas

// Archivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// Servidor.
app.listen(app.get('port'), () => {
    console.log('Servidor corriendo en el puerto: ', app.get('port'));
});


module.export = index;