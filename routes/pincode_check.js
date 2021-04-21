const router = require('express').Router();
const axios = require('axios');

router.post('/', (req, res) => {
  const { pincode } = req.body;
  axios
    .get(`https://api.postalpincode.in/pincode/${pincode}`)
    .then(result => {
      const {
        Block,
        District,
        State,
      } = result.data[0].PostOffice[0];

      return res
        .status(200)
        .json({ City: Block, District, State });
    })
    .catch(error => {
      return res.status(400).json({ error: 'Enter correct pin code' });
    });
});

module.exports = router;
