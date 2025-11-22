import React from "react";
import { useState } from "react";
import { Menu, X, User, BookOpen, Users, Trophy, Newspaper, UserCheck, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ChevronRight, GraduationCap, Monitor, Wrench, Calculator, Palette, Camera, Heart, Star } from 'lucide-react';

const DepartmentsSection = () => {
  const departments = [
    {
      icon: <Monitor className="w-8 h-8 text-white" />,
      name: "Teknik Komputer & Jaringan",
      description: "Mempelajari teknologi komputer dan jaringan"
    },
    {
      icon: <Calculator className="w-8 h-8 text-white" />,
      name: "Akuntansi & Keuangan",
      description: "Menguasai bidang akuntansi dan keuangan"
    },
    {
      icon: <Palette className="w-8 h-8 text-white" />,
      name: "Desain Komunikasi Visual",
      description: "Kreativitas dalam desain visual"
    },
    {
      icon: <Wrench className="w-8 h-8 text-white" />,
      name: "Teknik Mesin",
      description: "Keahlian dalam bidang teknik mesin"
    },
    {
      icon: <Camera className="w-8 h-8 text-white" />,
      name: "Multimedia",
      description: "Produksi konten multimedia"
    },
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      name: "Keperawatan",
      description: "Pelayanan kesehatan dan keperawatan"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-white" />,
      name: "Administrasi Perkantoran",
      description: "Manajemen administrasi perkantoran"
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      name: "Pemasaran",
      description: "Strategi pemasaran dan penjualan"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Jurusan Di SMK Negeri Makassar
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => (
            <div key={index} className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors">
              <div className="flex justify-center mb-4">
                {dept.icon}
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">{dept.name}</h3>
              <p className="text-blue-100 text-center text-sm">{dept.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;