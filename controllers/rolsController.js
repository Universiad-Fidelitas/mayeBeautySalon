const { response } = require('express');
const dbService = require('../database/dbService');
const helper = require('../helpers/dbHelpers');

const getById = async (req, res = response) => {
    const { rol_id } = req.params;
    try {
        const rows = await dbService.query(`SELECT * FROM rols WHERE rol_id=${ rol_id }`);
        const data = helper.emptyOrRows(rows);
        res.json(data);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const getRols = async (req, res = response) => {
    const { pageIndex, pageSize, term, sortBy } = req.body;
    try {
        // Calculate the offset based on pageIndex and pageSize
        const offset = pageIndex * pageSize;

        // Build the base query
        let baseQuery = 'SELECT * FROM rols';

        // Build the query based on the search term
        if (term) {
            baseQuery += ` WHERE name LIKE '%${term}%'`; // Replace column_name with the actual column name for searching
        }

        // Initialize an array to store individual ORDER BY clauses
        const orderByClauses = [];

        // Construct the ORDER BY clauses from the sortBy array
        if (Array.isArray(sortBy)) {
            for (const sortItem of sortBy) {
                const { id, desc } = sortItem;
                if (id) {
                    orderByClauses.push(`${id} ${desc ? 'DESC' : 'ASC'}`);
                }
            }
        }

        // Add ORDER BY clauses to the query
        if (orderByClauses.length > 0) {
            baseQuery += ` ORDER BY ${orderByClauses.join(', ')}`;
        }

        // Construct the full query with pagination
        const query = `${baseQuery} LIMIT ${pageSize} OFFSET ${offset}`;

        // Query the database with the constructed query for pagination, search, and sorting
        const rows = await dbService.query(query);

        // Calculate the total row count based on the filtered result set
        const totalRowCountResult = await dbService.query(`SELECT COUNT(*) AS count FROM (${baseQuery}) AS filtered_rols`);
        const totalRowCount = totalRowCountResult[0].count;

        // Calculate the pageCount based on the totalRowCount and pageSize
        const pageCount = Math.ceil(totalRowCount / pageSize);

        // Create the pagination response
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

const postRols = async (req, res = response) => {
    const { name } = req.body;
    try {
        const rows = await dbService.query(`INSERT INTO rols (name) VALUES ("${ name }")`);
        const { insertId } = helper.emptyOrRows(rows);

        res.status(200).json({
            insertId,
            msg: "Rol Added Succesfully"
        })
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const putRols = async (req, res = response) => {
    const { rol_id } = req.params;
    const { name } = req.body;

    try {
        const rows = await dbService.query(`UPDATE rols SET name="${ name }" WHERE rol_id=${ rol_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            msg: "Rol Edited Succesfully"
        })
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

const deleteRols = async (req, res = response) => {
    const { rol_id } = req.params;
    try {
        const rows = await dbService.query(`DELETE FROM rols WHERE rol_id=${ rol_id }`);
        const { affectedRows } = helper.emptyOrRows(rows);
        res.status(200).json({
            affectedRows,
            msg: "Rol Deleted Succesfully"
        })
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    getRols,
    postRols,
    putRols,
    deleteRols,
    getById
}