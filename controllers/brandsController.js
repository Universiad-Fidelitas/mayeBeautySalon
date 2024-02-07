const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { brand_id } = req.params;
    try {
        const [brandFound] = await dbService.query('SELECT * FROM brands WHERE activated = 1 AND brand_id = ?', [brand_id]);
        console.log(brandFound)
        res.status(500).json({brandFound, status: true, message: 'Se ha encontrado la marca exitosamente.' });
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getBrands = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        const offset = pageIndex * pageSize;

        let baseQuery = 'select brand_id, name from brands where activated = 1';
        if (term) {
            baseQuery += ` AND name LIKE '%${term}%'`;
        }
        const orderByClauses = [];

        if (Array.isArray(sortBy)) {
            for (const sortItem of sortBy) {
                const { id, desc } = sortItem;
                if (id) {
                    orderByClauses.push(`${id} ${desc ? 'DESC' : 'ASC'}`);
                }
            }
        }

        if (orderByClauses.length > 0) {
            baseQuery += ` ORDER BY ${orderByClauses.join(', ')}`;
        }
        const query = `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`;
        const rows = await dbService.query(query);
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_brands`);
        const totalRowCount = totalRowCountResult[0].count;

        const pageCount = Math.ceil(totalRowCount / pageSize);

        const response = {
            pageSize,
            pageIndex,
            pageCount,
            items: rows,
            rowCount: totalRowCount,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const postBrand = async (req, res = response) => {
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_brand('create', '0', ?);`;
        const { insertId } = await dbService.query(userQuery, [name]);

                res.status(200).json({
                    brand_id: insertId,
                    success: true,
                    message: "¡La marca ha sido agregada exitosamente!"
                })

    }
    catch({ message }) {
        res.status(200).json({
            success: false,
            message: "¡No es posible agregar la marca!",
            error: message
        })
    }
}


const putBrand = async (req, res = response) => {
    const { brand_id } = req.params;
    const { name } = req.body;
    try {
        const userQuery = `CALL sp_brand('update', ?, ?);`;
        const { insertId } = await dbService.query(userQuery, [brand_id, name ]);
        res.status(200).json({
            brand_id: insertId,
            success: true,
            message: "¡La marca ha sido editada exitosamente!"
        })
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al editar la marca!",
            error: error
        })
    }
}

const deleteBrand = async (req, res = response) => {
    const { brand_id } = req.body;
    try {
        const userQuery = `CALL sp_brand('delete', ?, '');`;
        const rows = await dbService.query(userQuery, [brand_id]);
        const { affectedRows } = helper.emptyOrRows(rows);
        if( affectedRows === 1 ) {
            res.status(200).json({
                success: true,
                message: "¡La marca ha sido eliminado exitosamente!"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "¡Las marcas han sido eliminados exitosamente!"
            });
        }
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "¡Se ha producido un error al ejecutar la acción.!"
        })
    }
};

module.exports = {
    getBrands,
    postBrand,
    putBrand,
    deleteBrand,
    getById
}