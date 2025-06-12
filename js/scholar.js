// Function to fetch Google Scholar data
async function fetchScholarData() {
    try {
        // Replace with your actual Google Scholar ID
        const scholarId = 'YOUR_SCHOLAR_ID';
        const response = await fetch(`https://scholar.google.com/citations?user=${scholarId}&hl=en&view_op=list_works&sortby=pubdate`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch Google Scholar data');
        }

        const data = await response.json();
        updateScholarStats(data);
    } catch (error) {
        console.error('Error fetching Google Scholar data:', error);
        // Fallback to static data if fetch fails
        updateScholarStats({
            citations: 'N/A',
            hIndex: 'N/A'
        });
    }
}

// Function to update the statistics display
function updateScholarStats(data) {
    const citationsElement = document.querySelector('.stat-item:nth-child(1) .stat-number');
    const hIndexElement = document.querySelector('.stat-item:nth-child(3) .stat-number');

    if (citationsElement) {
        citationsElement.textContent = data.citations || 'N/A';
    }
    if (hIndexElement) {
        hIndexElement.textContent = data.hIndex || 'N/A';
    }
}

// Function to handle citation button clicks
function handleCitationClick(event) {
    event.preventDefault();
    const paperTitle = event.target.closest('.publication-item').querySelector('h3').textContent;
    
    // Track the citation click in Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'citation_click', {
            'event_category': 'Publications',
            'event_label': paperTitle
        });
    }

    // You can add additional functionality here, such as showing a citation modal
    showCitationModal(paperTitle);
}

// Function to show citation modal
function showCitationModal(paperTitle) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'citation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>Citation for: ${paperTitle}</h3>
            <div class="citation-formats">
                <div class="format">
                    <h4>APA</h4>
                    <p>Loading...</p>
                </div>
                <div class="format">
                    <h4>BibTeX</h4>
                    <p>Loading...</p>
                </div>
                <div class="format">
                    <h4>MLA</h4>
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.appendChild(modal);

    // Add event listener for close button
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.remove();
    };

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fetch Google Scholar data
    fetchScholarData();

    // Add click handlers for citation buttons
    document.querySelectorAll('.btn[href="#"]').forEach(btn => {
        btn.addEventListener('click', handleCitationClick);
    });
}); 