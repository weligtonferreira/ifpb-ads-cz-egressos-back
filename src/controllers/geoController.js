const { query } = require('../config/database');

module.exports = {
    async getSvg(req, res) {
        const { city } = req.params;

        await query('SELECT ST_AsSVG(geom) FROM municipio WHERE nome ilike $1', [city]).then(async (response) => {
            if (response.rows[0]) {
                return res.status(200).json(response.rows[0].st_assvg);
            }
            return res.status(404).json(null);
        });
    },

    async getViewBox(req, res) {
        const { city } = req.params;

        await query('SELECT getViewBox($1)', [city]).then(async (response) => {
            if (response.rows[0].getviewbox) {
                return res.status(200).json(response.rows[0].getviewbox);
            }
            return res.status(404).json(null);
        });
    }
};