const pool = require('../db');

const getCompanies = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const totalResult = await pool.query(`
            SELECT COUNT(*)
            FROM companies
        `);

        const totalData = parseInt(
            totalResult.rows[0].count
        );

        const totalPage = Math.ceil(
            totalData / limit
        );

        const result = await pool.query(`
            SELECT *
            FROM companies
            ORDER BY company_id DESC
            LIMIT $1
            OFFSET $2
        `, [limit, offset]);

        res.json({
            data: result.rows,
            pagination: {
                totalData,
                totalPage,
                currentPage: page,
                limit
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error mengambil companies'
        });
    }
};

const searchCompanies = async (req, res) => {

    try {

        const keyword = req.query.keyword || '';

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        const searchValue = `%${keyword}%`;

        const totalResult = await pool.query(`
            SELECT COUNT(*)
            FROM companies
            WHERE
                nama_perusahaan ILIKE $1
                OR nama_web_bpjph ILIKE $1
                OR nib ILIKE $1
        `, [searchValue]);

        const totalData = parseInt(
            totalResult.rows[0].count
        );

        const totalPage = Math.ceil(
            totalData / limit
        );

        const result = await pool.query(`
            SELECT *
            FROM companies
            WHERE
                nama_perusahaan ILIKE $1
                OR nama_web_bpjph ILIKE $1
                OR nib ILIKE $1
            ORDER BY company_id DESC
            LIMIT $2
            OFFSET $3
        `, [searchValue, limit, offset]);

        res.json({
            data: result.rows,
            pagination: {
                totalData,
                totalPage,
                currentPage: page,
                limit
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Search error'
        });
    }
};

const getCompanyDetail = async (req, res) => {

    try {

        const companyId = req.params.id;

        const companyResult = await pool.query(`
            SELECT *
            FROM companies
            WHERE company_id = $1
        `, [companyId]);

        const products = await pool.query(`
            SELECT *
            FROM products
            WHERE company_id = $1
        `, [companyId]);

        const facilities = await pool.query(`
            SELECT *
            FROM facilities
            WHERE company_id = $1
        `, [companyId]);

        const certificates = await pool.query(`
            SELECT *
            FROM halal_certificates
            WHERE company_id = $1
        `, [companyId]);

        const audits = await pool.query(`
            SELECT *
            FROM audits
            WHERE company_id = $1
        `, [companyId]);

        const services = await pool.query(`
            SELECT services.*
            FROM company_services

            JOIN services
                ON company_services.service_id = services.service_id

            WHERE company_services.company_id = $1
        `, [companyId]);

        res.json({

            company: companyResult.rows[0],

            products: products.rows,

            facilities: facilities.rows,

            certificates: certificates.rows,

            audits: audits.rows,

            services: services.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error mengambil detail company'
        });
    }
};

const searchAll = async (req, res) => {

    try {

        const keyword = req.query.keyword || '';

        const searchValue = `%${keyword}%`;

        const result = await pool.query(`

            SELECT DISTINCT

                companies.company_id,
                companies.nama_perusahaan,
                companies.alamat_perusahaan,
                companies.nib,
                companies.id_cerol_perusahaan,

                products.nama_produk,
                products.merek

            FROM companies

            LEFT JOIN products
                ON companies.company_id = products.company_id

            LEFT JOIN facilities
                ON companies.company_id = facilities.company_id

            LEFT JOIN halal_certificates
                ON companies.company_id = halal_certificates.company_id

            LEFT JOIN audits
                ON companies.company_id = audits.company_id

            LEFT JOIN company_services
                ON companies.company_id = company_services.company_id

            LEFT JOIN services
                ON company_services.service_id = services.service_id

            WHERE

                companies.nama_perusahaan ILIKE $1
                OR companies.alamat_perusahaan ILIKE $1
                OR companies.nib ILIKE $1
                OR companies.email ILIKE $1
                OR companies.telepon ILIKE $1
                OR companies.penanggung_jawab ILIKE $1
                OR companies.id_cerol_perusahaan ILIKE $1

                OR products.nama_produk ILIKE $1
                OR products.merek ILIKE $1
                OR products.jenis_produk ILIKE $1
                OR products.kelompok_produk ILIKE $1

                OR facilities.tipe_fasilitas ILIKE $1
                OR facilities.alamat_fasilitas ILIKE $1

                OR halal_certificates.no_sertifikat_halal ILIKE $1
                OR halal_certificates.no_ketetapan_halal ILIKE $1
                OR halal_certificates.no_daftar_sihalal ILIKE $1
                OR halal_certificates.no_reg_cerol ILIKE $1

                OR audits.auditor ILIKE $1

                OR services.jenis_layanan ILIKE $1

            ORDER BY companies.company_id DESC

            LIMIT 50

        `, [searchValue]);

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Search all error'
        });
    }
};

module.exports = {
    getCompanies,
    searchCompanies,
    getCompanyDetail,
    searchAll
};