import React from 'react';

function StatCard({ label, value }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="text-gray-500">{label}</div>
      <div className="text-3xl font-semibold text-black">{value}</div>
    </div>
  );
}

export default StatCard;
