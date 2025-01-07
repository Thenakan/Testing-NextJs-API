// pages/api/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import DBconnect from '../../../../../lib/mongodb';  // Import the DB connection
import Product from '../../../../../models/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to MongoDB
  await DBconnect();

  switch (req.method) {
    case 'GET':
      // Fetch all products
      try {
        const products = await Product.find({});
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products' });
      }
      break;
    case 'POST':
      // Create a new product
      try {
        const { name, description, price, stock } = req.body;
        const newProduct = new Product({ name, description, price, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
      } catch (error) {
        res.status(400).json({ message: 'Failed to create product' });
      }
      break;
    case 'PATCH':
      // Update an existing product
      try {
        const { id, name, description, price, stock } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { name, description, price, stock },
          { new: true }
        );
        res.status(200).json(updatedProduct);
      } catch (error) {
        res.status(400).json({ message: 'Failed to update product' });
      }
      break;
    case 'DELETE':
      // Delete a product
      try {
        const { id } = req.query;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
      } catch (error) {
        res.status(400).json({ message: 'Failed to delete product' });
      }
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
