// Semantic Scholar API configuration
const SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1';
const AUTHOR_ID = '144123456'; // Replace with your Semantic Scholar author ID

// Publication data mapping
const publicationMapping = {
    "Using Physiological Measurements to Analyze the Tactical Decisions in Human Swarm Teams": {
        paperId: "10.1109/SMC42975.2020.9283508",
        fallbackCitations: 12
    },
    "Learning Robot Swarm Tactics over Complex Adversarial Environments": {
        paperId: "10.1109/MRS50823.2021.9620523",
        fallbackCitations: 8
    },
    "Interactive Shape Control of Swarm of Mobile Robots using Geographic Information System (GIS) based Shape Model": {
        paperId: null, // Thesis might not be indexed
        fallbackCitations: 3
    }
};

// Function to fetch citation data from Semantic Scholar
async function fetchCitationData() {
    try {
        // Show loading state
        showLoadingState();

        // Fetch author data
        const authorResponse = await fetch(`${SEMANTIC_SCHOLAR_API}/author/${AUTHOR_ID}?fields=name,citationCount,paperCount`);
        const authorData = await authorResponse.json();

        // Update total citations
        document.getElementById('total-citations').textContent = authorData.citationCount || 'N/A';

        // Fetch individual paper data
        const paperPromises = Object.entries(publicationMapping).map(async ([title, data]) => {
            if (data.paperId) {
                try {
                    const paperResponse = await fetch(`${SEMANTIC_SCHOLAR_API}/paper/${data.paperId}?fields=citationCount`);
                    const paperData = await paperResponse.json();
                    return { title, citations: paperData.citationCount };
                } catch (error) {
                    console.error(`Error fetching data for paper ${title}:`, error);
                    return { title, citations: data.fallbackCitations };
                }
            }
            return { title, citations: data.fallbackCitations };
        });

        const paperResults = await Promise.all(paperPromises);

        // Update individual paper citations
        updatePaperCitations(paperResults);

    } catch (error) {
        console.error('Error fetching citation data:', error);
        // Fallback to static data if API fails
        fallbackToStaticData();
    }
}

// Function to show loading state
function showLoadingState() {
    const loadingElements = document.querySelectorAll('.stat-number, .citation-count');
    loadingElements.forEach(element => {
        element.textContent = 'Loading...';
    });
}

// Function to update paper citations
function updatePaperCitations(paperResults) {
    const citationElements = document.querySelectorAll('.publication-item');
    
    citationElements.forEach(element => {
        const title = element.querySelector('h3').textContent;
        const citationCount = element.querySelector('.citation-count');
        const paperData = paperResults.find(p => p.title === title);
        
        if (paperData && citationCount) {
            citationCount.textContent = paperData.citations;
        }
    });
}

// Function to fallback to static data
function fallbackToStaticData() {
    const staticData = {
        totalCitations: 23,
        papers: [
            { title: "Using Physiological Measurements to Analyze the Tactical Decisions in Human Swarm Teams", citations: 12 },
            { title: "Learning Robot Swarm Tactics over Complex Adversarial Environments", citations: 8 },
            { title: "Interactive Shape Control of Swarm of Mobile Robots using Geographic Information System (GIS) based Shape Model", citations: 3 }
        ]
    };

    document.getElementById('total-citations').textContent = staticData.totalCitations;
    
    const citationElements = document.querySelectorAll('.publication-item');
    citationElements.forEach(element => {
        const title = element.querySelector('h3').textContent;
        const citationCount = element.querySelector('.citation-count');
        const paperData = staticData.papers.find(p => p.title === title);
        
        if (paperData && citationCount) {
            citationCount.textContent = paperData.citations;
        }
    });
}

// Function to handle API errors gracefully
function handleApiError(error) {
    console.error('API Error:', error);
    fallbackToStaticData();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCitationData().catch(handleApiError);
}); 