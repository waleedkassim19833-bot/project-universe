"use strict";

/* =====================================
   1. عناصر الموقع
===================================== */

const header = document.querySelector(".header");

const filterButtons = document.querySelectorAll(".filter-button");

const projectCards = document.querySelectorAll(".project-card");

const navigationLinks = document.querySelectorAll(".navigation a");

const sections = document.querySelectorAll("main section[id]");

const yearElement = document.getElementById("current-year");


/* =====================================
   2. تصفية المشاريع
===================================== */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // التصنيف الذي اختاره المستخدم
        const selectedCategory = button.dataset.filter;

        // إزالة التحديد من الأزرار
        filterButtons.forEach(function (item) {

            item.classList.remove("active");

        });

        // تحديد الزر الحالي
        button.classList.add("active");

        // إظهار المشاريع المطابقة
        projectCards.forEach(function (card) {

            const projectCategory = card.dataset.category;

            const matches =
                selectedCategory === "all" ||
                selectedCategory === projectCategory;

            if (matches) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

});


/* =====================================
   3. تأثير شريط التنقل
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
   4. تحديد القسم الحالي
===================================== */

function updateActiveNavigation() {

    let currentSection = "";

    const scrollPosition = window.scrollY + 150;

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

        const target = link.getAttribute("href");

        if (target === "#" + currentSection) {

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
   6. فحص صورة البروفايل
===================================== */

const portraitImage = document.querySelector(".portrait-image");

if (portraitImage) {

    portraitImage.addEventListener("error", function () {

        console.error(
            "تعذر تحميل الصورة. تأكد أن اسم الملف هو waleed.jpg"
        );

    });

}


/* =====================================
   7. فحص صور المشاريع
===================================== */

const projectImages = document.querySelectorAll(".project-image img");

projectImages.forEach(function (image) {

    image.addEventListener("error", function () {

        console.warn(
            "تعذر تحميل صورة المشروع:",
            image.src
        );

    });

});


/* =====================================
   8. رسالة تأكيد التشغيل
===================================== */

console.log("تم تشغيل معرض أعمال وليد محمد بنجاح.");

console.log(
    "عدد المشاريع:",
    projectCards.length
);