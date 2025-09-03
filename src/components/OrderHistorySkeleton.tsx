// src/components/OrderHistorySkeleton.tsx

export default function OrderHistorySkeleton() {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="text-right">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }