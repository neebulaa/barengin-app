/**
 * Pencocokan teks toleran salah-ketik untuk pencarian sisi-klien.
 *
 * Dipakai agar pencarian tetap menemukan data yang mirip walau ada typo,
 * misalnya "edwin henddll" tetap menemukan "edwin hendly".
 *
 * `fuzzyIncludes(text, query)` mengembalikan true bila `query` cocok dengan
 * `text` secara substring ATAU cukup mirip (per-kata) sehingga typo kecil
 * tetap lolos.
 */

function normalize(value) {
    return String(value ?? "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "") // buang aksen
        .trim();
}

/** Jarak edit Levenshtein antara dua string pendek. */
function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    let curr = new Array(b.length + 1);

    for (let i = 1; i <= a.length; i++) {
        curr[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(
                curr[j - 1] + 1, // insert
                prev[j] + 1, // delete
                prev[j - 1] + cost, // substitute
            );
        }
        [prev, curr] = [curr, prev];
    }

    return prev[b.length];
}

/** Rasio kemiripan 0..1 berbasis jarak edit. */
export function similarity(a, b) {
    const s1 = normalize(a);
    const s2 = normalize(b);
    if (!s1 && !s2) return 1;
    const max = Math.max(s1.length, s2.length);
    if (max === 0) return 1;
    return 1 - levenshtein(s1, s2) / max;
}

/** Apakah satu kata `token` cukup mirip dengan `word`. */
function wordMatches(token, word) {
    if (!token) return true;
    if (word.includes(token) || token.includes(word)) return true;

    const dist = levenshtein(token, word);
    // toleransi ~1/3 panjang token untuk typo
    if (dist <= Math.max(1, Math.floor(token.length / 3))) return true;

    return similarity(token, word) >= 0.7;
}

/**
 * True bila `query` cocok dengan `text` (substring penuh, atau setiap kata di
 * query menemukan kata mirip di text).
 */
export function fuzzyIncludes(text, query) {
    const t = normalize(text);
    const q = normalize(query);
    if (!q) return true;
    if (t.includes(q)) return true;

    const tokens = q.split(/\s+/).filter(Boolean);
    const words = t.split(/\s+/).filter(Boolean);
    if (words.length === 0) return false;

    return tokens.every((tok) => words.some((w) => wordMatches(tok, w)));
}
