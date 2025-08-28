// src/components/MenuCardSkeleton.tsx

export default function MenuCardSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        {/* Placeholder untuk Gambar */}
        <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
  
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex-grow">
            {/* Placeholder untuk Judul */}
            <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
            {/* Placeholder untuk Deskripsi */}
            <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
            {/* Placeholder untuk Harga */}
            <div className="h-5 w-1/3 bg-gray-300 rounded animate-pulse mt-4"></div>
          </div>
          {/* Placeholder untuk Tombol */}
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse mt-4"></div>
        </div>
      </div>
    );
  }