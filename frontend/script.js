const searchButton = document.getElementById(
    'searchButton'
);

const searchInput = document.getElementById(
    'searchInput'
);

const tableBody = document.getElementById(
    'tableBody'
);

const detailModal = document.getElementById(
    'detailModal'
);

const detailContent = document.getElementById(
    'detailContent'
);

const hiddenFields = [

    'created_at',
    'updated_at',

    'company_id',
    'product_id',
    'facility_id',
    'certificate_id',
    'audit_id',
    'service_id',
    'id',

    'merek'
];

const formatLabel = (text) => {

    return text

        .replaceAll('_', ' ')

        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};

const renderTable = (data) => {

    tableBody.innerHTML = '';

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>

                <td colspan="3">
                    Data tidak ditemukan
                </td>

            </tr>
        `;

        return;
    }

    data.forEach((item) => {

        tableBody.innerHTML += `

            <tr>

                <td>
                    ${item.nama_perusahaan || '-'}
                </td>

                <td>
                    ${item.nama_produk || '-'}
                </td>

                <td>

                    <button
                        class="detail-button"
                        onclick="showDetail(${item.company_id})">

                        Detail

                    </button>

                </td>

            </tr>
        `;
    });
};

const searchData = async () => {

    try {

        const keyword = searchInput.value;

        if (!keyword) {

            alert('Masukkan keyword');

            return;
        }

        const response = await fetch(
            `http://localhost:3000/search-all?keyword=${keyword}`
        );

        const data = await response.json();

        renderTable(data);

    } catch (error) {

        console.log(error);

        alert('Search gagal');
    }
};

const createCards = (items) => {

    if (!items || items.length === 0) {

        return `
            <p>Tidak ada data</p>
        `;
    }

    return items.map((item) => {

        let html = `
            <div class="card">
        `;

        for (const key in item) {

            if (hiddenFields.includes(key)) {
                continue;
            }

            html += `

                <div class="detail-row">

                    <div class="detail-label">

                        ${formatLabel(key)}

                    </div>

                    <div class="detail-value">

                        ${item[key] ?? '-'}

                    </div>

                </div>
            `;
        }

        html += `
            </div>
        `;

        return html;

    }).join('');
};

const createCompanyInfo = (company) => {

    let html = `
        <div class="card">
    `;

    for (const key in company) {

        if (hiddenFields.includes(key)) {
            continue;
        }

        html += `

            <div class="detail-row">

                <div class="detail-label">

                    ${formatLabel(key)}

                </div>

                <div class="detail-value">

                    ${company[key] ?? '-'}

                </div>

            </div>
        `;
    }

    html += `
        </div>
    `;

    return html;
};

const showDetail = async (companyId) => {

    try {

        const response = await fetch(
            `http://localhost:3000/companies/${companyId}`
        );

        const data = await response.json();

        detailContent.innerHTML = `

            <div class="section">

                <h2>
                    Company Information
                </h2>

                ${createCompanyInfo(data.company)}

            </div>

            <div class="section">

                <h3>
                    Products
                </h3>

                ${createCards(data.products)}

            </div>

            <div class="section">

                <h3>
                    Facilities
                </h3>

                ${createCards(data.facilities)}

            </div>

            <div class="section">

                <h3>
                    Certificates
                </h3>

                ${createCards(data.certificates)}

            </div>

            <div class="section">

                <h3>
                    Audits
                </h3>

                ${createCards(data.audits)}

            </div>

            <div class="section">

                <h3>
                    Services
                </h3>

                ${createCards(data.services)}

            </div>
        `;

        detailModal.style.display = 'block';

    } catch (error) {

        console.log(error);

        alert('Gagal mengambil detail company');
    }
};

const closeModal = () => {

    detailModal.style.display = 'none';
};

window.onclick = (event) => {

    if (event.target === detailModal) {

        closeModal();
    }
};

searchButton.addEventListener(
    'click',
    searchData
);

searchInput.addEventListener(
    'keypress',
    (event) => {

        if (event.key === 'Enter') {

            searchData();
        }
    }
);