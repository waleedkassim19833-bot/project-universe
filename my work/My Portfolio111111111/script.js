"use strict";

/* =====================================
   1. عناصر الصفحة
===================================== */

const header = document.querySelector(".header");

const filterButtons = document.querySelectorAll(".filter-button");

const projectCards = document.querySelectorAll(".project-card");

const navigationLinks = document.querySelectorAll(".navigation a");

const sections = document.querySelectorAll("main section[id]");

const yearElement = document.getElementById("current-year");


/* =====================================
   2. تصفية المشاريع حسب المجال
===================================== */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // معرفة التصنيف الذي اختاره المستخدم
        const selectedCategory = button.dataset.filter;

        // إزالة التحديد من جميع الأزرار
        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        // تحديد الزر المختار
        button.classList.add("active");

        // إظهار المشاريع المناسبة
        projectCards.forEach(function (card) {

            const projectCategory = card.dataset.category;

            const shouldShow =
                selectedCategory === "all" ||
                selectedCategory === projectCategory;

            if (shouldShow) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


/* =====================================
   3. تأثير شريط التنقل عند التمرير
===================================== */

function updateHeader() {

    if (!header) {
        return;
    }

    if (window.scrollY > 30) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =====================================
   4. تحديد القسم الذي يتصفحه المستخدم
===================================== */

function updateActiveNavigation() {

    let currentSection = "";

    const scrollPosition = window.scrollY + 160;

    sections.forEach(function (section) {

        const sectionTop = section.offsetTop;

        const sectionBottom =
            sectionTop + section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {

            currentSection = section.id;

        }

    });

    navigationLinks.forEach(function (link) {

        const linkTarget = link.getAttribute("href");

        if (linkTarget === "#" + currentSection) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });

}

window.addEventListener("scroll", updateActiveNavigation, {
    passive: true
});

window.addEventListener("load", updateActiveNavigation);


/* =====================================
   5. تحديث السنة تلقائيًا
===================================== */

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}


/* =====================================
   6. التأكد من تحميل صور المشاريع
===================================== */

const projectImages = document.querySelectorAll(".project-image img");

projectImages.forEach(function (img) {

    img.addEventListener("error", function () {

        console.warn(
            "تعذر تحميل صورة المشروع:",
            img.src
        );

    });

});


/* =====================================
   7. رسالة نجاح تشغيل الموقع
===================================== */

console.log(
    "Portfolio loaded successfully!"
);

console.log(
    "عدد بطاقات المشاريع:",
    projectCards.length
);