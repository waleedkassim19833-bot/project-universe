/* =========================================
   KTY PROJECT UNIVERSE
   Main JavaScript
========================================= */

"use strict";


/* =========================================
   1. CURRENT YEAR
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   2. MOBILE NAVIGATION
========================================= */

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

if (menuButton && navigation) {

    function closeMenu() {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "فتح القائمة");
    }

    menuButton.addEventListener("click", () => {

        const isOpen = navigation.classList.toggle("is-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "إغلاق القائمة" : "فتح القائمة"
        );

    });

    // إغلاق القائمة عند الضغط على أحد الروابط
    navigation.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });

    // إغلاق القائمة عند الضغط خارجها
    document.addEventListener("click", event => {

        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (!clickedInsideNavigation && !clickedMenuButton) {
            closeMenu();
        }

    });

    // إغلاق القائمة عند الانتقال إلى شاشة كبيرة
    window.addEventListener("resize", () => {

        if (window.innerWidth > 820) {
            closeMenu();
        }

    });

}


/* =========================================
   3. PROJECT SEARCH AND FILTERING
========================================= */

const projectCards = Array.from(
    document.querySelectorAll(".project-card")
);

const filterButtons = document.querySelectorAll(".filter-button");
const searchInput = document.getElementById("projectSearch");
const noResults = document.getElementById("noResults");

let currentFilter = "all";
let currentSearch = "";


/*
    توحيد النص العربي لتسهيل البحث.
    مثال:
    "إسلامية" و"اسلامية"
*/

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[أإآ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ـ/g, "")
        .trim();

}


/*
    تحديث المشاريع الظاهرة
*/

function updateProjects() {

    let visibleCount = 0;

    const normalizedSearch = normalizeText(currentSearch);

    projectCards.forEach(card => {

        const category = card.dataset.category || "";

        const projectName = card.dataset.name || "";

        const cardText = normalizeText(
            projectName + " " + card.textContent
        );

        const matchesCategory =
            currentFilter === "all" ||
            category === currentFilter;

        const matchesSearch =
            normalizedSearch === "" ||
            cardText.includes(normalizedSearch);

        const shouldShow =
            matchesCategory && matchesSearch;

        card.classList.toggle("is-hidden", !shouldShow);

        if (shouldShow) {
            visibleCount++;
        }

    });

    // إظهار رسالة عند عدم وجود نتائج
    if (noResults) {

        noResults.hidden = visibleCount !== 0;

    }

}


/* =========================================
   4. FILTER BUTTONS
========================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter || "all";

        // تحديث شكل الزر النشط
        filterButtons.forEach(item => {

            const isActive = item === button;

            item.classList.toggle("active", isActive);

            item.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

        updateProjects();

    });

});


/* =========================================
   5. LIVE SEARCH
========================================= */

if (searchInput) {

    searchInput.addEventListener("input", () => {

        currentSearch = searchInput.value;

        updateProjects();

    });

}


/* =========================================
   6. CATEGORY SHORTCUTS
========================================= */

const categoryJumpLinks = document.querySelectorAll(
    "[data-category-jump]"
);

categoryJumpLinks.forEach(link => {

    link.addEventListener("click", () => {

        const targetCategory = link.dataset.categoryJump;

        const matchingButton = Array.from(filterButtons).find(
            button => button.dataset.filter === targetCategory
        );

        if (matchingButton) {
            matchingButton.click();
        }

    });

});


/* =========================================
   7. ACTIVE NAVIGATION LINKS
========================================= */

const navigationLinks = document.querySelectorAll(
    '.navigation a[href^="#"]'
);

const observedSections = Array.from(navigationLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                navigationLinks.forEach(link => {

                    const isCurrent =
                        link.getAttribute("href") ===
                        "#" + entry.target.id;

                    link.classList.toggle("active", isCurrent);

                });

            });

        },
        {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        }
    );

    observedSections.forEach(section => {
        sectionObserver.observe(section);
    });

}


/* =========================================
   8. INITIALIZE
========================================= */

updateProjects();

console.log("KTY Project Universe is ready.");