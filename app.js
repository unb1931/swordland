// Selected Language Element


document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById('openGuideBtn');
    const closeBtn = document.getElementById('closeGuideBtn');
    const drawer = document.getElementById('sideDrawer');
    const langSelect = document.getElementById("langSelect");



    // Path folder disesuaikan persis dengan gambar (tanpa titik di depan nama folder)
    const LOCALES_PATH = "./locales";
    const DEFAULT_LANG = "id";

    // 1. Ambil bahasa tersimpan atau gunakan default
    const savedLang = localStorage.getItem("selected_lang") || DEFAULT_LANG;
    langSelect.value = savedLang;
    loadLanguage(savedLang);

    // 2. Event listener ganti bahasa
    langSelect.addEventListener("change", (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem("selected_lang", selectedLang);
        loadLanguage(selectedLang);
    });

    // 3. Fungsi fetch file JSON
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`${LOCALES_PATH}/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Gagal memuat file terjemahan: ${response.statusText}`);
            }
            const translations = await response.json();

            applyTranslations(translations);

            // Tentukan arah teks (RTL untuk Arab)
            if (lang === "ar") {
                document.documentElement.setAttribute("dir", "rtl");
                document.documentElement.setAttribute("lang", "ar");
            } else {
                document.documentElement.setAttribute("dir", "ltr");
                document.documentElement.setAttribute("lang", lang);
            }
        } catch (error) {
            console.error("i18n Error:", error);
        }
    }

    // 4. Pembaca key bertingkat (nested key)
    function getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
    }

    // 5. Terapkan ke HTML
    function applyTranslations(translations) {
        const elements = document.querySelectorAll("[data-i18n]");
        elements.forEach((el) => {
            const key = el.getAttribute("data-i18n");
            const translation = getNestedTranslation(translations, key);

            if (translation) {
                if (translation.includes("<") && translation.includes(">")) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
    }

    // Controls Drawer Panel
    if (openBtn && drawer) {
        openBtn.addEventListener('click', () => {
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn && drawer) {
        closeBtn.addEventListener('click', () => {
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

});
