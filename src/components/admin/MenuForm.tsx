"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Tipe data (bisa diimpor dari file terpusat nanti)
type Kategori = { id: number; nama_kategori: string; };
type Produk = { id: number; nama_produk: string; harga: number; deskripsi: string; kategori_id: number; gambar_url: string | null; };

interface MenuFormProps {
    produkToEdit: Produk | null;
    onSuccess: () => void;
}

export function MenuForm({ produkToEdit, onSuccess }: MenuFormProps) {
    const [namaProduk, setNamaProduk] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [harga, setHarga] = useState("");
    const [kategoriId, setKategoriId] = useState("");
    const [gambar, setGambar] = useState<File | null>(null);
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchKategori = async () => {
            const res = await fetch('/api/kategori');
            if (res.ok) setKategoriList(await res.json());
        };
        fetchKategori();
    }, []);

    // --- PERBAIKAN LOGIKA ADA DI SINI ---
    useEffect(() => {
        // Hanya isi form jika produkToEdit ada DAN daftar kategori sudah terisi
        if (produkToEdit && kategoriList.length > 0) {
            setNamaProduk(produkToEdit.nama_produk);
            setDeskripsi(produkToEdit.deskripsi || "");
            setHarga(produkToEdit.harga.toString());
            setKategoriId(produkToEdit.kategori_id.toString());
        } else if (!produkToEdit) {
            // Reset form jika ini adalah mode "Tambah Menu Baru"
            setNamaProduk(""); 
            setDeskripsi(""); 
            setHarga(""); 
            setKategoriId("");
        }
    }, [produkToEdit, kategoriList]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('nama_produk', namaProduk);
        formData.append('deskripsi', deskripsi);
        formData.append('harga', harga);
        formData.append('kategori_id', kategoriId);
        if (gambar) formData.append('gambar', gambar);

        const url = produkToEdit ? `/api/menu/${produkToEdit.id}` : '/api/menu';
        const method = produkToEdit ? 'PUT' : 'POST';

        const response = await fetch(url, { method, body: formData });

        if (response.ok) {
            onSuccess(); // Panggil fungsi onSuccess dari parent
            toast.success(produkToEdit ? "Menu berhasil diupdate!" : "Menu baru berhasil ditambahkan!");
        } else {
            alert("Gagal menyimpan data.");
            
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <Input placeholder="Nama Produk" value={namaProduk} onChange={e => setNamaProduk(e.target.value)} required />
            <Textarea placeholder="Deskripsi" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required />
            <Input type="number" placeholder="Harga" value={harga} onChange={e => setHarga(e.target.value)} required />
            <Select value={kategoriId} onValueChange={setKategoriId} required>
                <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                <SelectContent>
                    {kategoriList.map(k => <SelectItem key={k.id} value={k.id.toString()}>{k.nama_kategori}</SelectItem>)}
                </SelectContent>
            </Select>
            <Input type="file" onChange={e => setGambar(e.target.files?.[0] || null)} />
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Menyimpan...' : 'Simpan'}</Button>
        </form>
    );
}