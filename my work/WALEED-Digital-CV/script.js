document.addEventListener("DOMContentLoaded", function () {

    const slider = document.getElementById("languageSlider");

    if (!slider) {
        console.log("Language slider not found");
        return;
    }

    function changeLanguage(language) {

        if (language === "ar") {

            // اتجاه الصفحة
            document.documentElement.lang = "ar";
            document.documentElement.dir = "rtl";
            document.body.classList.add("arabic");

            // تغيير النصوص الموجودة في الصفحة
            document.querySelectorAll("[data-en][data-ar]").forEach(function (element) {
                element.textContent = element.getAttribute("data-ar");
            });

            // تغيير الشعار
            document.querySelectorAll(".logo-en").forEach(function (logo) {
                logo.style.display = "none";
            });

            document.querySelectorAll(".logo-ar").forEach(function (logo) {
                logo.style.display = "flex";
            });

            localStorage.setItem("language", "ar");

        } else {

            // اتجاه الصفحة
            document.documentElement.lang = "en";
            document.documentElement.dir = "ltr";
            document.body.classList.remove("arabic");

            // تغيير النصوص
            document.querySelectorAll("[data-en][data-ar]").forEach(function (element) {
                element.textContent = element.getAttribute("data-en");
            });

            // تغيير الشعار
            document.querySelectorAll(".logo-ar").forEach(function (logo) {
                logo.style.display = "none";
            });

            document.querySelectorAll(".logo-en").forEach(function (logo) {
                logo.style.display = "flex";
            });

            localStorage.setItem("language", "en");
        }
    }

    // عند تحريك السويتش
    slider.addEventListener("input", function () {

        if (this.value === "1") {
            changeLanguage("ar");
        } else {
            changeLanguage("en");
        }

    });

    // اللغة المحفوظة
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "ar") {
        slider.value = "1";
        changeLanguage("ar");
    } else {
        slider.value = "0";
        changeLanguage("en");
    }

});