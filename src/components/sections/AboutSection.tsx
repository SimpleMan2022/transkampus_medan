'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StatCardProps {
  value: string;
  label: string;
}

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.section
      ref={ref}
      id="about"
      className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="absolute inset-0 -z-10 opacity-5">
        <motion.div
          className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-emerald-600"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute left-1/4 bottom-1/4 h-96 w-96 rounded-full bg-emerald-400"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div className="space-y-6" variants={childVariants}>
            <motion.div
              className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              variants={childVariants}
            >
              <span className="text-sm font-medium text-emerald-700">Tentang Kami</span>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              variants={childVariants}
            >
              TransKampus <span className="text-emerald-600">Medan</span>
            </motion.h2>
            <motion.div className="space-y-4" variants={childVariants}>
              <motion.p className="text-muted-foreground md:text-xl/relaxed" variants={childVariants}>
                TransKampus Medan adalah sistem informasi geografis yang dirancang untuk memudahkan mahasiswa, dosen, dan masyarakat umum dalam menemukan informasi transportasi antar kampus di Medan.
              </motion.p>
              <motion.p className="text-muted-foreground md:text-xl/relaxed" variants={childVariants}>
                Dengan data spasial yang akurat dan terintegrasi, kami menyediakan informasi lengkap tentang kampus, rute transportasi, stasiun/halte, dan fasilitas kampus di seluruh Medan.
              </motion.p>
            </motion.div>
          </motion.div>
          <motion.div className="grid grid-cols-2 gap-4" variants={childVariants}>
            <StatCard value="15+" label="Kampus Terintegrasi" />
            <StatCard value="50+" label="Rute Transportasi" />
            <StatCard value="100+" label="Stasiun & Halte" />
            <StatCard value="21" label="Kecamatan" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-3 rounded-xl border bg-white p-6 shadow-sm"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-3xl font-bold text-emerald-600">{value}</h3>
      <p className="text-center font-medium text-muted-foreground">{label}</p>
    </motion.div>
  );
}