/* =========================================
   NEXA — JavaScript
   التفاعلات والوظائف
========================================= */

"use strict";


/* =========================================
   1. قائمة التنقل للجوال
========================================= */

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

if (menuButton && navigation) {

    // فتح القائمة وإغلاقها
    menuButton.addEventListener("click", function () {

        const isOpen = navigation.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));

        menuButton.textContent = isOpen ? "✕" : "☰";

    });


    // إغلاق القائمة عند الضغط على أحد الروابط
    const navigationLinks = navigation.querySelectorAll("a");

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navigation.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");

            menuButton.textContent = "☰";

        });

    });


    // إغلاق القائمة عند الضغط خارجها
    document.addEventListener("click", function (event) {

        const clickedInsideMenu = navigation.contains(event.target);

        const clickedButton = menuButton.contains(event.target);

        if (!clickedInsideMenu && !clickedButton) {

            navigation.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");

            menuButton.textContent = "☰";

        }

    });


    // إغلاق القائمة إذا انتقل المستخدم إلى شاشة كبيرة
    window.addEventListener("resize", function () {

        if (window.innerWidth > 900) {

            navigation.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");

            menuButton.textContent = "☰";

        }

    });

}


/* =========================================
   2. نموذج التواصل عبر واتساب
========================================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        // منع الصفحة من إعادة التحميل
        event.preventDefault();


        // قراءة بيانات العميل
        const clientName = document
            .getElementById("clientName")
            .value
            .trim();

        const clientService = document
            .getElementById("clientService")
            .value
            .trim();

        const clientMessage = document
            .getElementById("clientMessage")
            .value
            .trim();


        // التحقق من إدخال البيانات
        if (!clientName || !clientService || !clientMessage) {

            alert("فضلاً، أكمل جميع الحقول قبل المتابعة.");

            return;

        }


        // رقم واتساب صاحب الموقع
        // الرقم السعودي 0543676979
        // بصيغة واتساب الدولية: 966543676979

        const whatsappNumber = "966543676979";


        // إنشاء رسالة العميل
        const message =
            "السلام عليكم ورحمة الله وبركاته\n\n" +
            "أرغب في التواصل مع NEXA بخصوص خدماتكم.\n\n" +
            "اسم العميل: " + clientName + "\n" +
            "الخدمة المطلوبة: " + clientService + "\n" +
            "تفاصيل المشروع: " + clientMessage + "\n\n" +
            "أرجو التواصل معي لمناقشة التفاصيل.\n\n" +
            "شكراً لكم.";


        // تجهيز رابط واتساب
        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);


        // فتح واتساب برسالة جاهزة
        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    });

}


/* =========================================
   3. تحديث السنة تلقائياً
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}


/* =========================================
   4. تأثير الظهور التدريجي
========================================= */

const animatedElements = document.querySelectorAll(
    ".service-card, " +
    ".solution-card, " +
    ".data-card, " +
    ".steps article, " +
    ".portfolio-card"
);


if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(

        function (entries, observerInstance) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    observerInstance.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12
        }

    );


    animatedElements.forEach(function (element) {

        element.classList.add("reveal");

        observer.observe(element);

    });

}


/* =========================================
   5. تفاعل بطاقات الخدمات
========================================= */

const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach(function (card) {

    card.addEventListener("mouseenter", function () {

        card.classList.add("is-active");

    });

    card.addEventListener("mouseleave", function () {

        card.classList.remove("is-active");

    });

});


/* =========================================
   6. إظهار السنة ورسالة التشغيل
========================================= */

console.log(
    "%c NEXA ",
    "background:#0b1c2b;color:#e5b965;font-size:22px;font-weight:bold;padding:8px;"
);

console.log(
    "تم تحميل JavaScript الخاص بموقع NEXA."
);