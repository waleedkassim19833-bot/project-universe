"use strict";

// تحديث السنة تلقائيًا
const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// تمييز القسم الذي يتصفحه الزائر
const navigationLinks = document.querySelectorAll(".navigation a");

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navigationLinks.forEach((item) => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});