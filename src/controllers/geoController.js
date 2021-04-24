const { query } = require('../config/database');

module.exports = {
    async getSvg(req, res) {
        const { city } = req.params;

        await query('SELECT ST_AsSVG(geom) FROM municipio WHERE nome ilike $1', [city]).then(async (response) => {
            return res.status(200).json(response.rows[0]);
        });
    },

    async getViewBox(req, res) {
        const { city } = req.params;

        await query('SELECT getViewBox($1)', [city]).then(async (response) => {
            return res.status(200).json(response.rows[0]);
        });
    }
};