import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${process.env.NEXT_APP_API_URL}/categories`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }


}
