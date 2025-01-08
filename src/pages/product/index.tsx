import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/db';
import { Product } from '../../../../lib/models/product';
import { isValidObjectId } from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { id } = req.query;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid Product ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
      }
      break;

    case 'PATCH':
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(updatedProduct);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
      }
      break;

    case 'PUT':
      try {
        const replacedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          overwrite: true,
        });
        if (!replacedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(replacedProduct);
      } catch (error) {
        res.status(500).json({ error: 'Failed to replace product' });
      }
      break;

    case 'DELETE':
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
