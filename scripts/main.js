document.addEventListener("DOMContentLoaded", function() {
    Promise.all([
        fetch('content/content-header.json').then(response => response.json()),
        fetch('content/content-data.json').then(response => response.json()),
        fetch('content/content-tag.json').then(response => response.json()),
        fetch('content/content-author.json').then(response => response.json())
    ])
    .then(([headersData, contentData, tagsData, authorsData]) => {
        const sortedContent = sortContentByDate(contentData);

        renderHeaders(headersData);
        renderTagFilter(tagsData);
        renderContent(sortedContent, authorsData, tagsData);

        document.querySelectorAll('.tag-item').forEach(tagElement => {
            tagElement.addEventListener('click', function() {
                filterContentByTag(this.dataset.tag, sortedContent, authorsData, tagsData);
            });
        });

        // Add event listener for the "All" button
        document.getElementById('show-all').addEventListener('click', function() {
            renderContent(sortedContent, authorsData, tagsData);
        });
    })
    .catch(error => console.error('Error loading data:', error));
});

// Filter Content By Tag
function filterContentByTag(selectedTag, contentData, authorsData, tagsData) {
    if (selectedTag === 'all') {
        renderContent(contentData, authorsData, tagsData);
        return;
    }

    const filteredContent = contentData.filter(content => {
        const contentTags = content.data.tags.map(tag => tag.toLowerCase());
        return contentTags.includes(selectedTag);
    });

    renderContent(filteredContent, authorsData, tagsData);
}

// Sort Content By Date
function sortContentByDate(contentData) {
    return contentData.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}

// Map Tags
function mapTags(tags, tagsData) {
    const sortedTagsData = tagsData.sort((a, b) => a.id.localeCompare(b.id));
    
    return tags.map(tag => {
        const item = document.createElement('span');
        const i = sortedTagsData.find(i => i.data.name.toLowerCase() === tag.toLowerCase()) || {};

        item.className = 'tag';
        item.textContent = i.data?.name || tag;

        return item.outerHTML;
    }).join(':');
}

// Map and Sort Tags by id
// function mapTags(tags, tagsData) {
//     const sortedTagsData = tagsData.sort((a, b) => a.id.localeCompare(b.id));

//     return tags.map(tag => {
//         const item = document.createElement('span');
//         const i = sortedTagsData.find(i => i.data.name.toLowerCase() === tag.toLowerCase()) || {};

//         item.className = 'tag';
//         item.textContent = i.data?.name || tag;

//         return item.outerHTML;
//     }).join(', ');
// }

// Map Authors
function mapAuthors(authors, authorsData) {
    return authors.map(author => {
        const item = document.createElement('a');
        const i = authorsData.find(i => i.data.name.toLowerCase() === author.toLowerCase()) || {};

        item.className = 'author';
        item.href = i.data?.url || '#';
        item.textContent = i.data?.name || author;

        return item.outerHTML;
    }).join(', ');
}

// Render Headers
function renderHeaders(headersData) {
    const table = document.querySelector('#content-table');
    const thead = table.querySelector('thead');
    const items = document.createElement('tr');

    headersData.forEach(header => {
        const item = document.createElement('th');
        const data = header.data;

        item.id = `content-header-${header.id}`;
        item.textContent = data.name;

        items.appendChild(item);
    });

    thead.appendChild(items);
}

// Render Tag Filter
function renderTagFilter(tagsData) {
    const tagContainer = document.getElementById('tag-container');
    tagContainer.innerHTML = '';

    // Add "All" button
    const allButton = document.createElement('span');
    allButton.id = 'show-all';
    allButton.className = 'tag-item';
    allButton.textContent = 'All';
    tagContainer.appendChild(allButton);

    tagsData.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item';
        tagElement.dataset.tag = tag.data.name.toLowerCase();
        tagElement.textContent = tag.data.name;

        tagContainer.appendChild(tagElement);
    });
}

// Render Content
function renderContent(contentData, authorsData, tagsData) {
    const table = document.querySelector('#content-table tbody');
    table.innerHTML = ''; // Clear existing content

    contentData.forEach(content => {
        const postData = content.data;
        const tags = mapTags(postData.tags, tagsData);
        const authors = mapAuthors(postData.authors, authorsData);
        const item = document.createElement('tr');

        item.innerHTML = `
            <td>${postData.date}</td>
            <td><a href="${postData.url || '#'}">${postData.title}</a></td>
            <td>${tags}</td>
            <td>${authors}</td>
        `;

        table.appendChild(item);
    });
}
