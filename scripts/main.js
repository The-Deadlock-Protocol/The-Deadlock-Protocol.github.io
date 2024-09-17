document.addEventListener("DOMContentLoaded", function() {
    let allContentData = [];
    
    Promise.all([
        fetch('content/content-header.json').then(response => response.json()),
        fetch('content/content-data.json').then(response => response.json()),
        fetch('content/content-tag.json').then(response => response.json()),
        fetch('content/content-author.json').then(response => response.json())
    ])
    .then(([headersData, contentData, tagsData, authorsData]) => {
        allContentData = sortContentByDate(contentData);

        renderTagFilter(tagsData);
        renderContent(allContentData, authorsData, tagsData);

        // Add event listener for tag filtering
        document.querySelectorAll('.tag-filter').forEach(tagElement => {
            tagElement.addEventListener('click', function() {
                filterContentByTag(this.dataset.tag, contentData, authorsData, tagsData);
            });
        });

        // Add event listener for title search
        document.getElementById('search-input').addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const filteredContent = allContentData.filter(content => 
                content.data.title.toLowerCase().includes(query)
            );
            renderContent(filteredContent, authorsData, tagsData);
        });
    })
    .catch(error => console.error('Error loading data:', error));
});

// Search filter is integrated into the main event listener for the input field.

// Sort Content By Date
function sortContentByDate(contentData) {
    return contentData.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}

// Rest of the helper functions (mapTags, mapAuthors, renderTagFilter, renderContent, etc.)
