// Form submission handler
async function handleSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Validate form data
    if (!validateForm(formData)) {
        return false;
    }

    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        // Track form submission in Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'Contact',
                'event_label': formData.subject
            });
        }

        // Here you would typically send the form data to your backend
        // For now, we'll simulate a successful submission
        await simulateFormSubmission(formData);

        // Show success message
        showMessage('Thank you for your message! I will get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
    } catch (error) {
        // Show error message
        showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }

    return false;
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate name
    if (!data.name.trim()) {
        showFieldError('name', 'Please enter your name');
        isValid = false;
    } else {
        clearFieldError('name');
    }

    // Validate email
    if (!data.email.trim()) {
        showFieldError('email', 'Please enter your email');
        isValid = false;
    } else if (!emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearFieldError('email');
    }

    // Validate subject
    if (!data.subject.trim()) {
        showFieldError('subject', 'Please enter a subject');
        isValid = false;
    } else {
        clearFieldError('subject');
    }

    // Validate message
    if (!data.message.trim()) {
        showFieldError('message', 'Please enter your message');
        isValid = false;
    } else {
        clearFieldError('message');
    }

    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error message if any
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);

    // Add error class to input
    field.classList.add('error');
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove error message
    const errorDiv = formGroup.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }

    // Remove error class from input
    field.classList.remove('error');
}

// Show form message
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create and show new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    // Insert message at the top of the form
    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data:', data);
            resolve();
        }, 1500);
    });
}

// Add input event listeners for real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const formData = {
                [input.id]: input.value
            };
            validateForm(formData);
        });
    });
}); 