const express = require('express');
const router = express.Router();
const connection = require('../../modules/dbconect');

router.get('/:idrent', (req, res) => {
    const { idrent } = req.params;
    var query = 'SELECT * FROM rents WHERE idrents = ?';
    connection.query(query, [idrent], (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            console.log("err: " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json('Rent not found');
        }
    });
});

router.post('/', async (req, res) => {
    const { idrents, name, originalName, price, brand, description} = req.body;
    var query = 'UPDATE rents SET name = ?, price = ?, brand = ?, description = ? WHERE idrents = ?';
    connection.query(query, [name, price, brand, description, idrents], async (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.affectedRows > 0) {
            const resp = await fetch("http://localhost:4009/apieditimages", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, originalName })
            });
            if (resp.ok) {
                res.status(200).json("Rent updated successfully");
            }
        } else {
            res.status(404).json('Rent not found');
        }
    });
});

router.delete('/:idrent/:name', async (req, res) => {
    const { idrent, name } = req.params;
    var query = 'DELETE FROM rents WHERE idrents = ?';
    connection.query(query, [idrent], async (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.affectedRows > 0) {
            const url = "http://localhost:4009/apieditimages/" + name;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) {
                return res.status(500).json("Error");
            }else{
                res.status(200).json("Rent deleted successfully removed")
            }
        } else {
            res.status(404).json('Rent not found');
        }
    });
});

module.exports = router;
