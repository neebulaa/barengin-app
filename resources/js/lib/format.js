// Helper format angka terpusat. Dulu fungsi `rupiah` ini didefinisikan ulang
// (identik) di belasan halaman/komponen - sekarang satu sumber di sini.

// "Rp 1.000" gaya Indonesia. Di-round dulu supaya nilai float (mis. hasil bagi
// split bill) tidak memunculkan angka desimal, dan null/NaN jatuh ke 0.
export const formatRupiah = (n) =>
    "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(Number(n) || 0));

// Angka biasa dengan pemisah ribuan "1.000" (tanpa prefix Rp) - dipakai untuk
// jumlah item, peserta, dll.
export const formatNumber = (n) => Number(n || 0).toLocaleString("id-ID");
