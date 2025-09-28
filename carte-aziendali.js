document.addEventListener('DOMContentLoaded', function() {
    // Initialize spending chart
    initializeSpendingChart();
    // Modal functionality
    const createCardBtn = document.getElementById('createCardBtn');
    const createCardModal = document.getElementById('createCardModal');
    const modalClose = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelBtn');
    const createCardForm = document.getElementById('createCardForm');

    // Search and filter functionality
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const exportBtn = document.getElementById('exportBtn');

    // Card items
    const cardItems = document.querySelectorAll('.card-item');

    // Open modal
    createCardBtn.addEventListener('click', function() {
        createCardModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close modal functions
    function closeModal() {
        createCardModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        createCardForm.reset();
    }

    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    createCardModal.addEventListener('click', function(e) {
        if (e.target === createCardModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && createCardModal.classList.contains('show')) {
            closeModal();
        }
    });

    // Form submission
    createCardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(createCardForm);
        const employeeName = document.getElementById('employeeName').value;
        const department = document.getElementById('employeeDepartment').value;
        const monthlyLimit = document.getElementById('monthlyLimit').value;
        const cardType = document.getElementById('cardType').value;
        const expiryDate = document.getElementById('expiryDate').value;

        // Simulate card creation
        console.log('Creating new card:', {
            name: employeeName,
            department: department,
            limit: monthlyLimit,
            type: cardType,
            expiry: expiryDate
        });

        // Show success message (you could implement a toast notification here)
        alert(`Carta creata con successo per ${employeeName}!`);
        
        closeModal();
        
        // In a real application, you would send this data to your backend
        // and refresh the cards list
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterCards();
    });

    // Filter functionality
    statusFilter.addEventListener('change', filterCards);
    departmentFilter.addEventListener('change', filterCards);

    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedDepartment = departmentFilter.value;

        cardItems.forEach(card => {
            const employeeName = card.querySelector('h3').textContent.toLowerCase();
            const cardNumber = card.querySelector('.card-number').textContent.toLowerCase();
            const cardStatus = card.dataset.status;
            const cardDepartment = card.dataset.department;

            const matchesSearch = employeeName.includes(searchTerm) || cardNumber.includes(searchTerm);
            const matchesStatus = !selectedStatus || cardStatus === selectedStatus;
            const matchesDepartment = !selectedDepartment || cardDepartment === selectedDepartment;

            if (matchesSearch && matchesStatus && matchesDepartment) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Update results count
        const visibleCards = Array.from(cardItems).filter(card => card.style.display !== 'none').length;
        updateResultsCount(visibleCards);
    }

    function updateResultsCount(count) {
        // You could add a results counter here
        console.log(`Showing ${count} cards`);
    }

    // Card action buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-action')) {
            const button = e.target.closest('.btn-action');
            const card = button.closest('.card-item');
            const employeeName = card.querySelector('h3').textContent;
            const action = button.title;

            handleCardAction(action, employeeName, card);
        }
    });

    function handleCardAction(action, employeeName, cardElement) {
        switch (action) {
            case 'Visualizza dettagli':
                showCardDetails(employeeName);
                break;
            case 'Modifica limiti':
                showEditLimits(employeeName);
                break;
            case 'Sospendi carta':
                suspendCard(employeeName, cardElement);
                break;
            case 'Riattiva carta':
                reactivateCard(employeeName, cardElement);
                break;
            case 'Blocca carta':
                blockCard(employeeName, cardElement);
                break;
        }
    }

    function showCardDetails(employeeName) {
        alert(`Visualizzazione dettagli per la carta di ${employeeName}`);
        // In a real application, this would open a detailed view modal
    }

    function showEditLimits(employeeName) {
        const newLimit = prompt(`Inserisci il nuovo limite mensile per ${employeeName}:`);
        if (newLimit && !isNaN(newLimit) && newLimit > 0) {
            alert(`Limite aggiornato a €${newLimit} per ${employeeName}`);
            // Update the UI and send to backend
        }
    }

    function suspendCard(employeeName, cardElement) {
        if (confirm(`Sei sicuro di voler sospendere la carta di ${employeeName}?`)) {
            // Update card status
            const statusElement = cardElement.querySelector('.card-status');
            statusElement.className = 'card-status suspended';
            statusElement.innerHTML = '<span class="status-dot"></span>Sospesa';
            
            // Update card visual
            const virtualCard = cardElement.querySelector('.virtual-card');
            virtualCard.classList.add('suspended');
            
            // Add suspended overlay if not exists
            if (!virtualCard.querySelector('.suspended-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'suspended-overlay';
                overlay.innerHTML = '<i class="fas fa-pause-circle"></i>SOSPESA';
                virtualCard.appendChild(overlay);
            }
            
            // Update dataset
            cardElement.dataset.status = 'suspended';
            
            alert(`Carta di ${employeeName} sospesa con successo`);
        }
    }

    function reactivateCard(employeeName, cardElement) {
        if (confirm(`Sei sicuro di voler riattivare la carta di ${employeeName}?`)) {
            // Update card status
            const statusElement = cardElement.querySelector('.card-status');
            statusElement.className = 'card-status active';
            statusElement.innerHTML = '<span class="status-dot"></span>Attiva';
            
            // Update card visual
            const virtualCard = cardElement.querySelector('.virtual-card');
            virtualCard.classList.remove('suspended');
            
            // Remove suspended overlay
            const overlay = virtualCard.querySelector('.suspended-overlay');
            if (overlay) {
                overlay.remove();
            }
            
            // Update dataset
            cardElement.dataset.status = 'active';
            
            alert(`Carta di ${employeeName} riattivata con successo`);
        }
    }

    function blockCard(employeeName, cardElement) {
        if (confirm(`ATTENZIONE: Sei sicuro di voler bloccare definitivamente la carta di ${employeeName}? Questa azione non può essere annullata.`)) {
            // In a real application, you would send this to the backend
            // and remove the card from the UI or mark it as blocked
            cardElement.style.opacity = '0.5';
            cardElement.style.pointerEvents = 'none';
            
            alert(`Carta di ${employeeName} bloccata definitivamente`);
        }
    }

    // Export functionality
    exportBtn.addEventListener('click', function() {
        // Simulate export
        const visibleCards = Array.from(cardItems).filter(card => card.style.display !== 'none');
        const exportData = visibleCards.map(card => {
            return {
                nome: card.querySelector('h3').textContent,
                reparto: card.querySelector('.department').textContent,
                numero: card.querySelector('.card-number').textContent,
                stato: card.querySelector('.card-status').textContent.trim(),
                limite: card.querySelector('.card-stats .value').textContent
            };
        });
        
        console.log('Export data:', exportData);
        alert(`Esportazione di ${exportData.length} carte completata!`);
        
        // In a real application, you would generate and download a CSV/Excel file
    });

    // Add hover effects to cards
    cardItems.forEach(card => {
        const virtualCard = card.querySelector('.virtual-card');
        
        card.addEventListener('mouseenter', function() {
            virtualCard.style.transform = 'rotateY(-5deg) rotateX(5deg) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            virtualCard.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
        });
    });

    // Simulate real-time updates
    function simulateRealTimeUpdates() {
        // This would typically be done via WebSocket or polling in a real application
        setInterval(() => {
            // Randomly update "last transaction" times
            const timeElements = document.querySelectorAll('.card-stats .stat:last-child .value');
            const timeOptions = ['Ora', '2 ore fa', '5 ore fa', '1 giorno fa', '2 giorni fa'];
            
            timeElements.forEach(element => {
                if (Math.random() < 0.1) { // 10% chance to update
                    const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];
                    element.textContent = randomTime;
                }
            });
        }, 30000); // Update every 30 seconds
    }

    // Start real-time updates simulation
    simulateRealTimeUpdates();

    // Add CSS animation for fade in
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .card-item {
            animation: fadeIn 0.5s ease forwards;
        }
        
        .virtual-card {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Initialize tooltips for action buttons
    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // You could implement custom tooltips here
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add loading states for actions
    function showLoading(element) {
        const originalContent = element.innerHTML;
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        element.disabled = true;
        
        setTimeout(() => {
            element.innerHTML = originalContent;
            element.disabled = false;
        }, 1000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Ctrl/Cmd + N to create new card
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            createCardBtn.click();
        }
    });

    console.log('Carte Aziendali page loaded successfully');
});
