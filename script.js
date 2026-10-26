/* =========================================
   KTY PROJECT UNIVERSE
   Main JavaScript
========================================= */

"use strict";

/* ---------- SELECT ELEMENTS ---------- */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

const searchInput = document.querySelector(".search-box input");

const projectCards = document.querySelectorAll(".project-card");

const projectsGrid = document.querySelector(".projects-grid");

const projectCounter = document.querySelector(".projects-counter");

const toast = document.querySelector(".toast");

const backToTop = document.querySelector(".back-to-top");


/* ---------- MOBILE MENU ---------- */

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {

        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.textContent = isOpen ? "×" : "☰";

    });


    // Close the menu after selecting a navigation link

    const navLinks = mainNav.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mainNav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.textContent = "☰";

        });

    });


    // Close the menu when clicking outside it

    document.addEventListener("click", function (event) {

        const clickedInsideMenu = mainNav.contains(event.target);

        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {

            mainNav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.textContent = "☰";

        }

    });

}


/* ---------- PROJECT SEARCH ---------- */

function filterProjects() {

    if (!searchInput || projectCards.length === 0) {
        return;
    }

    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    let visibleCount = 0;


    projectCards.forEach(function (card) {

        const searchableText = card.textContent
            .toLowerCase();

        const matches = searchableText.includes(searchTerm);

        card.hidden = !matches;

        if (matches) {
            visibleCount++;
        }

    });


    // Update the project count

    if (projectCounter) {

        if (searchTerm === "") {

            projectCounter.textContent =
                "06 مشاريع";

        } else {

            projectCounter.textContent =
                visibleCount + " نتائج";

        }

    }


    // Display a message when no projects match

    if (projectsGrid) {

        let noResults = document.querySelector(".no-results");

        if (visibleCount === 0) {

            if (!noResults) {

                noResults = document.createElement("div");

                noResults.className = "no-results";

                noResults.textContent =
                    "لم نعثر على مشروع بهذا الاسم. جرّب كلمة أخرى.";

                projectsGrid.insertAdjacentElement(
                    "afterend",
                    noResults
                );

            }

            noResults.hidden = false;

        } else if (noResults) {

            noResults.hidden = true;

        }

    }

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProjects
    );

}


/* ---------- TOAST MESSAGE ---------- */

let toastTimer;


function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


/* ---------- PROJECT BUTTONS ---------- */

projectCards.forEach(function (card) {

    const projectButton = card.querySelector(
        ".project-button"
    );

    if (!projectButton) {
        return;
    }

    projectButton.addEventListener("click", function (event) {

        const destination = projectButton.getAttribute("href");

        // Allow normal navigation to valid project pages

        if (
            destination &&
            destination !== "#" &&
            !destination.startsWith("javascript:")
        ) {

            return;

        }

        event.preventDefault();

        const projectNameElement = card.querySelector("h3");

        const projectName = projectNameElement
            ? projectNameElement.textContent.trim()
            : "هذا المشروع";

        showToast(
            projectName +
            " — تأكد من إضافة صفحة المشروع إلى مجلد projects."
        );

    });

});


/* ---------- FUTURE PROJECTS ---------- */

const futureMiniCards = document.querySelectorAll(
    ".future-mini-card"
);


futureMiniCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const projectNameElement = card.querySelector("h4");

        const projectName = projectNameElement
            ? projectNameElement.textContent.trim()
            : "المشروع القادم";

        showToast(
            projectName + " — سيتم الإعلان عنه عند اكتماله."
        );

    });

});


/* ---------- SMOOTH SCROLL ---------- */

document.querySelectorAll('a[href^="#"]').forEach(
    function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }
);


/* ---------- ACTIVE NAVIGATION ---------- */

const sections = document.querySelectorAll(
    "section[id]"
);


if ("IntersectionObserver" in window && sections.length > 0) {

    const sectionObserver = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (!entry.isIntersecting) {
                    return;
                }

                const sectionId = entry.target.id;

                document.querySelectorAll(".nav-link").forEach(
                    function (link) {

                        const linkTarget = link.getAttribute("href");

                        link.classList.toggle(
                            "active",
                            linkTarget === "#" + sectionId
                        );

                    }
                );

            });

        },
        {
            rootMargin: "-30% 0px -55% 0px",
            threshold: 0
        }
    );


    sections.forEach(function (section) {

        sectionObserver.observe(section);

    });

}


/* ---------- REVEAL ANIMATIONS ---------- */

const revealElements = document.querySelectorAll(
    ".project-card, " +
    ".future-main-card, " +
    ".future-mini-card, " +
    ".about-visual, " +
    ".about-content, " +
    ".feature-item, " +
    ".contact-panel"
);


if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

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


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(function (element) {

        element.classList.add("visible");

    });

}


/* ---------- BACK TO TOP ---------- */

if (backToTop) {

    backToTop.addEventListener("click", function (event) {

        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* ---------- CURRENT YEAR ---------- */

const currentYear = document.querySelector("#current-year");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* ---------- HEADER SCROLL EFFECT ---------- */

const header = document.querySelector(".main-header");


if (header) {

    let scrollScheduled = false;

    window.addEventListener("scroll", function () {

        if (scrollScheduled) {
            return;
        }

        scrollScheduled = true;

        window.requestAnimationFrame(function () {

            if (window.scrollY > 30) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

            scrollScheduled = false;

        });

    }, {
        passive: true
    });

}


/* ---------- INITIALIZE ---------- */

document.addEventListener("DOMContentLoaded", function () {

    // Ensure all project cards start visible

    projectCards.forEach(function (card) {

        card.hidden = false;

    });


    // Set the initial project count

    if (projectCounter && projectCards.length > 0) {

        projectCounter.textContent =
            projectCards.length + " مشاريع";

    }


    console.log(
        "KTY Project Universe initialized successfully."
    );

});
// ========================================
// KTY PROJECT UNIVERSE — PROJECT LINKING
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    const projectLinks = {
        "KTY": "projects/KTY/index.html",
        "FUTURA": "projects/FUTURA/index.html",
        "Islamic Encyclopedia": "projects/Islamic%20Encyclopedia/index.html",
        "MyCar": "projects/MyCar/index.html",
        "Rakmry": "projects/Rakmry/index.html",
        "WALEED-REAL-ESTATE-CV": "projects/WALEED-REAL-ESTATE-CV/index.html"
    };

    document.querySelectorAll("a").forEach(function (link) {
        const text = link.innerText.trim().toLowerCase();

        if (text.includes("kty") && text.includes("دخول")) {
            link.href = projectLinks["KTY"];
        }

        if (text.includes("futura") && text.includes("دخول")) {
            link.href = projectLinks["FUTURA"];
        }

        if (
            text.includes("islamic encyclopedia") &&
            text.includes("دخول")
        ) {
            link.href = projectLinks["Islamic Encyclopedia"];
        }

        if (
            (text.includes("my car") || text.includes("mycar")) &&
            text.includes("دخول")
        ) {
            link.href = projectLinks["MyCar"];
        }

        if (text.includes("rakmry") && text.includes("دخول")) {
            link.href = projectLinks["Rakmry"];
        }

        if (
            text.includes("real estate") &&
            text.includes("دخول")
        ) {
            link.href = projectLinks["WALEED-REAL-ESTATE-CV"];
        }
    });
});