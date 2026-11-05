
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

    // 10. CONTACT FORM - AJAX FORMSPREE SUBMISSION
    const contactForm = document.getElementById("contactForm");
    const formNote = document.getElementById("formNote");

    const submitButton = contactForm?.querySelector(
        'button[type="submit"]'
    );

    const originalButtonHTML = submitButton?.innerHTML || "";
    const originalFormNote = formNote?.textContent || "";

    let toastTimer;

    // CUSTOM NOTIFICATION
    function showFormToast(type, title, message) {
        let toast = document.getElementById("formToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "formToast";

            toast.style.cssText = `
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 99999;
                width: min(380px, calc(100vw - 32px));
                padding: 17px;
                display: flex;
                align-items: flex-start;
                gap: 13px;
                background: #151515;
                color: #ffffff;
                border: 1px solid rgba(255,255,255,0.12);
                border-left: 4px solid #ef5f01;
                border-radius: 12px;
                box-shadow: 0 12px 35px rgba(0,0,0,0.25);
                opacity: 0;
                transform: translateY(-12px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                font-family: 'DM Sans', sans-serif;
            `;

            document.body.appendChild(toast);
        }

        clearTimeout(toastTimer);

        toast.innerHTML = "";

        const icon = document.createElement("i");

        icon.className = type === "success"
            ? "fa-solid fa-circle-check"
            : "fa-solid fa-circle-exclamation";

        icon.style.cssText = `
            font-size: 23px;
            margin-top: 2px;
            color: ${type === "success" ? "#22c55e" : "#ef5f01"};
        `;

        const content = document.createElement("div");
        content.style.flex = "1";

        const heading = document.createElement("strong");
        heading.textContent = title;

        heading.style.cssText = `
            display: block;
            font-size: 15px;
            margin-bottom: 5px;
        `;

        const description = document.createElement("p");
        description.textContent = message;

        description.style.cssText = `
            margin: 0;
            color: #c4c4c4;
            font-size: 13px;
            line-height: 1.5;
        `;

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.innerHTML = "&times;";
        closeButton.setAttribute("aria-label", "Close notification");

        closeButton.style.cssText = `
            background: transparent;
            border: none;
            color: #aaaaaa;
            font-size: 22px;
            cursor: pointer;
            padding: 0 3px;
        `;

        closeButton.addEventListener("click", () => {
            clearTimeout(toastTimer);
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-12px)";
        });

        content.append(heading, description);
        toast.append(icon, content, closeButton);

        toast.setAttribute(
            "role",
            type === "success" ? "status" : "alert"
        );

        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";

        toastTimer = setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-12px)";
        }, 5000);
    }

    // SUBMIT FORM WITHOUT LEAVING THE HOMEPAGE
    contactForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML =
                'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        }

        if (formNote) {
            formNote.textContent = "Sending your message...";
        }

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    "Accept": "application/json"
                }
            });

            let result = {};

            try {
                result = await response.json();
            } catch (error) {
                result = {};
            }

            if (response.ok) {
                contactForm.reset();

                showFormToast(
                    "success",
                    "Message sent successfully!",
                    "Thank you for reaching out. I'll get back to you soon."
                );

                if (formNote) {
                    formNote.textContent = originalFormNote;
                }

            } else {
                const errorMessage = result.errors
                    ?.map(error => error.message)
                    .join(", ") ||
                    "Your message could not be sent. Please try again.";

                showFormToast(
                    "error",
                    "Message not sent",
                    errorMessage
                );

                if (formNote) {
                    formNote.textContent =
                        "Please try sending your message again.";
                }
            }

        } catch (error) {
            showFormToast(
                "error",
                "Connection error",
                "Please check your internet connection and try again."
            );

            if (formNote) {
                formNote.textContent =
                    "There was a problem sending your message.";
            }

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        }
    });

});
