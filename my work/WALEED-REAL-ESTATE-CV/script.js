document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // Smooth Scroll
    // =========================

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    // =========================
    // Navigation Active State
    // =========================

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-content a");

    window.addEventListener("scroll", function () {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }

        });


        navLinks.forEach(function (link) {

            link.style.color = "";

            const href = link.getAttribute("href");

            if (href === "#" + currentSection) {
                link.style.color = "#c6a15b";
            }

        });

    });


    // =========================
    // WhatsApp
    // =========================

    const whatsappButtons =
        document.querySelectorAll(".whatsapp");

    whatsappButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log("فتح واتساب");

        });

    });


    // =========================
    // Contact Buttons Animation
    // =========================

    const cards =
        document.querySelectorAll(
            ".skill-card, .project-card, .education-card"
        );

    cards.forEach(function (card) {

        card.addEventListener("mouseenter", function () {

            this.style.transition = "0.3s";

        });

    });


    // =========================
    // Page Loaded
    // =========================

    document.body.classList.add("loaded");

});
// =====================================
// INTERACTIVE CARDS
// =====================================

const clickableCards =
    document.querySelectorAll(".clickable-card");

const cardModal =
    document.getElementById("cardModal");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");


clickableCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const title =
            card.getAttribute("data-title");

        const text =
            card.getAttribute("data-text");


        modalTitle.textContent = title;

        modalText.textContent = text;


        cardModal.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});


function closeCardModal() {

    cardModal.classList.remove("active");

    document.body.style.overflow = "";

}


modalClose.addEventListener(
    "click",
    closeCardModal
);


cardModal.addEventListener(
    "click",
    function (event) {

        if (event.target === cardModal) {

            closeCardModal();

        }

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeCardModal();

        }

    }
);