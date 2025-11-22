import React from "react";
import { Menu, X, User, BookOpen, Users, Trophy, Newspaper, UserCheck, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ChevronRight, GraduationCap, Monitor, Wrench, Calculator, Palette, Camera, Heart, Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ahmad Rizki",
      role: "Siswa XII RPL",
      image: "AR",
      text: "SMK Negeri Makassar memberikan pendidikan yang sangat berkualitas. Saya merasa siap menghadapi dunia kerja setelah lulus nanti."
    },
    {
      name: "Siti Nurhaliza",
      role: "Siswa XII AKL",
      image: "SN",
      text: "Fasilitas yang lengkap dan guru-guru yang berpengalaman membuat saya semakin termotivasi untuk belajar dan berkarya."
    },
    {
      name: "Muhammad Fajar",
      role: "Siswa XII TKJ",
      image: "MF",
      text: "Program magang industri di SMK Negeri Makassar sangat membantu saya memahami dunia kerja yang sesungguhnya."
    }
  ];

  return (
    <section className="py-20 bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Testimoni Siswa
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.image}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-blue-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;