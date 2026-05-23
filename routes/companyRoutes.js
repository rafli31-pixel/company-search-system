const express = require('express');

const router = express.Router();

const {
    getCompanies,
    searchCompanies,
    getCompanyDetail,
    searchAll
} = require('../controllers/companyController');

router.get('/companies', getCompanies);

router.get('/search', searchCompanies);

router.get('/companies/:id', getCompanyDetail);

router.get('/search-all', searchAll);

module.exports = router;