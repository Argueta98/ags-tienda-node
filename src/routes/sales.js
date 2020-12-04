const router = require('express').Router();
const Sale = require('../models/Sales');

router.get('/sales/sales-log', (req, res) => {
  res.render('sales/add-sales');
});

router.post('/sales/add-sales', async (req, res) => {
  const { nombreProducto, descProducto, tipoProducto, cantProducto, valorProducto } = req.body;
  console.log(req.body);
  const errors = [];
  if (nombreProducto === '') {
    errors.push({text: 'Inserte nombre del producto!!!'});
  }
  if (descProducto === '') {
    errors.push({text: 'Inserte descripción del producto!!!'});
  }
  if (cantProducto === '') {
    errors.push({text: 'Ingrese la cantidad de productos!!!'});
  }
  if (valorProducto === '') {
    errors.push({text: 'Ingrese valor unitario del producto!!!'});
  }
  if (tipoProducto === '') {
    errors.push({text: 'Seleccione un tipo de producto!!!'});
  }
  if (errors.length > 0) {
    res.render('sales/add-sales', {
      errors,
      nombreProducto,
      descProducto,
      tipoProducto,
      cantProducto,
      valorProducto
    });
  } else {
    const newSale = new Sale({
      nombreProducto,
      descProducto,
      tipoProducto,
      cantProducto,
      valorProducto
    });
    await newSale.save();
    //console.log(newSale);
    res.redirect('/sales/sales-all');
  }

});

router.get('/sales/dashboard-free', (req, res) => {
  res.render('sales/dashboard-free');
});

router.get('/sales/sales-all', async (req, res) => {
  const searchSale = await Sale.find().sort({dateProducto: 'desc'});
  res.render('sales/sales-pro', { searchSale });
});

router.get('/sales/edit/:id', async (req, res) => {
  const saleEdit = await Sale.findById(req.params.id);
  res.render('sales/sales-edit', {saleEdit});
});

router.put('/sales/sales-edit/:id', async (req, res) => {
  let saleId = req.params.id;
  let updateSale = req.body;

  const verificar = await Sale.findByIdAndUpdate(saleId, updateSale, (err, productoUpdated) => {
     if(err) return res.status(500).send({message: `Error al actualizar el producto: ${err}`})

     if(!productoUpdated) return res.status(500).send({message: 'No retornó objeto actualizado'})

     res.redirect('/sales/sales-all');
   });
   console.log(updateSale);
/*
  const verificar = await Sale.findByIdAndUpdate(req.params.id, {
      nombreProducto1,
      descProducto1,
      tipoProducto1,
      cantProducto1,
      valorProducto1
    });
    console.log(verificar);
    res.redirect('/sales/sales-all');
*/
});

module.exports = router;
