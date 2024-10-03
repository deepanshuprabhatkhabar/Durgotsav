let currentPage = 1;
let pagination = {};
let allVotes = [];
let startDate, endDate;
let criteriaChart, pandalChart;

flatpickr("#dateRange", {
    mode: "range",
    dateFormat: "Y-m-d",
    onChange: function(selectedDates) {
        if (selectedDates.length === 2) {
            startDate = selectedDates[0];
            endDate = selectedDates[1];
        }
    }
});

async function checkAdminStatus() {
    try {
        const response = await fetch('/api/users/check-admin', {
            headers: {
                'Authorization': `Bearer ${getCookie('jwtToken')}`
            }
        });
        const data = await response.json();
        if (data.isAdmin) {
            document.getElementById('adminContent').classList.remove('hidden');
            fetchVotes();
        } else {
            document.getElementById('accessDenied').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        document.getElementById('accessDenied').classList.remove('hidden');
    }
}

async function fetchVotes() {
    try {
        const nameFilter = document.getElementById('nameFilter').value;
        const mobileFilter = document.getElementById('mobileFilter').value;
        const criteriaFilter = document.getElementById('criteriaFilter').value;
        const pandalFilter = document.getElementById('pandalFilter').value;

        let url = `/api/votes?page=${currentPage}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        }
        if (nameFilter) url += `&name=${nameFilter}`;
        if (mobileFilter) url += `&mobileNumber=${mobileFilter}`;
        if (criteriaFilter) url += `&criteria=${criteriaFilter}`;
        if (pandalFilter) url += `&pandalName=${pandalFilter}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${getCookie('jwtToken')}`
            }
        });
        const data = await response.json();
        allVotes = data.votes;
        pagination = data.pagination;
        renderTable();
        updatePaginationInfo();
        updateVoteSummary(data.votesByCriteria, data.votesByPandal);
        updateFilters(data.votesByCriteria, data.votesByPandal);
    } catch (error) {
        console.error('Error fetching votes:', error);
        alert(`Failed to load votes: ${error.message}`);
        if (error.message.includes('Unauthorized')) {
            window.location.href = '/login';
        }
    }
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    allVotes.forEach(vote => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = vote.name;
        row.insertCell(1).textContent = vote.mobileNumber;
        row.insertCell(2).textContent = vote.criteria;
        row.insertCell(3).textContent = vote.pandalName;
        row.insertCell(4).textContent = new Date(vote.createdAt).toLocaleString();
    });

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === pagination.totalPages;
}

function updatePaginationInfo() {
    const paginationInfo = document.getElementById('paginationInfo');
    paginationInfo.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages} (Total items: ${pagination.totalItems})`;
}

function updateVoteSummary(votesByCriteria, votesByPandal) {
    if (criteriaChart) criteriaChart.destroy();

    const criteriaCtx = document.getElementById('criteriaChart').getContext('2d');

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Votes by Criteria'
        },
        legend: {
            position: 'right',
            labels: {
                boxWidth: 10,
                fontSize: 10
            }
        },
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 10,
                    fontSize: 10
                }
            }
        }
    };

    criteriaChart = new Chart(criteriaCtx, {
        type: 'pie',
        data: {
            labels: votesByCriteria.map(item => item.name),
            datasets: [{
                data: votesByCriteria.map(item => item.value),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ]
            }]
        },
        options: {...chartOptions, plugins: {...chartOptions.plugins, title: {display: true}}}
    });


    // Set a fixed size for the chart containers
    document.getElementById('criteriaChart').style.height = '180px';
}

function updateFilters(votesByCriteria, votesByPandal) {
    const criteriaFilter = document.getElementById('criteriaFilter');
    const pandalFilter = document.getElementById('pandalFilter');

    // Clear existing options
    criteriaFilter.innerHTML = '<option value="">All Criteria</option>';
    pandalFilter.innerHTML = '<option value="">All Pandals</option>';

    // Add new options
    votesByCriteria.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} (${item.value})`;
        criteriaFilter.appendChild(option);
    });

    votesByPandal.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} (${item.value})`;
        pandalFilter.appendChild(option);
    });
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchVotes();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < pagination.totalPages) {
        currentPage++;
        fetchVotes();
    }
});

document.getElementById('applyFilters').addEventListener('click', () => {
    currentPage = 1;
    fetchVotes();
});

document.getElementById('exportExcel').addEventListener('click', async () => {
    try {
        const nameFilter = document.getElementById('nameFilter').value;
        const mobileFilter = document.getElementById('mobileFilter').value;
        const criteriaFilter = document.getElementById('criteriaFilter').value;
        const pandalFilter = document.getElementById('pandalFilter').value;

        let url = '/api/votes/excel?';
        if (startDate && endDate) {
            url += `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&`;
        }
        if (nameFilter) url += `name=${nameFilter}&`;
        if (mobileFilter) url += `mobileNumber=${mobileFilter}&`;
        if (criteriaFilter) url += `criteria=${criteriaFilter}&`;
        if (pandalFilter) url += `pandalName=${pandalFilter}&`;

        // Remove the trailing '&' if it exists
        url = url.endsWith('&') ? url.slice(0, -1) : url;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getCookie('jwtToken')}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate Excel file');
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = downloadUrl;
        a.download = "durgotsav_votes.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error exporting Excel:', error);
        alert('Failed to export Excel file: ' + error.message);
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.getElementById('logoutButton').addEventListener('click', () => {
    document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
});

checkAdminStatus();
