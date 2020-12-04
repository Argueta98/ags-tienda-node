const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

// Ruta de inicio de sesión.
router.get('/users/sign-in', (req, res) => {
  res.render('users/iniciar');
});

router.post('/users/sign-in', passport.authenticate('local', {
  successRedirect: '/sales/dashboard-free',
  failureRedirect: '/users/sign-in',
  failureFlash: true
}));

// Ruta para registrar usuarios.
router.get('/users/sign-up', (req, res) => {
  res.render('users/registrar');
});

// Proceso de inserción de usuario - api - mongoAtlas.
router.post('/users/sign-up', async (req, res) => {
  const { nombreUsuario, correoUsuario, contraUsuario1, contraUsuario2, tipoUsuario } = req.body;
  console.log(req.body);
  const errors = [];
  if (nombreUsuario.length <= 0 || correoUsuario.length <= 0 || contraUsuario1.length <= 0 || contraUsuario2.length <= 0) {
    errors.push({text: 'Rellene todos los campos!!!'});
  }
  if (contraUsuario1 != contraUsuario2) {
    errors.push({text: 'Ambas contraseñas son distintas!!!'});
  }
  if (contraUsuario1.length < 4) {
    errors.push({text: 'La contraseña debe de tener más de 4 carácteres!!!'})
  }
  if (errors.length > 0) {
    res.render('users/registrar', { errors, nombreUsuario, correoUsuario, contraUsuario1, contraUsuario2, tipoUsuario });
  } else {
    const correoVali = await User.findOne({correo: correoUsuario});
    if (correoVali) {
      req.flash('error_msg', 'Este correo ya esta en uso!!!');
      res.redirect('/users/sign-up');
    }
    const newUser = new User({ nombreUsuario, correoUsuario, contraUsuario1, tipoUsuario});
    //console.log(newUser);
    newUser.usuario = await nombreUsuario;
    newUser.correo = await correoUsuario;
    newUser.tipoU = await tipoUsuario;
    newUser.contra = await newUser.encryptPassword(contraUsuario1);
    await newUser.save();
    req.flash('success_msg', 'Te has registrado con éxito!!!');
    res.redirect('/users/sign-in');
  }

});

router.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
