"use strict";

/* ==========================================
   مشكاة الحديث — مكتبة الكتب التسعة
   مصدر البيانات: AhmedBaset/hadith-json
   الإصدار: v1.2.0
========================================== */

const HADITH_CONFIG = {
    pageSize: 20,

    sources: {
        bukhari: {
            name: "صحيح البخاري",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/bukhari.json"
        },
        muslim: {
            name: "صحيح مسلم",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/muslim.json"
        },
        abudawud: {
            name: "سنن أبي داود",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/abudawud.json"
        },
        tirmidhi: {
            name: "جامع الترمذي",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/tirmidhi.json"
        },
        nasai: {
            name: "سنن النسائي",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/nasai.json"
        },
        ibnmajah: {
            name: "سنن ابن ماجه",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/ibnmajah.json"
        },
        malik: {
            name: "موطأ الإمام مالك",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/malik.json"
        },
        ahmad: {
            name: "مسند الإمام أحمد",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/ahmad.json"
        },
        darimi: {
            name: "سنن الدارمي",
            url: "https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/darimi.json"
        }
    }
};

const state = {
    database: [],
    loadedSources: new Set(),
    failedSources: new Map(),
    visibleCount: HADITH_CONFIG.pageSize,
    loading: false
};

const $ = id => document.getElementById(id);

const elements = {
    results: $("results"),
    searchForm: $("searchForm"),
    searchInput: $("searchInput"),
    filterSearch: $("filterSearch"),
    sourceFilter: $("sourceFilter"),
    sortFilter: $("sortFilter"),
    resultsCount: $("resultsCount"),
    connectionStatus: $("connectionStatus"),
    connectionStatusText: $("connectionStatusText"),
    clearFilters: $("clearFilters"),
    retryLoad: $("retryLoad"),
    loadMore: $("loadMore"),
    backToTop: $("backToTop")
};

/* ==========================================
   التحقق من عناصر الصفحة
========================================== */

function checkElements() {
    const missing = Object.entries(elements)
        .filter(([, element]) => !element)
        .map(([name]) => name);

    if (missing.length) {
        console.error(
            "مشكاة الحديث: عناصر HTML غير موجودة:",
            missing
        );

        return false;
    }

    return true;
}

/* ==========================================
   أدوات النص العربي
========================================== */

function normalizeArabic(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ؤ/g, "و")
        .replace(/ئ/g, "ي")
        .replace(/ـ/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

/* ==========================================
   قراءة بيانات الحديث
========================================== */

function extractHadithArray(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && Array.isArray(payload.hadiths)) {
        return payload.hadiths;
    }

    if (payload && Array.isArray(payload.data)) {
        return payload.data;
    }

    if (payload && Array.isArray(payload.results)) {
        return payload.results;
    }

    return [];
}

function getHadithText(item) {
    if (!item || typeof item !== "object") {
        return "";
    }

    const candidates = [
        item.arabic,
        item.arab,
        item.arabicText,
        item.hadithArabic,
        item.text
    ];

    for (const value of candidates) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
    }

    return "";
}

function getHadithNumber(item, index) {
    const candidates = [
        item.id,
        item.hadithnumber,
        item.hadithNumber,
        item.number,
        item.reference?.number
    ];

    for (const value of candidates) {
        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return index + 1;
}

function normalizeRecord(item, sourceKey, index) {
    const text = getHadithText(item);

    if (!text) {
        return null;
    }

    const source = HADITH_CONFIG.sources[sourceKey];

    return {
        sourceKey,
        sourceName: source.name,
        number: getHadithNumber(item, index),
        text,
        normalizedText: normalizeArabic(text),
        narrator:
            item.english?.narrator ||
            item.narrator ||
            "",
        original: item
    };
}

/* ==========================================
   تحميل كل كتاب
========================================== */

async function fetchSource(sourceKey) {
    const source = HADITH_CONFIG.sources[sourceKey];

    const response = await fetch(source.url, {
        headers: {
            Accept: "application/json"
        },
        cache: "force-cache"
    });

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status} — تعذر تحميل ${source.name}`
        );
    }

    const payload = await response.json();
    const list = extractHadithArray(payload);

    if (!list.length) {
        throw new Error(
            `لم نتعرف على بنية بيانات ${source.name}`
        );
    }

    const records = list
        .map((item, index) =>
            normalizeRecord(item, sourceKey, index)
        )
        .filter(Boolean);

    if (!records.length) {
        throw new Error(
            `لم نعثر على نصوص عربية في ${source.name}`
        );
    }

    return records;
}

/* ==========================================
   حالة الاتصال
========================================== */

function setStatus(type, message) {
    elements.connectionStatus.classList.remove(
        "online",
        "error"
    );

    if (type === "online") {
        elements.connectionStatus.classList.add("online");
    }

    if (type === "error") {
        elements.connectionStatus.classList.add("error");
    }

    elements.connectionStatusText.textContent = message;
}

function showState(icon, title, description, retry = false) {
    elements.results.innerHTML = `
        <div class="state-panel">
            <div class="state-icon">${escapeHTML(icon)}</div>
            <h3>${escapeHTML(title)}</h3>
            <p>${escapeHTML(description)}</p>
            ${
                retry
                    ? `<button type="button" id="retryFromState">
                           إعادة المحاولة
                       </button>`
                    : ""
            }
        </div>
    `;

    const button = $("retryFromState");

    if (button) {
        button.addEventListener("click", loadDatabase);
    }
}

/* ==========================================
   تحميل المكتبة
========================================== */

async function loadDatabase() {
    if (state.loading) {
        return;
    }

    state.loading = true;

    elements.retryLoad.disabled = true;
    elements.retryLoad.textContent = "جارٍ تحميل الكتب...";
    elements.resultsCount.textContent = "جارٍ الاتصال بالمصادر...";

    setStatus("loading", "جارٍ تحميل كتب الحديث");

    showState(
        "⏳",
        "جارٍ تجهيز مكتبة الحديث",
        "نحمّل الكتب المتاحة ونتحقق من النصوص."
    );

    const entries = Object.entries(HADITH_CONFIG.sources);

    const pending = entries.filter(
        ([key]) => !state.loadedSources.has(key)
    );

    const outcomes = await Promise.allSettled(
        pending.map(async ([key]) => ({
            key,
            records: await fetchSource(key)
        }))
    );

    for (let i = 0; i < outcomes.length; i++) {
        const outcome = outcomes[i];
        const [sourceKey] = pending[i];

        if (outcome.status === "fulfilled") {
            const { records } = outcome.value;

            state.database.push(...records);
            state.loadedSources.add(sourceKey);
            state.failedSources.delete(sourceKey);

            console.info(
                `تم تحميل ${HADITH_CONFIG.sources[sourceKey].name}:`,
                records.length,
                "حديثًا"
            );
        } else {
            const message =
                outcome.reason?.message || "خطأ غير معروف";

            state.failedSources.set(sourceKey, message);

            console.error(
                HADITH_CONFIG.sources[sourceKey].name,
                message
            );
        }
    }

    state.loading = false;
    elements.retryLoad.disabled = false;
    elements.retryLoad.textContent = "↻ إعادة الاتصال";

    if (state.loadedSources.size > 0) {
        const failedCount = state.failedSources.size;

        setStatus(
            failedCount ? "error" : "online",
            failedCount
                ? `تم تحميل ${state.loadedSources.size} من 9 كتب`
                : "تم تحميل الكتب التسعة بنجاح"
        );

        renderResults();
        return;
    }

    setStatus("error", "تعذر تحميل البيانات");

    const errors = [...state.failedSources.entries()]
        .map(([key, message]) =>
            `${HADITH_CONFIG.sources[key].name}: ${message}`
        )
        .join(" | ");

    elements.resultsCount.textContent = "لم يتم تحميل أي كتاب";

    showState(
        "⚠️",
        "تعذر تحميل مكتبة الحديث",
        errors || "تحقق من اتصال الإنترنت ثم أعد المحاولة.",
        true
    );
}

/* ==========================================
   البحث والتصفية
========================================== */

function getActiveQuery() {
    return normalizeArabic(
        elements.filterSearch.value ||
        elements.searchInput.value
    );
}

function getFilteredRecords() {
    const query = getActiveQuery();
    const selectedSource = elements.sourceFilter.value;

    let records = state.database.filter(record => {
        const sourceMatches =
            selectedSource === "all" ||
            record.sourceKey === selectedSource;

        const queryMatches =
            !query ||
            record.normalizedText.includes(query) ||
            normalizeArabic(record.sourceName).includes(query) ||
            normalizeArabic(record.narrator).includes(query);

        return sourceMatches && queryMatches;
    });

    if (elements.sortFilter.value === "number") {
        records = records.slice().sort((a, b) => {
            const na = Number(a.number);
            const nb = Number(b.number);

            if (Number.isFinite(na) && Number.isFinite(nb)) {
                return na - nb;
            }

            return String(a.number).localeCompare(String(b.number));
        });
    }

    return records;
}

/* ==========================================
   نسخ النص
========================================== */

async function copyText(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        button.textContent = "✓ تم النسخ";
    } catch {
        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();

        const success = document.execCommand("copy");
        textarea.remove();

        button.textContent = success
            ? "✓ تم النسخ"
            : "تعذر النسخ";
    }

    setTimeout(() => {
        button.textContent = "📋 نسخ الحديث";
    }, 2000);
}

/* ==========================================
   إنشاء بطاقة حديث
========================================== */

function createHadithCard(record) {
    const card = document.createElement("article");
    card.className = "hadith-card";

    const top = document.createElement("div");
    top.className = "hadith-card-top";

    const source = document.createElement("span");
    source.className = "hadith-source";
    source.textContent = record.sourceName;

    const number = document.createElement("span");
    number.className = "hadith-number";
    number.textContent = `رقم الحديث في البيانات: ${record.number}`;

    top.append(source, number);

    const text = document.createElement("p");
    text.className = "hadith-text";
    text.textContent = record.text;

    const actions = document.createElement("div");
    actions.className = "hadith-actions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "hadith-action";
    copyButton.textContent = "📋 نسخ الحديث";

    copyButton.addEventListener("click", () => {
        copyText(
            `${record.text}\n\n${record.sourceName} — رقم الحديث في البيانات: ${record.number}`,
            copyButton
        );
    });

    const shareButton = document.createElement("button");
    shareButton.type = "button";
    shareButton.className = "hadith-action";
    shareButton.textContent = "↗ مشاركة";

    shareButton.addEventListener("click", async () => {
        const shareText =
            `${record.text}\n\n${record.sourceName} — رقم الحديث في البيانات: ${record.number}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: record.sourceName,
                    text: shareText
                });
            } catch (error) {
                if (error.name !== "AbortError") {
                    await copyText(shareText, shareButton);
                }
            }
        } else {
            await copyText(shareText, shareButton);
        }
    });

    actions.append(copyButton, shareButton);
    card.append(top, text, actions);

    return card;
}

/* ==========================================
   عرض النتائج
========================================== */

function renderResults() {
    const records = getFilteredRecords();

    const visible = records.slice(0, state.visibleCount);

    elements.results.replaceChildren();

    elements.resultsCount.textContent =
        `عدد النتائج: ${records.length.toLocaleString("ar-SA")} — الكتب المحمّلة: ${state.loadedSources.size} من 9`;

    if (!records.length) {
        showState(
            "⌕",
            "لا توجد نتائج مطابقة",
            state.database.length
                ? "جرّب كلمة أخرى أو اختر كتابًا مختلفًا."
                : "لم يتم تحميل نصوص حديثية."
        );

        elements.loadMore.classList.add("hidden");
        return;
    }

    const fragment = document.createDocumentFragment();

    visible.forEach(record => {
        fragment.appendChild(createHadithCard(record));
    });

    elements.results.appendChild(fragment);

    if (records.length > visible.length) {
        elements.loadMore.classList.remove("hidden");

        elements.loadMore.textContent =
            `عرض المزيد — المتبقي ${(
                records.length - visible.length
            ).toLocaleString("ar-SA")}`;
    } else {
        elements.loadMore.classList.add("hidden");
    }
}

/* ==========================================
   ربط الأزرار
========================================== */

function resetAndRender() {
    state.visibleCount = HADITH_CONFIG.pageSize;
    renderResults();
}

function setupEvents() {
    elements.searchForm.addEventListener("submit", event => {
        event.preventDefault();

        elements.filterSearch.value = elements.searchInput.value;

        resetAndRender();

        $("results-section").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    elements.searchInput.addEventListener("input", () => {
        elements.filterSearch.value = elements.searchInput.value;
        resetAndRender();
    });

    elements.filterSearch.addEventListener("input", () => {
        elements.searchInput.value = elements.filterSearch.value;
        resetAndRender();
    });

    elements.sourceFilter.addEventListener("change", resetAndRender);
    elements.sortFilter.addEventListener("change", resetAndRender);

    elements.clearFilters.addEventListener("click", () => {
        elements.searchInput.value = "";
        elements.filterSearch.value = "";
        elements.sourceFilter.value = "all";
        elements.sortFilter.value = "original";

        resetAndRender();
    });

    elements.retryLoad.addEventListener("click", loadDatabase);

    elements.loadMore.addEventListener("click", () => {
        state.visibleCount += HADITH_CONFIG.pageSize;
        renderResults();
    });

    document.querySelectorAll("[data-select-source]").forEach(link => {
        link.addEventListener("click", () => {
            const sourceKey = link.dataset.selectSource;

            if (HADITH_CONFIG.sources[sourceKey]) {
                elements.sourceFilter.value = sourceKey;
                resetAndRender();
            }
        });
    });

    elements.backToTop?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ==========================================
   تشغيل المكتبة
========================================== */

if (checkElements()) {
    setupEvents();
    loadDatabase();
}