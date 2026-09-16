import { Router } from 'express';
import { ProductModel } from '../models/Product';

export const productsRouter = Router();

productsRouter.get('/', async (_req, res) => {
  const products = await ProductModel.find().sort({ category: 1, name: 1 }).lean();
  res.json(products);
});

productsRouter.get('/:slug', async (req, res) => {
  const product = await ProductModel.findOne({ slug: req.params.slug }).lean();
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});
