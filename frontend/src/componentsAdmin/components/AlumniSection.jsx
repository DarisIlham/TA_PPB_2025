import React from "react";
import { Menu, X, User, BookOpen, Users, Trophy, Newspaper, UserCheck, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ChevronRight, GraduationCap, Monitor, Wrench, Calculator, Palette, Camera, Heart, Star } from 'lucide-react';

const AlumniSection = () => {
  const alumni = [
    {
      name: "Andi Pratama",
      profession: "Software Engineer di PT. Teknologi Maju",
      image: "AP",
      description: "Lulusan TKJ 2020 yang kini bekerja sebagai software engineer di perusahaan teknologi terkemuka."
    },
    {
      name: "Nurul Fadillah",
      profession: "Accounting Manager di PT. Mandiri Sejahtera",
      image: "NF",
      description: "Alumni jurusan Akuntansi 2019 yang berhasil meraih posisi manajer di perusahaan besar."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Profil Alumni SMK Negeri Makassar
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {alumni.map((person, index) => (
            <div key={index} className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                {person.image}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{person.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{person.profession}</p>
                <p className="text-gray-600">{person.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlumniSection