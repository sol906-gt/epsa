function goToPage(select) {
        if (select.value !== "") {
            window.location.href = select.value;
        }
    }
// ============================================
// MAINTENANCE COUNTDOWN TIMER
// ============================================

function initializeMaintenanceCountdown() {
    // Only run if countdown elements exist
    const countdownElement = document.getElementById("countdown");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    
    if (countdownElement || hoursElement || minutesElement || secondsElement) {
        const countDownDate = new Date("November 28, 2024 18:00:00").getTime();
        
        const countdownFunction = setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            
            // Time calculations
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Update countdown display if elements exist
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
            
            // If countdown is finished
            if (distance < 0) {
                clearInterval(countdownFunction);
                if (countdownElement) {
                    countdownElement.innerHTML = "<span style='color:#4CAF50'>Maintenance Complete!</span>";
                }
                // Clear the time display
                if (hoursElement) hoursElement.textContent = "00";
                if (minutesElement) minutesElement.textContent = "00";
                if (secondsElement) secondsElement.textContent = "00";
            }
        }, 1000);
    }
}

// ============================================
// FLOATING PARTICLES ANIMATION
// ============================================

function initializeFloatingParticles() {
    const container = document.querySelector('.container');
    if (container) {
        // Check if particles already exist
        const existingParticles = container.querySelectorAll('[data-particle="true"]');
        if (existingParticles.length > 0) return;
        
        // Create new particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.setAttribute('data-particle', 'true');
            particle.textContent = '•';
            particle.style.position = 'absolute';
            particle.style.color = 'rgba(255,255,255,0.3)';
            particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
            particle.style.zIndex = '-1';
            particle.style.pointerEvents = 'none';
            particle.style.userSelect = 'none';
            container.appendChild(particle);
        }
    }
}

// ============================================
// DRUG REGISTRATION SYSTEM
// ============================================

function initializeDrugRegistration() {
    // Get form and elements
    const drugForm = document.getElementById('drugForm');
    
    // Only initialize if drug form exists
    if (!drugForm) return;
    
    const successDiv = document.getElementById('success');
    const outputDiv = document.getElementById('output');
    const addAnotherBtn = document.getElementById('addAnotherBtn');
    const resetBtn = document.getElementById('resetBtn');
    const viewDrugsLink = document.getElementById('viewDrugsLink');
    const drugList = document.getElementById('drugList');
    const drugsTableBody = document.getElementById('drugsTableBody');
    const drugCount = document.getElementById('drugCount');
    
    // Initialize drugs array from localStorage or empty array
    let registeredDrugs = JSON.parse(localStorage.getItem('epsadrugs')) || [];
    
    // Function to generate Registration ID
    function generateRegId() {
        const prefix = 'EPSA-DRG-';
        const timestamp = Date.now().toString().slice(-6);
        const randomNum = Math.floor(100 + Math.random() * 900);
        return prefix + timestamp + randomNum;
    }
    
    // Function to get current date
    function getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Function to update drug count
    function updateDrugCount() {
        if (drugCount) {
            drugCount.textContent = registeredDrugs.length;
        }
    }
    
    // Function to display registered drugs
    function displayRegisteredDrugs() {
        if (!drugsTableBody) return;
        
        drugsTableBody.innerHTML = '';
        
        if (registeredDrugs.length === 0) {
            drugsTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; color: #666;">
                        No drugs registered yet
                    </td>
                </tr>
            `;
            return;
        }
        
        // Sort by most recent first
        const sortedDrugs = [...registeredDrugs].reverse();
        
        sortedDrugs.forEach(drug => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${drug.regId || 'N/A'}</td>
                <td>${drug.name || 'N/A'}</td>
                <td>${drug.category || 'N/A'}</td>
                <td>${drug.strength || 'N/A'}</td>
                <td>${drug.manufacturer || 'N/A'}</td>
                <td>${drug.batch || 'N/A'}</td>
                <td>${drug.expiry || 'N/A'}</td>
                <td>${drug.date || 'N/A'}</td>
            `;
            drugsTableBody.appendChild(row);
        });
    }
    
    // Function to reset form
    function resetForm() {
        if (drugForm) drugForm.reset();
        if (outputDiv) outputDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
        
        // Reset expiry date min to today
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            const today = new Date().toISOString().split('T')[0];
            expiryInput.min = today;
        }
        
        if (drugForm) drugForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update drug count on load
    updateDrugCount();
    
    // Form submission handler
    drugForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const drugData = {
            name: document.getElementById('drugName')?.value.trim() || '',
            category: document.getElementById('category')?.value || '',
            strength: document.getElementById('strength')?.value.trim() || '',
            manufacturer: document.getElementById('manufacturer')?.value.trim() || '',
            batch: document.getElementById('batch')?.value.trim() || '',
            expiry: document.getElementById('expiry')?.value || '',
            regId: generateRegId(),
            date: getCurrentDate()
        };
        
        // Validate required fields
        if (!drugData.name || !drugData.category || !drugData.strength || !drugData.manufacturer || !drugData.batch || !drugData.expiry) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Validate expiry date
        const today = new Date();
        const expiryDate = new Date(drugData.expiry);
        if (expiryDate <= today) {
            alert('Expiry date must be in the future');
            return;
        }
        
        // Format expiry date for display
        const formattedExpiry = new Date(drugData.expiry).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        // Update output display
        document.getElementById('outName').textContent = drugData.name;
        document.getElementById('outCat').textContent = drugData.category;
        document.getElementById('outStr').textContent = drugData.strength;
        document.getElementById('outMan').textContent = drugData.manufacturer;
        document.getElementById('outBatch').textContent = drugData.batch;
        document.getElementById('outExpiry').textContent = formattedExpiry;
        document.getElementById('outId').textContent = drugData.regId;
        document.getElementById('outDate').textContent = drugData.date;
        
        // Add to registered drugs array
        registeredDrugs.push(drugData);
        
        // Save to localStorage
        try {
            localStorage.setItem('epsadrugs', JSON.stringify(registeredDrugs));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            alert('Error saving drug information. Storage may be full.');
            return;
        }
        
        // Update drug count
        updateDrugCount();
        
        // Show success message and output
        if (successDiv) successDiv.style.display = 'flex';
        if (outputDiv) {
            outputDiv.style.display = 'block';
            setTimeout(() => {
                outputDiv.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    });
    
    // Add Another Drug button handler
    if (addAnotherBtn) {
        addAnotherBtn.addEventListener('click', function() {
            resetForm();
        });
    }
    
    // Reset button handler
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetForm();
        });
    }
    
    // View Drugs link handler
    if (viewDrugsLink) {
        viewDrugsLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (drugList) {
                const isVisible = drugList.style.display === 'block';
                drugList.style.display = isVisible ? 'none' : 'block';
                if (!isVisible) {
                    displayRegisteredDrugs();
                    setTimeout(() => {
                        drugList.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        });
    }
    
    // Set minimum date to today for expiry date
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        const today = new Date().toISOString().split('T')[0];
        expiryInput.min = today;
    }
}

// ============================================
// WAREHOUSE FUNCTIONS (for warehouse.html)
// ============================================

function initializeWarehouseFunctions() {
    // Show section function for quick links
    window.showSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If section doesn't exist, look for elements with similar class/ID
            const elements = document.querySelectorAll(`[id*="${sectionId}"], [class*="${sectionId}"]`);
            if (elements.length > 0) {
                elements[0].scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    
    // Drug data for warehouse modal
    const drugDatabase = {
        amoxicillin: {
            name: 'Amoxicillin',
            generic: 'Amoxicillin Trihydrate',
            category: 'Antibiotic',
            strength: '500mg Capsule',
            manufacturer: 'Cadila Pharma',
            batch: 'AMX-2024-056',
            expiry: 'August 15, 2025',
            quantity: '54 units',
            storage: 'Room A (2-8°C)',
            description: 'Broad-spectrum penicillin antibiotic used to treat bacterial infections.'
        },
        ciprofloxacin: {
            name: 'Ciprofloxacin',
            generic: 'Ciprofloxacin HCl',
            category: 'Antibiotic',
            strength: '500mg Tablet',
            manufacturer: 'Sun Pharma',
            batch: 'CIP-2024-123',
            expiry: 'May 30, 2025',
            quantity: '32 units',
            storage: 'Room A (2-8°C)',
            description: 'Fluoroquinolone antibiotic used for various bacterial infections.'
        },
        azithromycin: {
            name: 'Azithromycin',
            generic: 'Azithromycin Dihydrate',
            category: 'Antibiotic',
            strength: '250mg Tablet',
            manufacturer: 'Pfizer',
            batch: 'AZI-2024-078',
            expiry: 'January 20, 2026',
            quantity: '28 units',
            storage: 'Room A (2-8°C)',
            description: 'Macrolide antibiotic effective against respiratory infections.'
        }
    };
    
    // Show drug information modal
    window.showInfo = function(drugKey) {
        const modal = document.getElementById('infoModal');
        if (!modal) return;
        
        const drugData = drugDatabase[drugKey] || {
            name: 'Unknown Drug',
            generic: 'N/A',
            category: 'N/A',
            strength: 'N/A',
            manufacturer: 'N/A',
            batch: 'N/A',
            expiry: 'N/A',
            quantity: 'N/A',
            storage: 'N/A',
            description: 'Information not available.'
        };
        
        // Update modal content
        document.getElementById('drugTitle').textContent = drugData.name;
        document.getElementById('infoGeneric').textContent = drugData.generic;
        document.getElementById('infoCategory').textContent = drugData.category;
        document.getElementById('infoStrength').textContent = drugData.strength;
        document.getElementById('infoManufacturer').textContent = drugData.manufacturer;
        document.getElementById('infoBatch').textContent = drugData.batch;
        document.getElementById('infoExpiry').textContent = drugData.expiry;
        document.getElementById('infoQuantity').textContent = drugData.quantity;
        
        // Show modal with animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    };
    
    // Close modal function
    window.closeModal = function() {
        const modal = document.getElementById('infoModal');
        if (modal) {
            modal.style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'scale(0.9)';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    };
    
    // Close modal when clicking outside or pressing Escape
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('infoModal');
        if (modal && event.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('EPSA System Initializing...');
    
    // Initialize maintenance countdown (if elements exist)
    initializeMaintenanceCountdown();
    
    // Initialize floating particles (if container exists)
    initializeFloatingParticles();
    
    // Initialize drug registration system (if form exists)
    initializeDrugRegistration();
    
    // Initialize warehouse functions (always safe to call)
    initializeWarehouseFunctions();
    
    // Initialize footer year
    const footerYear = document.querySelector('footer p:last-child');
    if (footerYear && footerYear.textContent.includes('2026')) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace('2026', currentYear);
    }
    
    console.log('EPSA System Initialized Successfully');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date utility
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// Validate email (if needed in future)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


