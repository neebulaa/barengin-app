// Daftar negara (nama Indonesia -> kode ISO alpha-2) untuk pemilih
// "Negara/Provinsi" lokasi pembelian jastip (boleh luar negeri). Kode dipakai
// untuk membatasi pencarian kota Nominatim hanya pada negara terpilih.
export const COUNTRY_CODES = {
    "Afrika Selatan": "za", "Afganistan": "af", "Albania": "al", "Aljazair": "dz",
    "Amerika Serikat": "us", "Angola": "ao", "Arab Saudi": "sa", "Argentina": "ar",
    "Armenia": "am", "Australia": "au", "Austria": "at", "Azerbaijan": "az",
    "Bahrain": "bh", "Bangladesh": "bd", "Belanda": "nl", "Belarus": "by",
    "Belgia": "be", "Bolivia": "bo", "Bosnia dan Herzegovina": "ba", "Botswana": "bw",
    "Brasil": "br", "Brunei Darussalam": "bn", "Bulgaria": "bg", "Ceko": "cz",
    "Chili": "cl", "Denmark": "dk", "Ekuador": "ec", "El Salvador": "sv",
    "Estonia": "ee", "Ethiopia": "et", "Fiji": "fj", "Filipina": "ph",
    "Finlandia": "fi", "Georgia": "ge", "Ghana": "gh", "Guatemala": "gt",
    "Hong Kong": "hk", "Hongaria": "hu", "India": "in", "Indonesia": "id",
    "Inggris": "gb", "Irak": "iq", "Iran": "ir", "Irlandia": "ie", "Islandia": "is",
    "Israel": "il", "Italia": "it", "Jamaika": "jm", "Jepang": "jp", "Jerman": "de",
    "Kamboja": "kh", "Kanada": "ca", "Kazakhstan": "kz", "Kenya": "ke",
    "Kolombia": "co", "Korea Selatan": "kr", "Korea Utara": "kp", "Kosta Rika": "cr",
    "Kroasia": "hr", "Kuba": "cu", "Kuwait": "kw", "Laos": "la", "Latvia": "lv",
    "Lebanon": "lb", "Libya": "ly", "Lituania": "lt", "Luksemburg": "lu",
    "Madagaskar": "mg", "Makau": "mo", "Malaysia": "my", "Maladewa": "mv",
    "Malta": "mt", "Maroko": "ma", "Meksiko": "mx", "Mesir": "eg", "Mongolia": "mn",
    "Myanmar": "mm", "Nepal": "np", "Nigeria": "ng", "Norwegia": "no", "Oman": "om",
    "Pakistan": "pk", "Panama": "pa", "Papua Nugini": "pg", "Paraguay": "py",
    "Peru": "pe", "Polandia": "pl", "Portugal": "pt", "Prancis": "fr",
    "Puerto Riko": "pr", "Qatar": "qa", "Rumania": "ro", "Rusia": "ru",
    "Selandia Baru": "nz", "Senegal": "sn", "Serbia": "rs", "Singapura": "sg",
    "Siprus": "cy", "Slovakia": "sk", "Slovenia": "si", "Spanyol": "es",
    "Sri Lanka": "lk", "Sudan": "sd", "Swedia": "se", "Swiss": "ch", "Taiwan": "tw",
    "Tanzania": "tz", "Thailand": "th", "Timor Leste": "tl", "Tiongkok": "cn",
    "Tunisia": "tn", "Turki": "tr", "Uganda": "ug", "Ukraina": "ua",
    "Uni Emirat Arab": "ae", "Uruguay": "uy", "Uzbekistan": "uz", "Venezuela": "ve",
    "Vietnam": "vn", "Yaman": "ye", "Yordania": "jo", "Yunani": "gr", "Zambia": "zm",
    "Zimbabwe": "zw",
};

export const COUNTRIES = Object.keys(COUNTRY_CODES).sort((a, b) =>
    a.localeCompare(b, "id"),
);

export const countryCodeOf = (name) => COUNTRY_CODES[name] || null;
