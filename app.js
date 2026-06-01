/* ==========================================================================
   LES CISEAUX CANINS - SCRIPTS ET INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. NAVIGATION MOBILE DRAWER
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            
            // Toggle active look of mobile icon
            mobileToggle.classList.toggle('active');
        });
        
        // Close menu on click of nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       2. ACTIVE NAV LINKS SCROLL SYNCHRONIZATION
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);

    /* ==========================================================================
       3. SERVICES TABS SYSTEM
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const activeContent = document.getElementById(`tab-${targetTab}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       4. INTERACTIVE PRICING CALCULATOR
       ========================================================================== */
    const dogSizeBtns = document.querySelectorAll('#calc-dog-sizes .calc-opt-btn');
    const serviceBtns = document.querySelectorAll('#calc-services .calc-opt-btn');
    const priceDisplay = document.getElementById('calc-result-price');
    const serviceDesc = document.getElementById('calc-service-desc');
    const calculatorBookingCta = document.getElementById('calc-booking-cta');

    let currentFactor = 1.0;
    let currentBasePrice = 45;

    function calculateEstimate() {
        const estimatedPrice = Math.round(currentBasePrice * currentFactor);
        if (priceDisplay) {
            priceDisplay.textContent = `${estimatedPrice}€`;
        }
    }

    dogSizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dogSizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFactor = parseFloat(btn.getAttribute('data-factor'));
            calculateEstimate();
        });
    });

    serviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            serviceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBasePrice = parseInt(btn.getAttribute('data-base'));
            
            if (serviceDesc) {
                serviceDesc.textContent = btn.getAttribute('data-desc');
            }
            
            calculateEstimate();
        });
    });

    if (calculatorBookingCta) {
        calculatorBookingCta.addEventListener('click', () => {
            // Pre-select options in the booking wizard based on calculator choices
            const activeSizeOpt = document.querySelector('#calc-dog-sizes .calc-opt-btn.active');
            const activeServiceOpt = document.querySelector('#calc-services .calc-opt-btn.active');
            
            if (activeSizeOpt && activeServiceOpt) {
                const sizeVal = activeSizeOpt.getAttribute('data-size');
                let serviceVal = 'standard';
                
                const baseVal = activeServiceOpt.getAttribute('data-base');
                if (baseVal === '65') serviceVal = 'spa';
                else if (baseVal === '75') serviceVal = 'technique';
                
                // Set step-1 choice
                const wizardSizeOpts = document.querySelectorAll('#step-1 .wiz-option');
                wizardSizeOpts.forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.getAttribute('data-value') === sizeVal) {
                        opt.classList.add('selected');
                    }
                });
                
                // Set step-2 choice
                const wizardServiceOpts = document.querySelectorAll('#step-2 .wiz-service-item');
                wizardServiceOpts.forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.getAttribute('data-value') === serviceVal) {
                        opt.classList.add('selected');
                    }
                });
                
                // Enable next button for step 1 & 2
                document.querySelector('#step-1 .btn-next').removeAttribute('disabled');
                document.querySelector('#step-2 .btn-next').removeAttribute('disabled');
            }
        });
    }

    /* ==========================================================================
       5. BEFORE/AFTER SLIDER (horizontal drag to reveal)
       ========================================================================== */
    const baSlider = document.getElementById('baSlider');
    const afterImageWrapper = document.getElementById('afterImageWrapper');
    const baHandle = document.getElementById('baHandle');
    
    if (baSlider && afterImageWrapper && baHandle) {
        let isDragging = false;
        
        const setSliderPosition = (x) => {
            const rect = baSlider.getBoundingClientRect();
            let relativeX = x - rect.left;
            
            // Constrain within slider width
            if (relativeX < 0) relativeX = 0;
            if (relativeX > rect.width) relativeX = rect.width;
            
            const percentage = (relativeX / rect.width) * 100;
            
            // Adjust width of the cropped container and handle offset
            afterImageWrapper.style.width = `${percentage}%`;
            baHandle.style.left = `${percentage}%`;
        };
        
        // Mouse Down
        baHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
        });
        
        // Touch Start for mobile
        baHandle.addEventListener('touchstart', (e) => {
            isDragging = true;
        }, { passive: true });
        
        // Drag actions on window
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            setSliderPosition(e.clientX);
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches[0]) {
                setSliderPosition(e.touches[0].clientX);
            }
        }, { passive: true });

        // Adjust dimensions dynamically on window resize
        window.addEventListener('resize', () => {
            const rect = baSlider.getBoundingClientRect();
            // Update crop image width reference to avoid distortion
            const afterImg = afterImageWrapper.querySelector('.ba-img');
            if (afterImg) {
                afterImg.style.width = `${rect.width}px`;
            }
        });
        
        // Initial setup trigger
        setTimeout(() => {
            const rect = baSlider.getBoundingClientRect();
            const afterImg = afterImageWrapper.querySelector('.ba-img');
            if (afterImg) {
                afterImg.style.width = `${rect.width}px`;
            }
        }, 300);
    }

    /* ==========================================================================
       6. BEFORE/AFTER GALLERY FILTERING
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Add micro transition fade in
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ==========================================================================
       7. TESTIMONIALS SLIDER
       ========================================================================== */
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        testimonialSlides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % testimonialSlides.length;
        showSlide(nextIndex);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIndex = parseInt(dot.getAttribute('data-index'));
            showSlide(targetIndex);
            resetSlideShow();
        });
    });

    if (testimonialSlides.length > 0) {
        startSlideShow();
    }

    /* ==========================================================================
       8. SIMULATED FACEBOOK FEED INTERACTION
       ========================================================================== */
    const fbLikeBtn = document.getElementById('fbLikeBtn');
    const likesNumber = document.getElementById('likesNumber');
    const likeIcon = document.getElementById('likeIcon');
    const likeText = document.getElementById('likeText');
    const fbCommentInput = document.getElementById('fbCommentInput');
    const fbSendCommentBtn = document.getElementById('fbSendCommentBtn');
    const commentsList = document.querySelector('.fb-mock-comments-section');

    let hasLiked = false;
    let initialLikes = 1420;

    if (fbLikeBtn && likesNumber) {
        fbLikeBtn.addEventListener('click', () => {
            hasLiked = !hasLiked;
            
            if (hasLiked) {
                fbLikeBtn.classList.add('liked');
                likesNumber.textContent = initialLikes + 1;
                likeIcon.className = "fa-solid fa-thumbs-up";
                likeText.textContent = "Aimé";
            } else {
                fbLikeBtn.classList.remove('liked');
                likesNumber.textContent = initialLikes;
                likeIcon.className = "fa-regular fa-thumbs-up";
                likeText.textContent = "J'aime";
            }
        });
    }

    function addMockComment() {
        const text = fbCommentInput.value.trim();
        if (text === '') return;
        
        const commentItem = document.createElement('div');
        commentItem.className = 'fb-comment-item';
        commentItem.innerHTML = `
            <div class="comment-avatar">U</div>
            <div class="comment-bubble">
                <h6>Vous</h6>
                <p>${text}</p>
                <div class="comment-meta">J'aime • Répondre • À l'instant</div>
            </div>
        `;
        
        // Insert right before the input box (last element)
        const inputBox = document.querySelector('.fb-comment-input-box');
        commentsList.insertBefore(commentItem, inputBox);
        
        fbCommentInput.value = '';
        
        // Scroll slightly down inside feed mock to see new comments if overflowing
        commentsList.scrollTop = commentsList.scrollHeight;
    }

    if (fbSendCommentBtn && fbCommentInput) {
        fbSendCommentBtn.addEventListener('click', addMockComment);
        fbCommentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addMockComment();
            }
        });
    }

    /* ==========================================================================
       9. BOOKING WIZARD SYSTEM
       ========================================================================== */
    const wizard = document.getElementById('bookingWizard');
    if (wizard) {
        const steps = wizard.querySelectorAll('.wizard-step');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressStepText');
        const nextBtns = wizard.querySelectorAll('.btn-next');
        const prevBtns = wizard.querySelectorAll('.btn-prev');
        
        let currentStepIndex = 0;
        let bookingData = {
            dogSize: '',
            dogSizeLabel: '',
            service: '',
            serviceLabel: '',
            date: '',
            time: '',
            clientName: '',
            clientPhone: '',
            dogName: '',
            dogBreed: ''
        };

        const updateWizardProgress = () => {
            // Progress percentage: 25% -> 50% -> 75% -> 100%
            const percent = ((currentStepIndex + 1) / (steps.length - 1)) * 100;
            if (progressBar) {
                // Keep success screen at 100% but hidden from step count
                if (currentStepIndex === 4) {
                    progressBar.style.width = '100%';
                    progressText.style.display = 'none';
                } else {
                    progressBar.style.width = `${percent}%`;
                    progressText.style.display = 'inline';
                    progressText.textContent = `Étape ${currentStepIndex + 1} sur 4`;
                }
            }
        };

        const switchStep = (fromIndex, toIndex) => {
            steps[fromIndex].classList.remove('active');
            steps[toIndex].classList.add('active');
            currentStepIndex = toIndex;
            updateWizardProgress();
        };

        // --- STEP 1: SIZE SELECTION ---
        const sizeOptions = wizard.querySelectorAll('#step-1 .wiz-option');
        sizeOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                sizeOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                
                bookingData.dogSize = opt.getAttribute('data-value');
                bookingData.dogSizeLabel = opt.getAttribute('data-step-val');
                
                // Unlock continue button
                wizard.querySelector('#step-1 .btn-next').removeAttribute('disabled');
            });
        });

        // --- STEP 2: SERVICE SELECTION ---
        const serviceOptions = wizard.querySelectorAll('#step-2 .wiz-service-item');
        serviceOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                serviceOptions.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                
                bookingData.service = opt.getAttribute('data-value');
                bookingData.serviceLabel = opt.getAttribute('data-step-val');
                
                // Unlock continue button
                wizard.querySelector('#step-2 .btn-next').removeAttribute('disabled');
            });
        });

        // --- STEP 3: DATE & TIME ---
        const dateInput = document.getElementById('booking-date');
        const timeslotsGrid = document.getElementById('timeslotsGrid');
        
        // Restrict calendar selection to tomorrow onwards and Lundi-Vendredi only
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        
        if (dateInput) {
            dateInput.min = `${yyyy}-${mm}-${dd}`;
            
            dateInput.addEventListener('change', () => {
                const selectedDate = new Date(dateInput.value);
                const dayOfWeek = selectedDate.getDay(); // 0 is Sunday, 6 is Saturday
                
                timeslotsGrid.innerHTML = '';
                
                // Check if weekend (0=Sun, 6=Sat)
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    timeslotsGrid.innerHTML = '<span class="no-date-msg">Le salon est fermé le week-end. Veuillez choisir un jour du lundi au vendredi.</span>';
                    wizard.querySelector('#step-3 .btn-next').setAttribute('disabled', 'true');
                    bookingData.date = '';
                    bookingData.time = '';
                    return;
                }
                
                // Format French Date
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                bookingData.date = selectedDate.toLocaleDateString('fr-FR', options);
                
                // Generate simulated available time slots
                generateMokedTimeSlots();
            });
        }

        function generateMokedTimeSlots() {
            // Mocks 6 available slots during 8:30 - 17:30
            const slots = ['08:30', '10:00', '11:15', '13:30', '15:00', '16:15'];
            timeslotsGrid.innerHTML = '';
            
            slots.forEach(slot => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'timeslot-btn';
                btn.textContent = slot;
                
                btn.addEventListener('click', () => {
                    const allSlots = timeslotsGrid.querySelectorAll('.timeslot-btn');
                    allSlots.forEach(s => s.classList.remove('selected'));
                    btn.classList.add('selected');
                    
                    bookingData.time = slot;
                    // Unlock continue
                    wizard.querySelector('#step-3 .btn-next').removeAttribute('disabled');
                });
                
                timeslotsGrid.appendChild(btn);
            });
        }

        // --- STEP 4: CONTACT & SUMMARY ---
        const clientNameInput = document.getElementById('client-name');
        const clientPhoneInput = document.getElementById('client-phone');
        const dogNameInput = document.getElementById('dog-name');
        const dogBreedInput = document.getElementById('dog-breed');
        
        const summaryDog = document.getElementById('summary-dog');
        const summaryService = document.getElementById('summary-service');
        const summaryDatetime = document.getElementById('summary-datetime');
        const btnSubmitBooking = document.getElementById('btnSubmitBooking');

        function updateSummaryDetails() {
            if (summaryDog) summaryDog.innerHTML = `<strong>Chien :</strong> ${dogNameInput.value} (${bookingData.dogSizeLabel} ${dogBreedInput.value ? '- ' + dogBreedInput.value : ''})`;
            if (summaryService) summaryService.innerHTML = `<strong>Prestation :</strong> ${bookingData.serviceLabel}`;
            if (summaryDatetime) summaryDatetime.innerHTML = `<strong>Créneau souhaité :</strong> Le ${bookingData.date} à ${bookingData.time}`;
        }

        // Attach listeners to input fields to validate step 4 in real-time
        const validateStep4Form = () => {
            const isNameValid = clientNameInput.value.trim() !== '';
            const isPhoneValid = clientPhoneInput.value.trim() !== '';
            const isDogNameValid = dogNameInput.value.trim() !== '';
            
            if (isNameValid && isPhoneValid && isDogNameValid) {
                btnSubmitBooking.removeAttribute('disabled');
            } else {
                btnSubmitBooking.setAttribute('disabled', 'true');
            }
            updateSummaryDetails();
        };

        [clientNameInput, clientPhoneInput, dogNameInput, dogBreedInput].forEach(inp => {
            if (inp) {
                inp.addEventListener('input', validateStep4Form);
            }
        });

        // --- ACTION BUTTON HANDLERS ---
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStepIndex === 2) {
                    // Update contact info inputs state on entering Step 4
                    validateStep4Form();
                }
                switchStep(currentStepIndex, currentStepIndex + 1);
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchStep(currentStepIndex, currentStepIndex - 1);
            });
        });

        if (btnSubmitBooking) {
            btnSubmitBooking.addEventListener('click', () => {
                bookingData.clientName = clientNameInput.value.trim();
                bookingData.clientPhone = clientPhoneInput.value.trim();
                bookingData.dogName = dogNameInput.value.trim();
                bookingData.dogBreed = dogBreedInput.value.trim();
                
                // Set final summary
                const finalSummary = document.getElementById('final-summary-details');
                if (finalSummary) {
                    finalSummary.innerHTML = `
                        <strong>Client :</strong> ${bookingData.clientName} (Tél: ${bookingData.clientPhone})<br>
                        <strong>Chien :</strong> ${bookingData.dogName} (${bookingData.dogSizeLabel})<br>
                        <strong>Soin :</strong> ${bookingData.serviceLabel}<br>
                        <strong>Créneau :</strong> Le ${bookingData.date} à ${bookingData.time}
                    `;
                }
                
                // Transition to success screen (Step 5)
                switchStep(currentStepIndex, 4);
            });
        }

        const btnResetWizard = document.getElementById('btnResetWizard');
        if (btnResetWizard) {
            btnResetWizard.addEventListener('click', () => {
                // Clear inputs
                clientNameInput.value = '';
                clientPhoneInput.value = '';
                dogNameInput.value = '';
                dogBreedInput.value = '';
                if (dateInput) dateInput.value = '';
                timeslotsGrid.innerHTML = '<span class="no-date-msg">Veuillez d\'abord sélectionner une date valide de semaine.</span>';
                
                // Reset active selections
                sizeOptions.forEach(o => o.classList.remove('selected'));
                serviceOptions.forEach(o => o.classList.remove('selected'));
                
                // Re-disable navigation
                wizard.querySelector('#step-1 .btn-next').setAttribute('disabled', 'true');
                wizard.querySelector('#step-2 .btn-next').setAttribute('disabled', 'true');
                wizard.querySelector('#step-3 .btn-next').setAttribute('disabled', 'true');
                btnSubmitBooking.setAttribute('disabled', 'true');
                
                // Switch back to Step 1
                switchStep(currentStepIndex, 0);
            });
        }
    }

    /* ==========================================================================
       10. LEAFLET.JS INTERACTIVE MAP (Nîmes coordinates)
       ========================================================================== */
    const mapElement = document.getElementById('salonMap');
    if (mapElement && typeof L !== 'undefined') {
        // Salon Coordinates (Nîmes Center, near Arènes)
        const salonCoords = [43.836699, 4.360054]; 
        
        // Init map
        const map = L.map('salonMap', {
            center: salonCoords,
            zoom: 15,
            scrollWheelZoom: false // Avoid zooming when scrolling page
        });
        
        // Clean tile layout layer matching our neutral tones (CartoDB Positron)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);
        
        // Custom Styled Icon matching Gold tone
        const salonIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="
                width: 32px; 
                height: 32px; 
                background-color: #D2957D; 
                border: 3px solid #FFFFFF; 
                border-radius: 50%; 
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFFFFF;
                font-size: 0.9rem;
            "><i class="fa-solid fa-scissors"></i></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        // Add Marker
        L.marker(salonCoords, { icon: salonIcon }).addTo(map)
            .bindPopup(`
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px;">
                    <strong style="font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; color: #2B2F2A; display: block; margin-bottom: 2px;">Les Ciseaux Canins</strong>
                    <span style="font-size: 0.8rem; color: #626A60; display: block; margin-bottom: 6px;">12 Rue de la République, Nîmes</span>
                    <a href="https://maps.google.com/?q=12+Rue+de+la+République+Nîmes" target="_blank" style="font-size: 0.8rem; color: #0D5C75; font-weight: 600; text-decoration: underline;">Y aller</a>
                </div>
            `, { closeButton: false })
            .openPopup();
    }

    /* ==========================================================================
       11. LIGHTBOX MODAL (AGRANDISSEMENT DES PHOTOS)
       ========================================================================== */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryCards = document.querySelectorAll('.gallery-card');

    if (lightboxModal && lightboxImg && lightboxCaption && lightboxClose) {
        galleryCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.gallery-img');
                const title = card.querySelector('h4').textContent;
                const tag = card.querySelector('.gallery-tag').textContent;
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.innerHTML = `${title} <span style="font-size: 1rem; color: #D2957D; display: block; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; margin-top: 6px;">${tag}</span>`;
                    
                    // Show modal and trigger fade in
                    lightboxModal.style.display = 'flex';
                    setTimeout(() => {
                        lightboxModal.classList.add('active');
                    }, 10);
                }
            });
        });
        
        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            setTimeout(() => {
                lightboxModal.style.display = 'none';
                lightboxImg.src = '';
                lightboxCaption.textContent = '';
            }, 300); // matches CSS transition duration
        };
        
        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close on clicking outside the content
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
        
        // Close on Escape key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});
