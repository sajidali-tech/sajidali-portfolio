document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize AOS animations if motion is allowed
    if (typeof AOS !== 'undefined' && !prefersReducedMotion) {
        AOS.init({
            once: true,
            offset: 50,
            duration: 600,
            easing: 'ease-out-cubic',
        });
    }

    // Dynamic Footer Year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Glass nav scroll effect
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-lg', 'border-b', 'border-white/10');
            } else {
                nav.classList.remove('shadow-lg', 'border-b', 'border-white/10');
            }
        });
    }

    // Hamburger Menu Logic
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerTop = document.getElementById('hamburger-top');
    const hamburgerBottom = document.getElementById('hamburger-bottom');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;
    let isMenuOpen = false;

    function toggleMenu() {
        if (!mobileMenu) return;
        isMenuOpen = !isMenuOpen;
        
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', isMenuOpen);
        }

        if (isMenuOpen) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            body.classList.add('menu-open');
            if (hamburgerTop) hamburgerTop.classList.add('translate-y-[3.5px]', 'rotate-45');
            if (hamburgerBottom) hamburgerBottom.classList.add('-translate-y-[3.5px]', '-rotate-45');
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            body.classList.remove('menu-open');
            if (hamburgerTop) hamburgerTop.classList.remove('translate-y-[3.5px]', 'rotate-45');
            if (hamburgerBottom) hamburgerBottom.classList.remove('-translate-y-[3.5px]', '-rotate-45');
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }

    // Close when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(isMenuOpen) toggleMenu();
        });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
            if (menuBtn) menuBtn.focus();
        }
    });

    // Close when clicking outside link area inside overlay
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu();
            }
        });
    }

    // FAQ Accordion Logic
    const accordionButtons = document.querySelectorAll('.accordion-btn');
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all
            accordionButtons.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                const content = document.getElementById(btn.getAttribute('aria-controls'));
                if(content) {
                    content.classList.add('hidden');
                }
                const icon = btn.querySelector('.accordion-icon');
                if(icon) {
                    icon.classList.remove('rotate-45');
                }
            });

            // Open clicked if it wasn't already expanded
            if (!isExpanded) {
                button.setAttribute('aria-expanded', 'true');
                const content = document.getElementById(button.getAttribute('aria-controls'));
                if(content) {
                    content.classList.remove('hidden');
                }
                const icon = button.querySelector('.accordion-icon');
                if(icon) {
                    icon.classList.add('rotate-45');
                }
            }
        });
    });

    // Contact Form Logic (Formspree)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Prevent duplicate submissions
            if (submitBtn.disabled) return;

            // Form validation
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            // Set dynamic subject if element exists
            const projectTypeEl = document.getElementById('projectType');
            const subjectInput = document.getElementById('email-subject');
            if (projectTypeEl && subjectInput) {
                const projectType = projectTypeEl.options[projectTypeEl.selectedIndex].text;
                subjectInput.value = `New Portfolio Inquiry — ${projectType}`;
            }

            // Check if Formspree endpoint is still unconfigured placeholder
            const isUnconfiguredEndpoint = !contactForm.action || contactForm.action.includes('YOUR_FORMSPREE_ENDPOINT');

            if (isUnconfiguredEndpoint) {
                const fullName = document.getElementById('fullName')?.value || '';
                const email = document.getElementById('email')?.value || '';
                const inquiryTypeEl = document.getElementById('projectType');
                const inquiryType = inquiryTypeEl ? inquiryTypeEl.options[inquiryTypeEl.selectedIndex]?.text : 'Portfolio Inquiry';
                const details = document.getElementById('details')?.value || '';

                const subject = encodeURIComponent(`Inquiry from ${fullName} — ${inquiryType}`);
                const bodyText = encodeURIComponent(`Name: ${fullName}\nEmail: ${email}\nInquiry Type: ${inquiryType}\n\nProject / Role Details:\n${details}`);
                const mailtoLink = `mailto:sajidtech850@gmail.com?subject=${subject}&body=${bodyText}`;

                formStatus.innerHTML = `
                    <div class="space-y-2">
                        <p class="font-bold text-white">Direct Email Required:</p>
                        <p class="text-gray-300">This form does not send your message automatically. Click below to open a pre-filled draft in your email application, where you can review and send it directly:</p>
                        <a href="${mailtoLink}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-all shadow-md mt-1">
                            <i class="fas fa-envelope"></i> Open Email Draft
                        </a>
                        <p class="text-xs text-gray-400 mt-1">Or write manually to: <a href="mailto:sajidtech850@gmail.com" class="text-brand-400 underline font-medium">sajidtech850@gmail.com</a></p>
                    </div>
                `;
                formStatus.className = 'rounded-lg p-5 mb-6 text-sm bg-brand-500/10 border border-brand-500/20 text-white';
                formStatus.classList.remove('hidden');

                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
                if (btnText) btnText.textContent = 'Send Project Inquiry';
                if (btnSpinner) btnSpinner.classList.add('hidden');
                return;
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    contactForm.reset();
                    formStatus.textContent = "Thank you for reaching out! Your project inquiry has been submitted successfully. I'll get back to you as soon as possible.";
                    formStatus.classList.remove('hidden');
                    formStatus.classList.add('bg-green-500/10', 'text-green-400', 'border', 'border-green-500/20');
                } else {
                    // Error from API
                    const data = await response.json();
                    let errorMessage = "Oops! There was a problem submitting your form.";
                    if (Object.hasOwn(data, 'errors')) {
                        errorMessage = data["errors"].map(error => error["message"]).join(", ");
                    }
                    throw new Error(errorMessage);
                }
            } catch (error) {
                // Network or caught error
                formStatus.textContent = error.message || "Oops! There was a problem submitting your form. Please try again.";
                formStatus.classList.remove('hidden');
                formStatus.classList.add('bg-red-500/10', 'text-red-400', 'border', 'border-red-500/20');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
                if (btnText) btnText.textContent = 'Send Project Inquiry';
                if (btnSpinner) btnSpinner.classList.add('hidden');
            }
        });
    }
});