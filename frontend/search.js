// Search functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Get the search form and input
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm.querySelector('input[name="query"]');
    
    if (!searchForm || !searchInput) {
        console.error('Search form or input not found');
        return;
    }
    
    // Function to filter products based on search query
    function filterProducts(query) {
        const productBoxes = document.querySelectorAll('.product-box');
        const searchQuery = query.toLowerCase().trim();
        
        let hasResults = false;
        
        productBoxes.forEach(box => {
            // Get product name from h5 element if data attributes are missing
            const name = box.getAttribute('data-name') || 
                        (box.querySelector('h5')?.textContent || '').toLowerCase();
            const category = box.getAttribute('data-category') || '';
            const description = box.getAttribute('data-description') || '';
            
            const searchableText = `${name} ${category} ${description}`.toLowerCase();
            
            if (searchableText.includes(searchQuery)) {
                box.style.display = 'block';
                hasResults = true;
            } else {
                box.style.display = 'none';
            }
        });
        
        // Show/hide "no results" message if needed
        const noResultsMsg = document.getElementById('no-results-message');
        if (!hasResults && searchQuery !== '') {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.id = 'no-results-message';
                msg.style.textAlign = 'center';
                msg.style.padding = '20px';
                msg.style.color = '#666';
                msg.textContent = 'No products found matching your search.';
                document.querySelector('#bestsellers').appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // Handle form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value;
        filterProducts(query);
    });
    
    // Real-time filtering as user types
    searchInput.addEventListener('input', function() {
        const query = this.value;
        filterProducts(query);
    });
}); 