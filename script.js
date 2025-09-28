document.addEventListener('DOMContentLoaded', function() {
    // Handle sidebar navigation
    const navItems = document.querySelectorAll('.nav-menu li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });

    // Handle checkbox interactions
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const approvalText = document.querySelector('.approval-item p');
            
            if (allChecked) {
                approvalText.textContent = 'Hai controllato tutte le richieste!';
                approvalText.style.color = '#28a745';
            } else {
                approvalText.textContent = 'Ci sono richieste da controllare.';
                approvalText.style.color = '#dc3545';
            }
        });
    });

    // Handle submenu toggle
    const submenuItems = document.querySelectorAll('.has-submenu');
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const chevron = this.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = chevron.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });

    // Add hover effects to event items
    const eventItems = document.querySelectorAll('.event-item');
    
    eventItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#e9ecef';
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f8f9fa';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add click handlers for links
    const links = document.querySelectorAll('a[href="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add a subtle animation to indicate the click
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Simulate real-time updates (optional)
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        // You could add a date/time display if needed
        console.log('Dashboard loaded at:', now.toLocaleDateString('it-IT', options));
    }

    updateDateTime();

    // Add smooth transitions
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: all 0.2s ease;
        }
        
        .event-item {
            transition: all 0.3s ease;
        }
        
        .nav-menu li {
            transition: all 0.2s ease;
        }
        
        .fa-chevron-down {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Utility function to format dates in Italian
function formatDate(date) {
    return new Intl.DateTimeFormat('it-IT', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}
