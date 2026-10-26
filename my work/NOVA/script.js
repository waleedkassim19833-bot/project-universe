document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. LOADER
    ========================= */

    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = "0";
                loader.style.pointerEvents = "none";

                setTimeout(() => {
                    loader.style.display = "none";
                }, 700);
            }
        }, 1500);
    });


    /* =========================
       2. NAVBAR
    ========================= */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    });


    /* =========================
       3. MOBILE MENU
    ========================= */

    const menuButton = document.getElementById("menuButton");
    const navLinks = document.querySelector(".nav-links");

    menuButton?.addEventListener("click", () => {
        navLinks?.classList.toggle("open");
        menuButton.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks?.classList.remove("open");
            menuButton?.classList.remove("active");
        });
    });


    /* =========================
       4. SMOOTH SCROLL
    ========================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

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


    /* =========================
       5. SECTION REVEAL
    ========================= */

    const revealElements = document.querySelectorAll(
        ".section, .final-section"
    );

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }

            });

        },
        {
            threshold: 0.15
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =========================
       6. EXPLORE BUTTON
    ========================= */

    const exploreButton = document.getElementById("exploreButton");
    const vehicleSection = document.getElementById("vehicle");

    exploreButton?.addEventListener("click", () => {

        vehicleSection?.scrollIntoView({
            behavior: "smooth"
        });

    });


    /* =========================
       7. TECHNOLOGY MODAL
    ========================= */

    const techModal = document.getElementById("techModal");
    const modalClose = document.getElementById("modalClose");
    const modalKicker = document.getElementById("modalKicker");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");

    const technologyData = {

        ai: {
            kicker: "INTELLIGENCE",
            title: "NOVA AI",
            description:
                "An intelligent driving system designed to continuously understand the vehicle, environment and driver."
        },

        battery: {
            kicker: "ENERGY",
            title: "NEXT-GEN BATTERY",
            description:
                "Advanced energy architecture engineered to deliver long range, rapid performance and intelligent power management."
        },

        vision: {
            kicker: "PERCEPTION",
            title: "VISION SYSTEM",
            description:
                "A connected sensor system designed to perceive the road, surrounding environment and potential obstacles."
        },

        connect: {
            kicker: "CONNECTIVITY",
            title: "NOVA CONNECT",
            description:
                "A digital ecosystem connecting the vehicle, driver and smart devices through one seamless experience."
        }

    };


    document.querySelectorAll(".tech-card").forEach(card => {

        card.addEventListener("click", () => {

            const type = card.dataset.tech;
            const data = technologyData[type];

            if (!data) return;

            modalKicker.textContent = data.kicker;
            modalTitle.textContent = data.title;
            modalDescription.textContent = data.description;

            techModal.classList.add("active");

            document.body.style.overflow = "hidden";
        });

    });


    function closeModal() {

        techModal?.classList.remove("active");

        document.body.style.overflow = "";

    }


    modalClose?.addEventListener("click", closeModal);


    techModal?.addEventListener("click", event => {

        if (event.target === techModal) {
            closeModal();
        }

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeModal();
        }

    });


    /* =========================
       8. DESIGN EXPERIENCE
    ========================= */

    const designButton = document.getElementById("designButton");
    const designSection = document.getElementById("design");

    designButton?.addEventListener("click", () => {

        designSection?.classList.add("design-active");

        designButton.textContent = "EXPERIENCE ACTIVATED";

        setTimeout(() => {
            designButton.textContent = "EXPLORE DESIGN";
        }, 1800);

    });


    /* =========================
       9. EXPERIENCE BUTTON
    ========================= */

    const contactButton = document.getElementById("contactButton");

    contactButton?.addEventListener("click", () => {

        const message = document.createElement("div");

        message.className = "nova-notification";

        message.innerHTML = `
            <strong>NOVA EXPERIENCE</strong>
            <span>The future of motion starts here.</span>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.classList.add("show");
        }, 50);

        setTimeout(() => {
            message.classList.remove("show");

            setTimeout(() => {
                message.remove();
            }, 500);

        }, 3000);

    });


    /* =========================
       10. SCROLL PROGRESS
    ========================= */

    const progress = document.createElement("div");

    progress.id = "scroll-progress";

    document.body.appendChild(progress);


    function updateProgress() {

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progress.style.width = `${percentage}%`;

    }

    window.addEventListener("scroll", updateProgress);

    updateProgress();


    /* =========================
       11. CINEMATIC CURSOR
    ========================= */

    if (window.innerWidth > 900) {

        const cursorDot = document.createElement("div");
        const cursorGlow = document.createElement("div");

        cursorDot.id = "cursor-dot";
        cursorGlow.id = "cursor-glow";

        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorGlow);

        document.addEventListener("mousemove", event => {

            cursorDot.style.left = `${event.clientX}px`;
            cursorDot.style.top = `${event.clientY}px`;

            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;

        });

        document.querySelectorAll("button, a, .tech-card").forEach(element => {

            element.addEventListener("mouseenter", () => {
                cursorGlow.classList.add("cursor-active");
            });

            element.addEventListener("mouseleave", () => {
                cursorGlow.classList.remove("cursor-active");
            });

        });

    }


    /* =========================
       12. DYNAMIC EFFECT STYLES
    ========================= */

    const dynamicStyles = document.createElement("style");

    dynamicStyles.textContent = `

        /* Navbar scroll */

        .navbar.scrolled {
            background: rgba(0, 0, 0, 0.78);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }


        /* Mobile menu */

        @media (max-width: 900px) {

            .nav-links.open {
                display: flex;
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

        }


        /* Technology modal */

        #techModal {
            opacity: 0;
            visibility: hidden;
            transition:
                opacity 0.4s ease,
                visibility 0.4s ease;
        }

        #techModal.active {
            opacity: 1;
            visibility: visible;
        }


        /* Design interaction */

        .design-active .design-visual {
            transform: scale(1.04);
        }


        /* Notification */

        .nova-notification {
            position: fixed;
            right: 30px;
            bottom: 30px;
            z-index: 9999;

            display: flex;
            flex-direction: column;
            gap: 6px;

            padding: 18px 22px;

            background: rgba(10, 10, 12, 0.92);
            border: 1px solid rgba(255,255,255,0.15);
            border-left: 2px solid #00d9ff;

            backdrop-filter: blur(20px);

            transform: translateY(30px);
            opacity: 0;

            transition:
                transform 0.5s ease,
                opacity 0.5s ease;
        }

        .nova-notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .nova-notification strong {
            font-size: 12px;
            letter-spacing: 3px;
            color: #ffffff;
        }

        .nova-notification span {
            font-size: 12px;
            color: #8d8d95;
        }


        /* Scroll progress */

        #scroll-progress {
            position: fixed;
            top: 0;
            left: 0;

            width: 0%;
            height: 2px;

            background: #00d9ff;

            z-index: 10000;

            box-shadow:
                0 0 12px rgba(0,217,255,0.8);
        }


        /* Cinematic cursor */

        #cursor-dot {
            position: fixed;

            width: 5px;
            height: 5px;

            border-radius: 50%;

            background: #ffffff;

            pointer-events: none;

            transform: translate(-50%, -50%);

            z-index: 10001;
        }


        #cursor-glow {
            position: fixed;

            width: 32px;
            height: 32px;

            border: 1px solid rgba(0,217,255,0.45);

            border-radius: 50%;

            pointer-events: none;

            transform: translate(-50%, -50%);

            z-index: 10000;

            transition:
                width 0.25s ease,
                height 0.25s ease,
                border-color 0.25s ease;
        }


        #cursor-glow.cursor-active {
            width: 52px;
            height: 52px;
            border-color: rgba(0,217,255,0.9);
        }


        @media (max-width: 900px) {

            #cursor-dot,
            #cursor-glow {
                display: none;
            }

            .nova-notification {
                right: 15px;
                left: 15px;
                bottom: 20px;
            }

        }

    `;

    document.head.appendChild(dynamicStyles);


    /* =========================
       13. HERO PARALLAX
    ========================= */

    const hero = document.querySelector(".hero");

    if (hero && window.innerWidth > 900) {

        hero.addEventListener("mousemove", event => {

            const rect = hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            const car = document.querySelector(".hero-car");

            if (car) {

                car.style.setProperty(
                    "--mouse-x",
                    `${x * 12}px`
                );

                car.style.setProperty(
                    "--mouse-y",
                    `${y * 8}px`
                );

            }

        });

    }


    console.log("NOVA EXPERIENCE INITIALIZED 🚀");

});

/* =========================================
   NOVA — SCROLL SCENE TRANSITION
========================================= */

const heroSection = document.querySelector(".hero");
const vehicleVisual = document.querySelector(".vehicle-visual");
const vehicleContent = document.querySelector(".vehicle-content");

function updateCinematicScene() {

    if (!heroSection) return;

    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;

    /*
       نحسب نسبة خروجنا من الـ Hero
       0 = بداية الصفحة
       1 = نهاية الـ Hero
    */

    let progress = scrollY / heroHeight;

    progress = Math.max(0, Math.min(progress, 1));


    /* =====================================
       HERO — CAMERA MOVEMENT
    ===================================== */

    const heroCar = document.querySelector(".hero-car");

    if (heroCar) {

        const moveX = progress * -80;
        const moveY = progress * -30;
        const scale = 1 - progress * 0.12;
        const rotate = progress * -2;

        heroCar.style.transform = `
            translate(${moveX}px, ${moveY}px)
            scale(${scale})
            rotate(${rotate}deg)
        `;

        heroCar.style.opacity = `${1 - progress * 0.75}`;

    }


    /* =====================================
       HERO CONTENT — FADES AWAY
    ===================================== */

    const heroContent = document.querySelector(".hero-content");

    if (heroContent) {

        heroContent.style.opacity =
            `${1 - progress * 1.4}`;

        heroContent.style.transform =
            `translateY(${progress * -40}px)`;

    }


    /* =====================================
       HERO GLOW — CAMERA DEPTH
    ===================================== */

    const heroGlow = document.querySelector(".hero-glow");

    if (heroGlow) {

        heroGlow.style.transform =
            `scale(${1 + progress * 0.35})`;

        heroGlow.style.opacity =
            `${0.7 - progress * 0.6}`;

    }


    /* =====================================
       VEHICLE SCENE
    ===================================== */

    if (vehicleVisual) {

        const vehicleProgress =
            Math.max(0, Math.min((progress - 0.35) * 2.5, 1));

        vehicleVisual.style.transform = `
            translateY(${50 - vehicleProgress * 50}px)
            scale(${0.82 + vehicleProgress * 0.18})
        `;

        vehicleVisual.style.opacity =
            `${vehicleProgress}`;

    }


    /* =====================================
       VEHICLE TEXT
    ===================================== */

    if (vehicleContent) {

        const contentProgress =
            Math.max(0, Math.min((progress - 0.48) * 3, 1));

        vehicleContent.style.transform =
            `translateY(${40 - contentProgress * 40}px)`;

        vehicleContent.style.opacity =
            `${contentProgress}`;

    }

}


/* =========================================
   RUN ON SCROLL
========================================= */

window.addEventListener(
    "scroll",
    updateCinematicScene,
    { passive: true }
);


/* =========================================
   INITIAL STATE
========================================= */

updateCinematicScene();
/* =========================================
   NOVA — INTERACTIVE VEHICLE DEPTH
========================================= */

const vehicleScene = document.querySelector(".vehicle-visual");

if (vehicleScene && window.innerWidth > 900) {

    vehicleScene.addEventListener("mousemove", (event) => {

        const rect = vehicleScene.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) / rect.width - 0.5;

        const y =
            (event.clientY - rect.top) / rect.height - 0.5;


        /* العنصر الرئيسي */

        vehicleScene.style.transform = `
            perspective(1000px)
            rotateY(${x * 8}deg)
            rotateX(${y * -6}deg)
            translateY(0)
        `;


        /* الضوء */

        const glow =
            vehicleScene.querySelector(".vehicle-glow");

        if (glow) {

            glow.style.transform = `
                translate(${x * 35}px, ${y * 25}px)
                scale(1.05)
            `;

        }


        /* المدار */

        const orbit =
            vehicleScene.querySelector(".vehicle-orbit");

        if (orbit) {

            orbit.style.transform = `
                translate(${x * 15}px, ${y * 10}px)
                rotate(${x * 12}deg)
            `;

        }

    });


    /* العودة للوضع الطبيعي */

    vehicleScene.addEventListener("mouseleave", () => {

        vehicleScene.style.transform = `
            perspective(1000px)
            rotateY(0deg)
            rotateX(0deg)
            translateY(0)
        `;

        const glow =
            vehicleScene.querySelector(".vehicle-glow");

        if (glow) {
            glow.style.transform =
                "translate(0, 0) scale(1)";
        }

        const orbit =
            vehicleScene.querySelector(".vehicle-orbit");

        if (orbit) {
            orbit.style.transform =
                "translate(0, 0) rotate(0deg)";
        }

    });

}

/* =========================================
   NOVA — TECHNOLOGY CINEMATIC INTERACTION
========================================= */

const techCards = document.querySelectorAll(".tech-card");
const techSection = document.getElementById("technology");

techCards.forEach((card) => {

    card.addEventListener("click", () => {

        /* إضاءة البطاقة المختارة */

        techCards.forEach((item) => {
            item.classList.remove("tech-selected");
        });

        card.classList.add("tech-selected");


        /* تأثير على مشهد Technology */

        if (techSection) {

            techSection.classList.add("tech-scene-active");

            setTimeout(() => {
                techSection.classList.remove("tech-scene-active");
            }, 900);

        }


        /* نبضة سينمائية */

        const pulse = document.createElement("div");

        pulse.className = "tech-pulse";

        document.body.appendChild(pulse);

        setTimeout(() => {
            pulse.classList.add("active");
        }, 20);

        setTimeout(() => {
            pulse.remove();
        }, 900);

    });

});

/* =========================================
   NOVA — MORPH / PARTICLE TRANSITION
========================================= */

function createNovaParticles() {

    const container = document.createElement("div");

    container.className = "nova-particles";

    document.body.appendChild(container);


    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {

        const particle = document.createElement("span");

        particle.className = "nova-particle";

        const angle = Math.random() * Math.PI * 2;
        const distance = 120 + Math.random() * 380;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.setProperty(
            "--x",
            `${x}px`
        );

        particle.style.setProperty(
            "--y",
            `${y}px`
        );

        particle.style.setProperty(
            "--delay",
            `${Math.random() * 0.35}s`
        );

        particle.style.setProperty(
            "--size",
            `${1 + Math.random() * 3}px`
        );

        container.appendChild(particle);
    }


    requestAnimationFrame(() => {
        container.classList.add("active");
    });


    setTimeout(() => {

        container.classList.remove("active");

        setTimeout(() => {
            container.remove();
        }, 900);

    }, 1000);
}


/* =========================================
   TRIGGER MORPH
========================================= */

/* =====================================================
   NOVA — REAL PARTICLE CAR
   First Cinematic Experiment
===================================================== */

(() => {

    const hero = document.querySelector(".hero");
    const explore = document.getElementById("exploreButton");

    if (!hero) return;

    /* ---------- Canvas ---------- */

    const canvas = document.createElement("canvas");

    canvas.className = "nova-particle-canvas";

    hero.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;

    let particles = [];

    let mouseX = 0;
    let mouseY = 0;

    let mouseActive = false;

    let animationStart = performance.now();

    let exploded = false;


    /* ---------- Canvas Style ---------- */

    Object.assign(canvas.style, {

        position: "absolute",

        inset: "0",

        width: "100%",

        height: "100%",

        zIndex: "3",

        pointerEvents: "none",

        opacity: "1"

    });


    /* ---------- Resize ---------- */

    function resizeCanvas() {

        const rect =
            hero.getBoundingClientRect();

        width = canvas.width =
            Math.floor(rect.width * window.devicePixelRatio);

        height = canvas.height =
            Math.floor(rect.height * window.devicePixelRatio);

        canvas.style.width =
            `${rect.width}px`;

        canvas.style.height =
            `${rect.height}px`;

        ctx.setTransform(
            window.devicePixelRatio,
            0,
            0,
            window.devicePixelRatio,
            0,
            0
        );

        width = rect.width;
        height = rect.height;

        createParticleTargets();

    }


    /* ---------- Draw Car Shape ---------- */

    function createParticleTargets() {

        const offscreen =
            document.createElement("canvas");

        offscreen.width = 900;
        offscreen.height = 420;

        const octx =
            offscreen.getContext("2d");

        octx.clearRect(
            0,
            0,
            900,
            420
        );


        /* Body */

        octx.beginPath();

        octx.moveTo(90, 285);

        octx.lineTo(145, 245);

        octx.lineTo(250, 220);

        octx.lineTo(335, 145);

        octx.quadraticCurveTo(
            365,
            115,
            420,
            112
        );

        octx.lineTo(565, 112);

        octx.quadraticCurveTo(
            625,
            118,
            680,
            180
        );

        octx.lineTo(785, 220);

        octx.lineTo(835, 275);

        octx.lineTo(820, 300);

        octx.lineTo(105, 300);

        octx.closePath();

        octx.fill();


        /* Windows */

        octx.beginPath();

        octx.moveTo(345, 145);

        octx.lineTo(415, 125);

        octx.lineTo(475, 125);

        octx.lineTo(490, 205);

        octx.lineTo(285, 205);

        octx.closePath();

        octx.fill();


        octx.beginPath();

        octx.moveTo(500, 125);

        octx.lineTo(560, 128);

        octx.quadraticCurveTo(
            605,
            135,
            650,
            190
        );

        octx.lineTo(505, 205);

        octx.closePath();

        octx.fill();


        /* Wheels */

        octx.beginPath();

        octx.arc(
            235,
            300,
            55,
            0,
            Math.PI * 2
        );

        octx.fill();


        octx.beginPath();

        octx.arc(
            700,
            300,
            55,
            0,
            Math.PI * 2
        );

        octx.fill();


        /* Wheel holes */

        octx.globalCompositeOperation =
            "destination-out";

        octx.beginPath();

        octx.arc(
            235,
            300,
            27,
            0,
            Math.PI * 2
        );

        octx.fill();


        octx.beginPath();

        octx.arc(
            700,
            300,
            27,
            0,
            Math.PI * 2
        );

        octx.fill();


        /* Sample pixels */

        const data =
            octx.getImageData(
                0,
                0,
                900,
                420
            ).data;


        const targets = [];

        const scale =
            Math.min(
                width / 1100,
                height / 520
            );

        const offsetX =
            width / 2 - 450 * scale;

        const offsetY =
            height * 0.48 - 210 * scale;


        for (
            let y = 0;
            y < 420;
            y += 5
        ) {

            for (
                let x = 0;
                x < 900;
                x += 5
            ) {

                const index =
                    (y * 900 + x) * 4;

                const alpha =
                    data[index + 3];

                if (alpha > 30) {

                    targets.push({

                        x:
                            offsetX +
                            x * scale,

                        y:
                            offsetY +
                            y * scale

                    });

                }

            }

        }


        /* Limit particle count */

        const maxParticles =
            Math.min(
                targets.length,
                1100
            );


        particles = [];


        for (
            let i = 0;
            i < maxParticles;
            i++
        ) {

            const target =
                targets[
                Math.floor(
                    Math.random() *
                    targets.length
                )
                ];


            particles.push({

                x:
                    Math.random() *
                    width,

                y:
                    Math.random() *
                    height,

                targetX:
                    target.x,

                targetY:
                    target.y,

                size:
                    0.7 +
                    Math.random() * 1.8,

                delay:
                    Math.random() *
                    900,

                speed:
                    0.025 +
                    Math.random() * 0.025,

                vx: 0,

                vy: 0,

                phase:
                    Math.random() *
                    Math.PI *
                    2

            });

        }

    }


    /* ---------- Mouse ---------- */

    hero.addEventListener(
        "mousemove",
        event => {

            const rect =
                hero.getBoundingClientRect();

            mouseX =
                event.clientX -
                rect.left;

            mouseY =
                event.clientY -
                rect.top;

            mouseActive = true;

        }
    );


    hero.addEventListener(
        "mouseleave",
        () => {

            mouseActive = false;

        }
    );


    /* ---------- Animation ---------- */

    function animate(now) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        const elapsed =
            now - animationStart;


        for (const particle of particles) {

            if (!exploded) {

                const localTime =
                    Math.max(
                        0,
                        elapsed -
                        particle.delay
                    );


                const progress =
                    Math.min(
                        localTime / 1900,
                        1
                    );


                /* Smooth easing */

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        4
                    );


                particle.x +=
                    (
                        particle.targetX -
                        particle.x
                    ) *
                    particle.speed *
                    (0.8 + eased);


                particle.y +=
                    (
                        particle.targetY -
                        particle.y
                    ) *
                    particle.speed *
                    (0.8 + eased);


                /* Mouse repulsion */

                if (mouseActive) {

                    const dx =
                        particle.x -
                        mouseX;

                    const dy =
                        particle.y -
                        mouseY;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distance < 100 &&
                        distance > 0
                    ) {

                        const force =
                            (100 - distance) /
                            100;

                        particle.x +=
                            (dx / distance) *
                            force *
                            2.5;

                        particle.y +=
                            (dy / distance) *
                            force *
                            2.5;

                    }

                }

            } else {

                particle.x +=
                    particle.vx;

                particle.y +=
                    particle.vy;

                particle.vx *= 0.985;
                particle.vy *= 0.985;

            }


            /* Draw */

            const glow =
                5 +
                Math.sin(
                    now * 0.004 +
                    particle.phase
                ) *
                2;


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(210,245,255,0.9)`;


            ctx.shadowBlur =
                glow;

            ctx.shadowColor =
                "rgba(0,217,255,0.95)";


            ctx.fill();

        }


        ctx.shadowBlur = 0;


        /* Hide canvas after explosion */

        if (exploded) {

            const opacity =
                Math.max(
                    0,
                    1 -
                    (now - animationStart) /
                    1800
                );

            canvas.style.opacity =
                opacity;

        }


        requestAnimationFrame(
            animate
        );

    }


    /* ---------- Start ---------- */

    // resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );


    // requestAnimationFrame(
    //     animate
    // );


    /* ---------- EXPLORE = EXPLODE ---------- */

    explore?.addEventListener(
        "click",
        () => {

            if (exploded) return;

            exploded = true;

            animationStart =
                performance.now();


            for (const particle of particles) {

                const angle =
                    Math.random() *
                    Math.PI *
                    2;

                const force =
                    2 +
                    Math.random() *
                    8;


                particle.vx =
                    Math.cos(angle) *
                    force;

                particle.vy =
                    Math.sin(angle) *
                    force;

            }

        },
        true
    );


})();

/* =====================================================
   NOVA — PARTICLE MORPH
   CAR → PARTICLES → NOVA
===================================================== */

(() => {

    const explore =
        document.getElementById("exploreButton");

    if (!explore) return;


    function createMorphScene() {

        const canvas =
            document.createElement("canvas");

        canvas.className =
            "nova-morph-canvas";

        Object.assign(canvas.style, {

            position: "fixed",
            inset: "0",
            width: "100%",
            height: "100%",

            zIndex: "10020",

            pointerEvents: "none",

            background: "transparent"

        });

        document.body.appendChild(canvas);


        const ctx =
            canvas.getContext("2d");

        let width =
            window.innerWidth;

        let height =
            window.innerHeight;


        canvas.width =
            width *
            window.devicePixelRatio;

        canvas.height =
            height *
            window.devicePixelRatio;

        ctx.scale(
            window.devicePixelRatio,
            window.devicePixelRatio
        );


        /* =========================================
           CREATE NOVA TEXT TARGETS
        ========================================= */

        const textCanvas =
            document.createElement("canvas");

        const textCtx =
            textCanvas.getContext("2d");

        textCanvas.width = 1200;
        textCanvas.height = 400;


        textCtx.clearRect(
            0,
            0,
            1200,
            400
        );


        textCtx.font =
            "900 210px Arial";

        textCtx.textAlign =
            "center";

        textCtx.textBaseline =
            "middle";

        textCtx.fillStyle =
            "#ffffff";

        textCtx.fillText(
            "NOVA",
            600,
            200
        );


        const image =
            textCtx.getImageData(
                0,
                0,
                1200,
                400
            ).data;


        const targets = [];


        for (
            let y = 0;
            y < 400;
            y += 5
        ) {

            for (
                let x = 0;
                x < 1200;
                x += 5
            ) {

                const index =
                    (y * 1200 + x) * 4;


                if (
                    image[index + 3] > 100
                ) {

                    targets.push({

                        x:
                            width / 2 -
                            600 +
                            x,

                        y:
                            height / 2 -
                            200 +
                            y

                    });

                }

            }

        }


        /* =========================================
           CREATE PARTICLES
        ========================================= */

        const particles = [];

        const amount =
            Math.min(
                targets.length,
                1800
            );


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const target =
                targets[
                Math.floor(
                    Math.random() *
                    targets.length
                )
                ];


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                300 +
                Math.random() *
                650;


            particles.push({

                x:
                    width / 2 +
                    Math.cos(angle) *
                    distance,

                y:
                    height / 2 +
                    Math.sin(angle) *
                    distance,

                targetX:
                    target.x,

                targetY:
                    target.y,

                size:
                    0.7 +
                    Math.random() *
                    2.2,

                delay:
                    Math.random() *
                    700,

                phase:
                    Math.random() *
                    Math.PI *
                    2

            });

        }


        let start =
            performance.now();


        /* =========================================
           ANIMATION
        ========================================= */

        function animate(now) {

            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            const elapsed =
                now - start;


            for (
                const particle of particles
            ) {

                const local =
                    Math.max(
                        0,
                        elapsed -
                        particle.delay
                    );


                const progress =
                    Math.min(
                        local / 1800,
                        1
                    );


                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        4
                    );


                particle.x +=
                    (
                        particle.targetX -
                        particle.x
                    ) *
                    0.055 *
                    eased;


                particle.y +=
                    (
                        particle.targetY -
                        particle.y
                    ) *
                    0.055 *
                    eased;


                const pulse =
                    0.8 +
                    Math.sin(
                        now * 0.006 +
                        particle.phase
                    ) *
                    0.25;


                ctx.beginPath();


                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size *
                    pulse,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    "rgba(225,248,255,0.95)";


                ctx.shadowBlur =
                    12;


                ctx.shadowColor =
                    "rgba(0,217,255,0.9)";


                ctx.fill();

            }


            ctx.shadowBlur = 0;


            /* =====================================
               HOLD NOVA
            ===================================== */

            if (
                elapsed > 3000 &&
                elapsed < 4500
            ) {

                const fade =
                    Math.min(
                        1,
                        (elapsed - 3000) /
                        500
                    );


                canvas.style.opacity =
                    1 - fade;

            }


            /* =====================================
               END
            ===================================== */

            if (elapsed > 4500) {

                canvas.remove();

                return;

            }


            requestAnimationFrame(
                animate
            );

        }


        requestAnimationFrame(
            animate
        );

    }


    /* =========================================
       TRIGGER
    ========================================= */

    explore.addEventListener(
        "click",
        () => {

            setTimeout(() => {

                createMorphScene();

            }, 850);

        }
    );

})();