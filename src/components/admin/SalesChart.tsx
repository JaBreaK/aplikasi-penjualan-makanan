"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ChartData = {
    name: string;
    total: number;
}

export default function SalesChart() {
    const [data, setData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/dashboard/sales-chart');
            if (response.ok) {
                setData(await response.json());
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4">Pendapatan 7 Hari Terakhir</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis width={80} tickFormatter={(value) => `Rp${(value as number / 1000).toLocaleString('id-ID')}k`} fontSize={12} />
                    <Tooltip formatter={(value) => `Rp${(value as number).toLocaleString('id-ID')}`} />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="Pendapatan" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}