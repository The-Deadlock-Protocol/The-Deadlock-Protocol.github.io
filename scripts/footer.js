document.addEventListener("DOMContentLoaded", function() {
    fetch('content/footer.json')
        .then(response => response.json())
        .then(footerData => {
            const footer = document.querySelector('footer');
            const title = document.createElement('h3');
            title.className = 'footer-title';
            title.textContent = footerData.title;
            footer.appendChild(title);

            const description = document.createElement('span');
            description.className = 'footer-description';
            description.textContent = footerData.description;
            footer.appendChild(description);
        })
        .catch(error => console.error('Error loading footer data:', error));
});
