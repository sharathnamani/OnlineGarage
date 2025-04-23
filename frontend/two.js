    // JavaScript to filter the items based on input
        const searchInput = document.getElementById('search-bar');
        const productBoxes = document.querySelectorAll('.product-box');

        // Function to filter and update visibility of the product boxes
        function filterItems(input) {
            const searchQuery = input.toLowerCase();

            // Loop through all product boxes and filter based on category or name
            productBoxes.forEach(box => {
                const category = box.getAttribute('data-category').toLowerCase();
                const name = box.getAttribute('data-name').toLowerCase();

                // If category or name contains the search query, show the item, else hide it
                if (category.includes(searchQuery) || name.includes(searchQuery)) {
                    box.style.display = 'block'; // Show the item
                } else {
                    box.style.display = 'none'; // Hide the item
                }
            });
        }

        // Event listener for search input to trigger filtering
        searchInput.addEventListener('input', (event) => {
            const userInput = event.target.value;
            filterItems(userInput);
        });

        // Optional: Initial filter to show all items when page loads
        filterItems('');
