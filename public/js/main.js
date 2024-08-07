document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-container input');
    const notesContainer = document.getElementById('notesContainer');
    const showAllButton = document.getElementById('showAllButton');
    const categoryButtons = document.querySelectorAll('.category-filter');
    const noteCards = document.querySelectorAll('.note-card');

    function showAllNotes() {
        noteCards.forEach(card => card.style.display = '');
        categoryButtons.forEach(button => button.classList.remove('active'));
        showAllButton.classList.add('active');
    }

    showAllButton.addEventListener('click', showAllNotes);

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            noteCards.forEach(card => {
                if (card.getAttribute('data-category') === category) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            showAllButton.classList.remove('active');
        });
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let hasVisibleNotes = false;

        noteCards.forEach(card => {
            const category = card.getAttribute('data-category').toLowerCase();
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const content = card.querySelector('.card-text').textContent.toLowerCase();

            if (category.includes(searchTerm) || title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = '';
                hasVisibleNotes = true;
            } else {
                card.style.display = 'none';
            }
        });

        categoryButtons.forEach(button => {
            const categoryName = button.textContent.toLowerCase();
            if (categoryName.includes(searchTerm)) {
                button.style.display = '';
            } else {
                button.style.display = 'none';
            }
        });

        if (!hasVisibleNotes) {
            notesContainer.innerHTML = '<p>No se encontraron notas que coincidan con la búsqueda.</p>';
        }

        if (searchTerm === '') {
            showAllNotes();
        }
    });

    showAllNotes();
});