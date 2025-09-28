document.addEventListener('DOMContentLoaded', function() {
    // Initialize spending chart
    initializeSpendingChart();
    
    // Initialize popup system
    initializePopupSystem();
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

        // Show success message
        showPopup('success', 'Carta Creata', `Carta creata con successo per ${employeeName}!`);
        
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
                showEditLimits(employeeName, cardElement);
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
        showPopup('info', 'Dettagli Carta', `Visualizzazione dettagli per la carta di ${employeeName}`, false);
        // In a real application, this would open a detailed view modal
    }

    function showEditLimits(employeeName, cardElement) {
        openLimitModal(employeeName, cardElement);
    }

    function suspendCard(employeeName, cardElement) {
        showConfirmPopup(
            'warning',
            'Sospendi Carta',
            `Sei sicuro di voler sospendere la carta di ${employeeName}?`,
            () => {
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
                
                showPopup('success', 'Carta Sospesa', `Carta di ${employeeName} sospesa con successo`);
            }
        );
    }

    function reactivateCard(employeeName, cardElement) {
        showConfirmPopup(
            'success',
            'Riattiva Carta',
            `Sei sicuro di voler riattivare la carta di ${employeeName}?`,
            () => {
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
                
                showPopup('success', 'Carta Riattivata', `Carta di ${employeeName} riattivata con successo`);
            }
        );
    }

    function blockCard(employeeName, cardElement) {
        showConfirmPopup(
            'error',
            'Blocca Carta',
            `ATTENZIONE: Sei sicuro di voler bloccare definitivamente la carta di ${employeeName}? Questa azione non può essere annullata.`,
            () => {
                // In a real application, you would send this to the backend
                // and remove the card from the UI or mark it as blocked
                cardElement.style.opacity = '0.5';
                cardElement.style.pointerEvents = 'none';
                
                showPopup('error', 'Carta Bloccata', `Carta di ${employeeName} bloccata definitivamente`);
            }
        );
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
        showPopup('success', 'Esportazione Completata', `Esportazione di ${exportData.length} carte completata con successo!`);
        
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

// Initialize spending chart
function initializeSpendingChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    // Data for the chart
    const totalSpending = 24567;
    const totalLimit = 150000;
    const remainingAllowance = totalLimit - totalSpending;
    
    const spendingData = {
        labels: ['Budget Mensile'],
        datasets: [
            {
                label: 'Spese Effettive',
                data: [totalSpending],
                backgroundColor: 'rgba(220, 53, 69, 0.8)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Disponibile',
                data: [remainingAllowance],
                backgroundColor: 'rgba(40, 167, 69, 0.6)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }
        ]
    };

    const config = {
        type: 'bar',
        data: spendingData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: '#333'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: totalLimit,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#6c757d',
                        callback: function(value) {
                            return new Intl.NumberFormat('it-IT', {
                                style: 'currency',
                                currency: 'EUR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // We use custom legend
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function() {
                            return 'Budget Mensile Settembre 2025';
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const formatted = new Intl.NumberFormat('it-IT', {
                                style: 'currency',
                                currency: 'EUR'
                            }).format(value);
                            return context.dataset.label + ': ' + formatted;
                        },
                        afterBody: function() {
                            const spentPercentage = ((totalSpending / totalLimit) * 100).toFixed(1);
                            const remainingPercentage = ((remainingAllowance / totalLimit) * 100).toFixed(1);
                            return [
                                `Utilizzo: ${spentPercentage}%`,
                                `Disponibile: ${remainingPercentage}%`
                            ];
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };

    // Create the chart
    const spendingChart = new Chart(ctx, config);
    
    // Store globally for updates
    window.spendingChart = spendingChart;

    // Add animation for numbers
    animateNumbers();
    
    return spendingChart;
}

// Animate the big numbers
function animateNumbers() {
    const numberElements = document.querySelectorAll('.big-number');
    
    numberElements.forEach(element => {
        const finalValue = parseInt(element.textContent);
        let currentValue = 0;
        const increment = finalValue / 60; // 60 frames for smooth animation
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, 25); // 25ms intervals for smooth animation
    });
}

// Update chart data (for real-time updates)
function updateChartData(newSpending, newLimit) {
    if (window.spendingChart) {
        window.spendingChart.data.datasets[0].data = [newSpending];
        window.spendingChart.data.datasets[1].data = [newLimit];
        window.spendingChart.update('active');
        
        // Update legend
        const legendItems = document.querySelectorAll('.legend-item span:not(.legend-color)');
        if (legendItems.length >= 3) {
            legendItems[0].textContent = `Spese Effettive: ${formatCurrency(newSpending)}`;
            legendItems[1].textContent = `Limite Totale: ${formatCurrency(newLimit)}`;
            legendItems[2].textContent = `Disponibile: ${formatCurrency(newLimit - newSpending)}`;
        }
    }
}

// Popup System Functions
function initializePopupSystem() {
    const popup = document.getElementById('customPopup');
    const closeBtn = popup.querySelector('.popup-close');
    const cancelBtn = popup.querySelector('.popup-cancel');
    
    // Close popup events
    closeBtn.addEventListener('click', hidePopup);
    cancelBtn.addEventListener('click', hidePopup);
    
    // Close on background click
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            hidePopup();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            hidePopup();
        }
    });
}

function showPopup(type, title, message, showButtons = false) {
    const popup = document.getElementById('customPopup');
    const icon = popup.querySelector('.popup-icon');
    const titleElement = popup.querySelector('.popup-title');
    const messageElement = popup.querySelector('.popup-message');
    const footer = popup.querySelector('.popup-footer');
    const confirmBtn = popup.querySelector('.popup-confirm');
    
    // Set icon based on type
    icon.className = `popup-icon fas ${getIconClass(type)} ${type}`;
    
    // Set content
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // Show/hide buttons
    if (showButtons) {
        footer.style.display = 'flex';
        confirmBtn.className = `popup-btn popup-confirm ${type}`;
        confirmBtn.textContent = 'OK';
    } else {
        footer.style.display = 'none';
    }
    
    // Show popup
    popup.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Auto-hide after 3 seconds for success/info messages
    if ((type === 'success' || type === 'info') && !showButtons) {
        setTimeout(() => {
            hidePopup();
        }, 3000);
    }
}

function showConfirmPopup(type, title, message, onConfirm) {
    const popup = document.getElementById('customPopup');
    const icon = popup.querySelector('.popup-icon');
    const titleElement = popup.querySelector('.popup-title');
    const messageElement = popup.querySelector('.popup-message');
    const footer = popup.querySelector('.popup-footer');
    const confirmBtn = popup.querySelector('.popup-confirm');
    
    // Set icon based on type
    icon.className = `popup-icon fas ${getIconClass(type)} ${type}`;
    
    // Set content
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // Show buttons
    footer.style.display = 'flex';
    confirmBtn.className = `popup-btn popup-confirm ${type}`;
    confirmBtn.textContent = type === 'error' ? 'Blocca' : 'Conferma';
    
    // Set up confirm action
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', function() {
        hidePopup();
        if (onConfirm) {
            onConfirm();
        }
    });
    
    // Show popup
    popup.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hidePopup() {
    const popup = document.getElementById('customPopup');
    popup.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function getIconClass(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'error':
            return 'fa-times-circle';
        case 'info':
        default:
            return 'fa-info-circle';
    }
}

// Limit Modal Functions
function openLimitModal(employeeName, cardElement) {
    const modal = document.getElementById('limitModal');
    const employeeNameElement = document.getElementById('limitEmployeeName');
    const currentLimitElement = document.getElementById('currentLimit');
    const currentSpendingElement = document.getElementById('currentSpending');
    const newLimitInput = document.getElementById('newLimit');
    
    // Get current data from card
    const limitElement = cardElement.querySelector('.card-stats .stat:first-child .value');
    const spendingElement = cardElement.querySelector('.card-stats .stat:nth-child(2) .value');
    
    const currentLimit = limitElement.textContent;
    const currentSpending = spendingElement.textContent;
    
    // Populate modal
    employeeNameElement.textContent = employeeName;
    currentLimitElement.textContent = currentLimit;
    currentSpendingElement.textContent = currentSpending;
    
    // Set current limit as default value (remove € and . for number input)
    const numericLimit = parseInt(currentLimit.replace(/[€.,]/g, ''));
    newLimitInput.value = numericLimit;
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Store reference to current card for later use
    modal.dataset.currentCard = Array.from(document.querySelectorAll('.card-item')).indexOf(cardElement);
}

function closeLimitModal() {
    const modal = document.getElementById('limitModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('limitForm').reset();
}

// Initialize limit modal events
document.addEventListener('DOMContentLoaded', function() {
    const limitModal = document.getElementById('limitModal');
    const limitModalClose = document.getElementById('limitModalClose');
    const limitCancelBtn = document.getElementById('limitCancelBtn');
    const limitForm = document.getElementById('limitForm');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    const newLimitInput = document.getElementById('newLimit');
    
    // Close modal events
    limitModalClose.addEventListener('click', closeLimitModal);
    limitCancelBtn.addEventListener('click', closeLimitModal);
    
    // Close on background click
    limitModal.addEventListener('click', function(e) {
        if (e.target === limitModal) {
            closeLimitModal();
        }
    });
    
    // Suggestion buttons
    suggestionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.dataset.amount;
            newLimitInput.value = amount;
            
            // Visual feedback
            suggestionButtons.forEach(b => b.style.backgroundColor = 'white');
            this.style.backgroundColor = '#1976d2';
            this.style.color = 'white';
            
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 1000);
        });
    });
    
    // Form submission
    limitForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newLimit = parseInt(newLimitInput.value);
        const cardIndex = parseInt(limitModal.dataset.currentCard);
        const cardElement = document.querySelectorAll('.card-item')[cardIndex];
        const employeeName = cardElement.querySelector('h3').textContent;
        
        if (newLimit < 100 || newLimit > 50000) {
            showPopup('error', 'Limite Non Valido', 'Il limite deve essere compreso tra €100 e €50.000');
            return;
        }
        
        // Update card limit
        updateCardLimit(cardElement, newLimit);
        
        // Update global totals and chart
        updateGlobalTotals();
        
        // Close modal
        closeLimitModal();
        
        // Show success message
        const formattedLimit = new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(newLimit);
        
        showPopup('success', 'Limite Aggiornato', `Limite mensile per ${employeeName} aggiornato a ${formattedLimit}`);
    });
});

function updateCardLimit(cardElement, newLimit) {
    const limitElement = cardElement.querySelector('.card-stats .stat:first-child .value');
    const formattedLimit = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(newLimit);
    
    // Update the display with animation
    limitElement.style.transform = 'scale(1.1)';
    limitElement.style.color = '#1976d2';
    
    setTimeout(() => {
        limitElement.textContent = formattedLimit;
        limitElement.style.transform = 'scale(1)';
        limitElement.style.color = '';
    }, 200);
}

function updateGlobalTotals() {
    // Recalculate total limits from all cards
    const cardItems = document.querySelectorAll('.card-item');
    let totalLimit = 0;
    let totalSpending = 0;
    
    cardItems.forEach(card => {
        const limitText = card.querySelector('.card-stats .stat:first-child .value').textContent;
        const spendingText = card.querySelector('.card-stats .stat:nth-child(2) .value').textContent;
        
        const limit = parseInt(limitText.replace(/[€.,]/g, ''));
        const spending = parseInt(spendingText.replace(/[€.,]/g, ''));
        
        totalLimit += limit;
        totalSpending += spending;
    });
    
    // Update chart
    if (window.spendingChart) {
        const remainingAllowance = totalLimit - totalSpending;
        
        window.spendingChart.data.datasets[0].data = [totalSpending];
        window.spendingChart.data.datasets[1].data = [remainingAllowance];
        window.spendingChart.options.scales.y.max = totalLimit;
        window.spendingChart.update('active');
        
        // Update legend
        const legendItems = document.querySelectorAll('.legend-item span:not(.legend-color)');
        if (legendItems.length >= 3) {
            legendItems[0].textContent = `Spese Effettive: ${formatCurrency(totalSpending)}`;
            legendItems[1].textContent = `Limite Totale: ${formatCurrency(totalLimit)}`;
            legendItems[2].textContent = `Disponibile: ${formatCurrency(remainingAllowance)}`;
        }
    }
    
    // Update stats cards
    const limitStatCard = document.querySelector('.stats-chart .chart-legend .legend-item:nth-child(2) span:last-child');
    if (limitStatCard) {
        limitStatCard.textContent = `Limite Totale: ${formatCurrency(totalLimit)}`;
    }
}
