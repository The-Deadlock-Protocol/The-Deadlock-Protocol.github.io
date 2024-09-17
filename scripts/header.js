document.addEventListener("DOMContentLoaded", function() {
    fetch('content/header.json')
        .then(response => response.json())
        .then(headerData => {
            const header = document.querySelector('header');

            const title = document.createElement('h1');
            title.className = 'header-title';
            title.textContent = headerData.title;
            header.appendChild(title);

            const description = document.createElement('div');
            description.className = 'header-description';
            description.textContent = headerData.description;
            header.appendChild(description);

            // Create and append the footer items
            const items = document.createElement('div');
            items.className = 'header-items';

            headerData.data.forEach(itemData => {
                const item = document.createElement('span');
                item.className = 'content-header'

                const link = document.createElement('a');
                const data = itemData.data;

                link.className = `content-header-${itemData.id}`;
                link.href = data.url || '#';
                link.textContent = data.name || '';

                item.appendChild(link);
                items.appendChild(item);
            });

            header.appendChild(items);
        })
        .catch(error => console.error('Error loading header data:', error));
});
