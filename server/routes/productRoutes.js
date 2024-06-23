import express from 'express';
import { getAllProduct,
    // getProduct,
    getAdmiinProduct,getUserProduct,
    deleteProduct,updateProduct,
    createProduct,categoriesProduct,
    searchProduct } from '../controllers/productControllers.js';
    import Product from '../models/productModel.js';

const router = express.Router();


router.post('/',createProduct);
router.get('/',getAllProduct);
// router.get('/:id',getProduct);
router.get('/admin',getAdmiinProduct);
router.get('/url/:url',getUserProduct);
router.put('/:id',updateProduct);
router.delete("/:id",deleteProduct);
router.get('/categories',categoriesProduct);
router.get('/search',searchProduct);


router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  });

export default router; 

