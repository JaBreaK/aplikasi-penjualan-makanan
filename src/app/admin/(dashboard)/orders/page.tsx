"use client";

import { useEffect, useRef, useState } from "react";
import type { orders_status_pembayaran, orders_status_pesanan } from "@prisma/client";
import { MessageSquare, RefreshCw, X, Check, Printer, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Tipe data (sama seperti yang dikirimkan user, ditahan agar kompatibel)
type Produk = { nama_produk: string };

type OrderItem = { id: number; jumlah: number; produk: Produk };

type MetodePembayaran = { nama_metode: string };

type pembayaran = {
  id: number;
  status: string;
  metodepembayaran: MetodePembayaran;
  bukti_pembayaran_url: string;
};

type Order = {
  id: number;
  waktu_order: string;
  nama_pelanggan: string;
  tipe_pesanan: string;
  nomor_wa: string;
  total_harga: number;
  status_pembayaran: string;
  status_pesanan: string;
  keterangan_batal: string | null;
  orderitems: OrderItem[];
  pembayaran: pembayaran[];
  catatan_pelanggan: string | null;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Audio notification
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [pollIntervalSec, setPollIntervalSec] = useState<number>(8);
  const prevIdsRef = useRef<number[]>([]);

  // Filter states (kasir)
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterTipe, setFilterTipe] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Modal untuk pembatalan (mengganti prompt dengan modal yang lebih elegan)
  const [cancelModal, setCancelModal] = useState<{ open: boolean; orderId?: number; reason: string }>({
    open: false,
    orderId: undefined,
    reason: "",
  });

  // Simple toast
  const [toast1, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initialize audio once
  useEffect(() => {
    try {
      audioRef.current = new Audio("/notification.mp3");
      audioRef.current.preload = "auto";
    } catch (e) {
      console.warn("Gagal inisialisasi audio:", e);
      audioRef.current = null;
    }
  }, []);

  const fetchOrders = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Gagal memuat data pesanan");
      const data: Order[] = await res.json();

      // detect new orders by comparing IDs
      const prevIds = prevIdsRef.current || [];
      const newIds = data.map((d) => d.id).filter((id) => !prevIds.includes(id));

      // don't play sound on initial load (prevIds empty)
      if (prevIds.length > 0 && newIds.length > 0 && soundEnabled) {
        try {
          // play returns a promise; catch auto-play rejection
          await audioRef.current?.play();
        } catch (err) {
          // Browsers may block autoplay until user interacts. Show toast to inform user.
          console.warn("Audio play blocked:", err);
          showToast("Notifikasi suara diblokir oleh browser. Klik tombol Suara untuk mengaktifkan.", "error");
        }
      }

      setOrders(data);
      prevIdsRef.current = data.map((d) => d.id);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan tidak diketahui saat mengambil data.");
    } finally {
      if (!silent) setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Polling untuk cek order baru
  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(() => {
      fetchOrders({ silent: true });
    }, Math.max(2000, pollIntervalSec * 1000));
    return () => clearInterval(iv);
  }, [autoRefresh, pollIntervalSec, soundEnabled]);

  const handleUpdateStatus = async (orderId: number, newStatus: orders_status_pembayaran, keterangan?: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_pembayaran: newStatus, keterangan_batal: keterangan }),
      });
      if (!response.ok) throw new Error("Gagal mengupdate status.");
      
      toast.success(`Status pesanan #${orderId} diubah menjadi ${newStatus.replace('_', ' ')}`);
      await fetchOrders();
      
    } catch (error: unknown) { // <-- Ganti ke unknown
      if (error instanceof Error) {
          toast.error("Gagal Update Status Dapur", { description: error.message });
      }
  }
  };

  const handleUpdateStatusPesanan = async (orderId: number, newStatus: orders_status_pesanan) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_pesanan: newStatus }),
      });
       if (!response.ok) throw new Error("Gagal mengupdate status pesanan.");

      toast.success(`Status dapur untuk pesanan #${orderId} diubah menjadi ${newStatus.replace('_', ' ')}`);
      await fetchOrders();
    } catch (error: unknown) { // <-- Ganti ke unknown
      if (error instanceof Error) {
          toast.error("Gagal Update Status Dapur", { description: error.message });
      }
  }
  };

  const openCancelModal = (orderId: number) => {
    setCancelModal({ open: true, orderId, reason: "" });
  };

  const confirmCancel = async () => {
    if (!cancelModal.orderId) return;
    await handleUpdateStatus(cancelModal.orderId, "BATAL" as orders_status_pembayaran, cancelModal.reason);
    setCancelModal({ open: false, orderId: undefined, reason: "" });
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const refresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Variants untuk animasi daftar
  const list = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  // --- FILTERING LOGIC (KASIR) ---
  const matchesSearch = (o: Order) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.nama_pelanggan.toLowerCase().includes(q) ||
      o.nomor_wa.toLowerCase().includes(q) ||
      String(o.id).includes(q)
    );
  };

  const matchesStatus = (o: Order) => (filterStatus === "ALL" ? true : o.status_pembayaran === filterStatus);
  const matchesTipe = (o: Order) => (filterTipe === "ALL" ? true : o.tipe_pesanan === filterTipe);

  const matchesDateRange = (o: Order) => {
    if (!fromDate && !toDate) return true;
    const t = new Date(o.waktu_order);
    if (fromDate) {
      const f = new Date(fromDate + "T00:00:00");
      if (t < f) return false;
    }
    if (toDate) {
      // include end of day
      const tt = new Date(toDate + "T23:59:59");
      if (t > tt) return false;
    }
    return true;
  };

  const filteredOrders = orders.filter((o) => matchesSearch(o) && matchesStatus(o) && matchesTipe(o) && matchesDateRange(o));

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("ALL");
    setFilterTipe("ALL");
    setFromDate("");
    setToDate("");
  };

  if (isLoading)
    return (
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Daftar Pesanan Masuk</h1>
          <div className="flex items-center gap-3">
            <button onClick={refresh} className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100">
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow-sm border" />
          ))}
        </div>
      </main>
    );

  if (error)
    return (
      <main className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle />
            <div>
              <h2 className="font-bold">Error</h2>
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-3">
              <button onClick={() => fetchOrders()}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );

  return (
    <main className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold">Daftar Pesanan Masuk</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className={`flex items-center gap-2 px-3 py-2 rounded ${refreshing ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"}`}>
            <RefreshCw size={16} /> Refresh
          </button>

          <button
            onClick={() => { setSoundEnabled((s) => !s); showToast(`Suara notifikasi ${!soundEnabled ? 'diaktifkan' : 'dinonaktifkan'}`); }}
            className={`px-3 py-2 rounded ${soundEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
            Suara: {soundEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setAutoRefresh((a) => !a)}
            className={`px-3 py-2 rounded ${autoRefresh ? 'bg-indigo-100' : 'bg-gray-100'}`}>
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm">Interval (detik)</label>
            <input type="number" min={2} value={pollIntervalSec} onChange={(e) => setPollIntervalSec(Number(e.target.value) || 2)} className="w-20 border p-1 rounded" />
          </div>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Cari (nama / id / WA)</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ketik nama, id, atau nomor WA" className="w-full border p-2 rounded mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Status Pembayaran</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border p-2 rounded mt-1">
              <option value="ALL">Semua</option>
              <option value="LUNAS">LUNAS</option>
              <option value="BATAL">BATAL</option>
              <option value="MENUNGGU_KONFIRMASI">MENUNGGU_KONFIRMASI</option>
              <option value="BELUM_BAYAR">BELUM_BAYAR</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Tipe Pesanan</label>
            <select value={filterTipe} onChange={(e) => setFilterTipe(e.target.value)} className="w-full border p-2 rounded mt-1">
              <option value="ALL">Semua</option>
              <option value="ONLINE">ONLINE</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Dari</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full border p-2 rounded mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Sampai</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full border p-2 rounded mt-1" />
          </div>

          <div className="flex gap-2">
            <button onClick={clearFilters} className="px-3 py-2 rounded bg-gray-100">Clear</button>
            <button onClick={() => fetchOrders()} className="px-3 py-2 rounded bg-blue-500 text-white">Apply</button>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">Menampilkan <strong>{filteredOrders.length}</strong> dari <strong>{orders.length}</strong> pesanan</div>
      </div>

      <AnimatePresence>
        <motion.ul variants={list} initial="hidden" animate="visible" className="space-y-4">
          {filteredOrders.map((order) => {
            const pembayaranTerbaru = order.pembayaran?.[0];
            let statusColor = "bg-yellow-100 text-yellow-800";
            if (order.status_pembayaran === "LUNAS") statusColor = "bg-green-100 text-green-800";
            if (order.status_pembayaran === "BATAL") statusColor = "bg-red-100 text-red-800";

            let pesanWA = `Halo ${order.nama_pelanggan}, info untuk pesanan Anda #${order.id}:

`;
            switch (order.status_pesanan) {
              case "PESANAN_DITERIMA":
                pesanWA += "Pesanan Anda sudah kami terima dan akan segera kami proses.";
                break;
              case "SEDANG_DIMASAK":
                pesanWA += "Pesanan Anda sudah masuk antrean dapur dan sedang kami masak. Mohon ditunggu ya!";
                break;
              case "SIAP_DIAMBIL":
                pesanWA += "Hore! Pesanan Anda sudah siap. Silakan segera diambil agar tetap nikmat saat disantap.";
                break;
              case "SELESAI":
                pesanWA += "Pesanan Anda sudah selesai. Terima kasih telah memesan, semoga suka!";
                break;
              default:
                pesanWA = `Halo ${order.nama_pelanggan}, ada update untuk pesanan Anda #${order.id}.`;
            }
            const nomorWaFormatted = order.nomor_wa.startsWith("0") ? `62${order.nomor_wa.substring(1)}` : order.nomor_wa;
            const linkWA = `https://wa.me/${nomorWaFormatted}?text=${encodeURIComponent(pesanWA)}`;

            return (
              <motion.li key={order.id} variants={item} className="bg-white p-4 md:p-6 rounded-lg shadow-md border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h2 className="font-semibold text-lg">Order #{order.id}</h2>
                      <p className="text-sm text-gray-500">{new Date(order.waktu_order).toLocaleString("id-ID")}</p>
                    </div>
                    <div className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>{order.status_pembayaran.replace("_", " ")}</div>
                    <div className={`px-2 py-1 text-xs font-semibold rounded-full ${order.tipe_pesanan === "ONLINE" ? "bg-cyan-100 text-cyan-800" : "bg-gray-100 text-gray-700"}`}>
                      {order.tipe_pesanan}
                    </div>
                    {order.status_pembayaran === "LUNAS" && (
                      <div className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">Dapur: {order.status_pesanan.replace("_", " ")}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleExpand(order.id)} className="px-3 py-2 rounded bg-gray-50 hover:bg-gray-100">
                      {expanded.includes(order.id) ? "Sembunyikan" : "Rincian"}
                    </button>

                    {order.status_pembayaran === "LUNAS" && (
                      <a href={linkWA} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-2 rounded bg-green-500 text-white">
                        <MessageSquare size={16} /> Kirim WA
                      </a>
                    )}

                    <button onClick={() => window.open(`/admin/orders/cetak/${order.id}`, "_blank")} className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">
                      <Printer size={14} /> Cetak
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded.includes(order.id) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 border-t pt-4">
                      {/* Informasi pelanggan & pembayaran */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-semibold">Pelanggan</h3>
                          <p>
                            {order.nama_pelanggan} ({order.nomor_wa})
                          </p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Metode Pembayaran</h3>
                          <p className="font-medium text-blue-600">{pembayaranTerbaru?.metodepembayaran?.nama_metode || "N/A"}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Bukti Pembayaran</h3>
                          {pembayaranTerbaru?.bukti_pembayaran_url ? (
                            <a href={pembayaranTerbaru.bukti_pembayaran_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Lihat Bukti
                            </a>
                          ) : (
                            <p>Belum diupload</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">Detail Pesanan</h3>
                        <ul className="list-disc list-inside">
                          {order.orderitems.map((item) => (
                            <li key={item.id}>
                              {item.jumlah}x {item.produk.nama_produk}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {order.catatan_pelanggan && (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded">
                          <p className="font-semibold">Catatan Pelanggan</p>
                          <p>{order.catatan_pelanggan}</p>
                        </div>
                      )}

                      {order.status_pembayaran === "BATAL" && order.keterangan_batal && (
                        <div className="mt-3 bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded">
                          <p className="font-semibold">Alasan Pembatalan</p>
                          <p>{order.keterangan_batal}</p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-between items-center">
                        <div className="font-bold text-lg">Total: Rp {order.total_harga.toLocaleString("id-ID")}</div>

                        <div className="flex items-center gap-2">
                          {/* Tombol Batalkan (hanya ketika belum lunas dan belum batal) */}
                          {order.status_pembayaran !== "LUNAS" && order.status_pembayaran !== "BATAL" && (
                            <button onClick={() => openCancelModal(order.id)} className="px-3 py-2 rounded bg-red-500 text-white">
                              Batalkan
                            </button>
                          )}

                          {/* Verifikasi bukti menjadi LUNAS */}
                          {order.status_pembayaran === "MENUNGGU_KONFIRMASI" && pembayaranTerbaru?.bukti_pembayaran_url && (
                            <button onClick={() => handleUpdateStatus(order.id, "LUNAS" as orders_status_pembayaran)} className="px-3 py-2 rounded bg-green-500 text-white">
                              <Check size={14} /> Verifikasi & LUNAS
                            </button>
                          )}

                          {/* Alur dapur, hanya kalau LUNAS */}
                          {order.status_pembayaran === "LUNAS" && (
                            <div className="flex items-center gap-2">
                              {order.status_pesanan === "PESANAN_DITERIMA" && (
                                <button onClick={() => handleUpdateStatusPesanan(order.id, "SEDANG_DIMASAK" as orders_status_pesanan)} className="px-3 py-2 rounded bg-indigo-500 text-white">
                                  Proses (Masak)
                                </button>
                              )}
                              {order.status_pesanan === "SEDANG_DIMASAK" && (
                                <button onClick={() => handleUpdateStatusPesanan(order.id, "SIAP_DIAMBIL" as orders_status_pesanan)} className="px-3 py-2 rounded bg-purple-500 text-white">
                                  Tandai Siap Diambil
                                </button>
                              )}
                              {order.status_pesanan === "SIAP_DIAMBIL" && (
                                <button onClick={() => handleUpdateStatusPesanan(order.id, "SELESAI" as orders_status_pesanan)} className="px-3 py-2 rounded bg-gray-800 text-white">
                                  Tandai Selesai
                                </button>
                              )}
                            </div>
                          )}

                          {/* Tandai LUNAS manual untuk cash */}
                          {order.status_pembayaran === "BELUM_BAYAR" && (
                            <button onClick={() => handleUpdateStatus(order.id, "LUNAS" as orders_status_pembayaran)} className="px-3 py-2 rounded bg-blue-500 text-white">
                              Tandai LUNAS
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>

      {/* Modal Pembatalan */}
      <AnimatePresence>
        {cancelModal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setCancelModal({ open: false, reason: "", orderId: undefined })} />
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Batalkan Pesanan</h3>
                <button onClick={() => setCancelModal({ open: false, reason: "", orderId: undefined })} className="p-1 rounded">
                  <X />
                </button>
              </div>
              <p className="text-sm mb-3">Masukkan alasan pembatalan pesanan:</p>
              <textarea value={cancelModal.reason} onChange={(e) => setCancelModal((c) => ({ ...c, reason: e.target.value }))} className="w-full border p-2 rounded mb-4" rows={4} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setCancelModal({ open: false, reason: "", orderId: undefined })} className="px-3 py-2 rounded bg-gray-100">
                  Batal
                </button>
                <button onClick={confirmCancel} className="px-3 py-2 rounded bg-red-600 text-white">
                  Konfirmasi Batalkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast sederhana */}
      <AnimatePresence>
        {toast1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`fixed right-6 bottom-6 z-50 p-3 rounded shadow ${toast1.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
            {toast1.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
