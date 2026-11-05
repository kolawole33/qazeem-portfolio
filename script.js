
// =========================================
// QAZEEM KOLOWOLE - PORTFOLIO JAVASCRIPT
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. PAGE LOADER
    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        loader?.classList.add("hide");
    });

    // Fallback in case the load event has already occurred
    if (document.readyState === "complete") {
        loader?.classList.add("hide");
    }

    // 2. MOBILE NAVIGATION
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    function closeMenu() {
        navMenu?.classList.remove("active");
        document.body.classList.remove("menu-open");

        menuToggle?.setAttribute("aria-expanded", "false");

        if (menuToggle) {
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }
    }

    menuToggle?.addEventListener("click", () => {
        const isOpen = navMenu?.classList.toggle("active");

        document.body.classList.toggle("menu-open", Boolean(isOpen));

        menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Close mobile navigation when clicking outside it
    document.addEventListener("click", event => {
        if (
            navMenu?.classList.contains("active") &&
            !navMenu.contains(event.target) &&
            !menuToggle?.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // 3. STICKY HEADER
    const header = document.getElementById("header");

    function updateHeader() {
        header?.classList.toggle("scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();

    // 4. DARK AND LIGHT THEME
    const themeToggle = document.getElementById("themeToggle");

    function setTheme(theme) {
        document.body.classList.toggle("light-theme", theme === "light");

        if (themeToggle) {
            themeToggle.innerHTML = theme === "light"
                ? '<i class="fa-solid fa-moon"></i>'
                : '<i class="fa-solid fa-sun"></i>';
        }

        try {
            localStorage.setItem("qazeem-theme", theme);
        } catch (error) {
            console.warn("Theme preference could not be saved.");
        }
    }

    let savedTheme = "dark";

    try {
        savedTheme = localStorage.getItem("qazeem-theme") || "dark";
    } catch (error) {
        console.warn("Theme preference could not be loaded.");
    }

    setTheme(savedTheme);

    themeToggle?.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("light-theme")
            ? "dark"
            : "light";

        setTheme(newTheme);
    });

    // 5. TYPING ANIMATION
    const typingText = document.getElementById("typingText");

    const roles = [
        "Web Developer",
        "Front-End Developer",
        "Technical Design Enthusiast"
    ];

    let roleIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    function typeEffect() {
        if (!typingText) return;

        const currentRole = roles[roleIndex];

        if (!deleting) {
            typingText.textContent =
                currentRole.substring(0, characterIndex + 1);

            characterIndex++;

            if (characterIndex === currentRole.length) {
                deleting = true;
                setTimeout(typeEffect, 1500);
                return;
            }
        } else {
            typingText.textContent =
                currentRole.substring(0, characterIndex - 1);

            characterIndex--;

            if (characterIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }

        setTimeout(typeEffect, deleting ? 45 : 85);
    }

    if (typingText) {
        typeEffect();
    }

    // 6. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(
        ".section-heading, .about-grid, .skill-card, " +
        ".project-card, .timeline-item, .contact-grid"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    // 7. ACTIVE NAVIGATION LINK
    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentId = entry.target.getAttribute("id");

                        navLinks.forEach(link => {
                            const isActive =
                                link.getAttribute("href") === `#${currentId}`;

                            link.classList.toggle("active", isActive);
                        });
                    }
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );

        sections.forEach(section => sectionObserver.observe(section));
    }

    // 8. BACK TO TOP BUTTON
    const backToTop = document.getElementById("backToTop");

    function toggleBackToTop() {
        backToTop?.classList.toggle("show", window.scrollY > 450);
    }

    window.addEventListener("scroll", toggleBackToTop);
    toggleBackToTop();

    backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 9. AUTOMATIC FOOTER YEAR
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // 10. CONTACT FORM - FORMSUBMIT AJAX
    const contactForm = document.getElementById("contactForm");
    const formNote = document.getElementById("formNote");

    contactForm?.addEventListener("submit", async (event) => {

        // Keep the visitor on the portfolio page.
        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        const originalButtonHTML = submitButton
            ? submitButton.innerHTML
            : "";

        // Show sending message.
        if (formNote) {
            formNote.textContent = "Sending your message...";
            formNote.style.color = "var(--text-muted)";
        }

        // Prevent multiple submissions.
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML =
                'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        }

        try {
            // Collect all form fields.
            const formData = new FormData(contactForm);

            const formObject = Object.fromEntries(
                formData.entries()
            );

            // Use FormSubmit's AJAX endpoint.
            const ajaxURL = contactForm.action.replace(
                "https://formsubmit.co/",
                "https://formsubmit.co/ajax/"
            );

            const response = await fetch(ajaxURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formObject)
            });

            const result = await response.json();

            // Confirm that FormSubmit accepted the submission.
            if (
                !response.ok ||
                !result ||
                !(
                    result.success === true ||
                    result.success === "true"
                )
            ) {
                throw new Error(
                    result?.message || "Form submission failed."
                );
            }

            // SUCCESS MESSAGE
            if (formNote) {
                formNote.textContent =
                    "Your message has been sent successfully!";

                formNote.style.color = "#39c978";
            }

            // Restore the original button.
            if (submitButton) {
                submitButton.innerHTML = originalButtonHTML;
            }

        } catch (error) {

            // FAILURE MESSAGE
            console.error("Contact form error:", error);

            if (formNote) {
                formNote.textContent =
                    "Sorry, your message could not be sent. Please try again.";

                formNote.style.color = "#e05b5b";
            }

            // Allow the visitor to try again.
            if (submitButton) {
                submitButton.innerHTML = originalButtonHTML;
            }

        } finally {

            // Re-enable the button.
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });

});
