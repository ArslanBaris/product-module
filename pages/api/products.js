import axios from "axios";

export default async function handler(req, res) {

  switch (req.method) {
    case "GET":
      getProducts(req,res);
      break;
    case "POST":
      addProduct(req,res);
      break;
    case "PUT":
      updateProduct(req,res);
      break;
    case "DELETE":
      deleteProduct(req, res);
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }

  // if (req.method === 'GET') {
  //   getProducts();
  // } else if (req.method === 'POST') {
  //   addProduct(req.body);
  // } else if (req.method === 'PUT') {
  //   updateProduct(req.body);
  // } else if (req.method === 'DELETE') {
  //   deleteProduct(req.body);
  // } else {
  //   res.status(405).json({ message: 'Method not allowed' });
  // }

}


async function getProducts(req, res) {
  try {
    const response = await axios.get('http://0.0.0.0:3001/product');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
}

async function addProduct(req, res) {
  try {
    const response = await axios.post('http://0.0.0.0:3001/product', req.body);
    res.status(200).json(response.data);
  }catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
}

async function updateProduct(req, res) {
  const { id } = req.query; 
  try {
    const response = await axios.put(`http://0.0.0.0:3001/product/${id}`, req.body);
    res.status(200).json(response.data);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.query;
  try {
    const response = await axios.delete(`http://0.0.0.0:3001/product/${id}`);
    res.status(200).json(response.data);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
}

