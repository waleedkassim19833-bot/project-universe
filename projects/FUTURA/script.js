// ========================================
// FUTURA - JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. تحديد عناصر الصفحة

    const header = document.querySelector(".header");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navbar a");

    const contactForm = document.getElementById("contactForm");
    const formNote = document.getElementById("formNote");

    const yearElement = document.getElementById("year");


    // 2. تحديث سنة حقوق النشر تلقائيًا

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // 3. تغيير شكل الهيدر عند التمرير

    function handleScroll() {

        if (header) {
            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

    }

    window.addEventListener("scroll", handleScroll);

    handleScroll();


    // 4. تمييز رابط القسم الحالي

    const sections = document.querySelectorAll("main section[id], body > section[id]");

    function updateActiveLink() {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                currentSection = section.id;
            }

        });

        navLinks.forEach(function (link) {

            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

        });

    }

    window.addEventListener("scroll", updateActiveLink);

    updateActiveLink();


    // 5. التحقق من نموذج التواصل

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            if (formNote) {

                formNote.textContent =
                    "تم التحقق من البيانات، لكن النموذج غير مرتبط بخدمة إرسال فعلية.";

            }

            alert(
                "تم التحقق من البيانات بنجاح!\n\n" +
                "تنبيه: هذا نموذج تجريبي، ولم يتم إرسال البيانات إلى البريد الإلكتروني."
            );

        });

    }


    // 6. رسالة للتأكد من تشغيل JavaScript

    console.log("FUTURA website is ready!");

});