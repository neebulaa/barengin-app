import DOMPurify from "dompurify";

// Pertahanan berlapis di sisi klien untuk konten postingan forum.
//
// Sumber kebenaran tetap sanitasi server (HTMLPurifier, profil "forum_post").
// Lapisan ini menetralkan konten APAPUN yang lolos ke peramban - termasuk
// baris lama sebelum perbaikan - sebelum dirender lewat dangerouslySetInnerHTML.
//
// Allow-list sengaja dibuat identik dengan sisi server: hanya tag format teks
// dasar (bold/italic/underline) + pembungkus baris, TANPA satu atribut pun.
// Tanpa atribut, tak ada permukaan untuk onerror/onload/href/style.
const FORUM_POST_CONFIG = {
    ALLOWED_TAGS: ["p", "br", "b", "strong", "i", "em", "u", "div", "span"],
    ALLOWED_ATTR: [],
    // Buang seluruh isi tag berbahaya, bukan hanya tag-nya.
    FORBID_TAGS: ["script", "style", "img", "svg", "math", "iframe", "a"],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true },
};

export function sanitizeForumHtml(dirty) {
    if (dirty == null) return "";
    return DOMPurify.sanitize(String(dirty), FORUM_POST_CONFIG);
}

export default sanitizeForumHtml;
