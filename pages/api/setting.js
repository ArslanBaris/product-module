import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get('http://localhost:3001/setting');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }


}
