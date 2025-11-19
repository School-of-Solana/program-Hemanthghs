"use client";

export default function Snackbar({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div className="
      fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg
      animate-slide-up
    ">
      {message}
    </div>
  );
}
