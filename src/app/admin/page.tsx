"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Star } from "lucide-react";

type Stats = {
  pendapatanHariIni: number;
  jumlahPesananBaru: number;
  menuTerlaris: string;
};

const StatCard = ({ icon, title, value, colorClass }: { icon: React.ReactNode, title: string, value: string | number, colorClass: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: colorClass }}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: `${colorClass}20`}}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  if (isLoading) return <p className="p-8">Memuat dashboard...</p>;
  if (!stats) return <p className="p-8">Gagal memuat data.</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<DollarSign color="#16a34a" />}
          title="Pendapatan Hari Ini"
          value={`Rp ${stats.pendapatanHariIni.toLocaleString('id-ID')}`}
          colorClass="#16a34a"
        />
        <StatCard
          icon={<ShoppingCart color="#ea580c" />}
          title="Pesanan Baru (Belum Bayar)"
          value={stats.jumlahPesananBaru}
          colorClass="#ea580c"
        />
        <StatCard
          icon={<Star color="#ca8a04" />}
          title="Menu Terlaris"
          value={stats.menuTerlaris}
          colorClass="#ca8a04"
        />
      </div>
    </main>
  );
}