"use client";

import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeCourses: 0,
    newUsers: 0,
  });

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await api.get("/users/Stats");
      if (res.data?.data) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 📊 Chart data
  const barData = {
    labels: ["Total Users", "New Users", "Total Courses", "Active Courses"],
    datasets: [
      {
        label: "Dashboard Stats",
        data: [
          stats.totalUsers,
          stats.newUsers,
          stats.totalCourses,
          stats.activeCourses,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const pieData = {
    labels: ["Active Courses", "Inactive Courses"],
    datasets: [
      {
        data: [
          stats.activeCourses,
          stats.totalCourses - stats.activeCourses,
        ],
        backgroundColor: ["#10b981", "#f87171"],
      },
    ],
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 font-medium">Total Courses</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalCourses}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 font-medium">Total Users</h3>
          <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 font-medium">Active Courses</h3>
          <p className="text-2xl font-bold mt-2">{stats.activeCourses}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500 font-medium">New Users</h3>
          <p className="text-2xl font-bold mt-2">{stats.newUsers}</p>
        </div>
      </div>

      {/* 📊 Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">Users & Courses Overview</h3>
          <Bar data={barData} />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">Course Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </>
  );
}
