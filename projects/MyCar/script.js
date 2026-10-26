const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* 1. شاشة البداية */
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = $("#intro");
    if (intro) intro.classList.add("hide");
  }, 1400);
});

/* احتياط إذا تأخر تحميل الصور أو الخطوط */
setTimeout(() => {
  const intro = $("#intro");
  if (intro) intro.classList.add("hide");
}, 3500);

/* 2. تبديل اللغة العربية والإنجليزية */
let currentLanguage = "ar";

$("#languageButton").addEventListener("click", () => {
  currentLanguage = currentLanguage === "ar" ? "en" : "ar";

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir =
    currentLanguage === "ar" ? "rtl" : "ltr";

  $("#languageButton").textContent =
    currentLanguage === "ar" ? "EN" : "عربي";

  $$("[data-ar][data-en]").forEach((element) => {
    element.innerHTML = element.dataset[currentLanguage];
  });
});

/* 3. قائمة الهاتف */
$("#menuButton").addEventListener("click", () => {
  $("#nav").classList.toggle("open");
});

$$(".navbar nav a").forEach((link) => {
  link.addEventListener("click", () => {
    $("#nav").classList.remove("open");
  });
});

/* 4. تصفية السيارات حسب الفئة */
$$(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".filter").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const selectedCategory = button.dataset.filter;

    $$(".car-card").forEach((car) => {
      const matches =
        selectedCategory === "all" ||
        car.dataset.category === selectedCategory;

      car.classList.toggle("hidden", !matches);
    });
  });
});

/* 5. بيانات السيارات */
const carData = {
  cullinan: {
    title: "رولز رويس كولينان",
    brand: "ROLLS-ROYCE",
    description: "سيارة SUV فاخرة تتميز بالحضور القوي والراحة.",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85"
  },

  continental: {
    title: "بنتلي كونتيننتال GT",
    brand: "BENTLEY",
    description: "كوبيه فاخرة تجمع بين التصميم الرياضي والأناقة.",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85"
  },

  phantom: {
    title: "رولز رويس فانتوم",
    brand: "ROLLS-ROYCE",
    description: "سيدان فاخرة تركز على الهدوء والحرفية.",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85"
  },

  flying: {
    title: "بنتلي فلاينغ سبير",
    brand: "BENTLEY",
    description: "سيدان تنفيذية تجمع بين الأناقة والأداء المتوازن.",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=85"
  }
};

/* 6. فتح نافذة تفاصيل السيارة */
function openCarDetails(carKey) {
  const car = carData[carKey];

  if (!car) return;

  $("#modalImage").src = car.image;
  $("#modalImage").alt = car.title;
  $("#modalBrand").textContent = car.brand;
  $("#modalTitle").textContent = car.title;
  $("#modalDescription").textContent = car.description;

  $("#carModal").classList.add("open");
  $("#carModal").setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

function closeCarDetails() {
  $("#carModal").classList.remove("open");
  $("#carModal").setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

$$("[data-car]").forEach((button) => {
  button.addEventListener("click", () => {
    openCarDetails(button.dataset.car);
  });
});

$("#modalClose").addEventListener("click", closeCarDetails);
$("#modalBackdrop").addEventListener("click", closeCarDetails);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCarDetails();
  }
});

/* 7. الانتقال من النافذة إلى التواصل */
$("#modalContact").addEventListener("click", () => {
  closeCarDetails();

  setTimeout(() => {
    $("#contact").scrollIntoView({
      behavior: "smooth"
    });
  }, 100);
});

/* 8. نموذج التواصل التجريبي */
$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  $("#formMessage").textContent =
    currentLanguage === "ar"
      ? "تم التحقق من البيانات بنجاح. هذا نموذج تجريبي ولا يرسل البيانات."
      : "Your information was validated. This demo does not send data.";

  form.reset();
});

/* 9. ظهور العناصر تدريجيًا */
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$(".intro-section, .collection-heading, .car-card, .feature-content, .contact-section")
    .forEach((element) => observer.observe(element));
}

/* 10. رسالة صغيرة عند استخدام أزرار التفاصيل */
const style = document.createElement("style");
style.textContent = `
  .car-card.hidden {
    display: none !important;
  }

  .intro.hide {
    pointer-events: none;
  }
`;
document.head.appendChild(style);