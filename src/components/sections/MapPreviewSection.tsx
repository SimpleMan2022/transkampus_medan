'use client';

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Map } from "lucide-react";
import { useRef } from "react";

export function MapPreviewSection() {
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
      id="map"
      className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
      </div>
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center mb-10"
          variants={childVariants}
        >
          <motion.div
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            variants={childVariants}
          >
            <span className="text-sm font-medium text-emerald-700">Peta Interaktif</span>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-2xl"
            variants={childVariants}
          >
            Jelajahi <span className="text-emerald-600">Rute Terbaik</span> Antar Kampus di Medan
          </motion.h2>
          <motion.p
            className="max-w-[800px] text-muted-foreground md:text-xl/relaxed"
            variants={childVariants}
          >
            Gunakan peta interaktif kami untuk menemukan rute transportasi yang efisien
          </motion.p>
        </motion.div>
        <motion.div className="mx-auto max-w-5xl" variants={childVariants}>
          <motion.div
            className="relative rounded-2xl overflow-hidden border shadow-xl"
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            variants={childVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            <Image
              src="/images/map-preview.jpg"
              alt="Peta Interaktif TransKampus Medan"
              width={1000}
              height={600}
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6">
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl max-w-md"
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                variants={childVariants}
              >
                <motion.h3
                  className="text-2xl font-bold text-white mb-2"
                  variants={childVariants}
                >
                  Peta Lengkap
                </motion.h3>
                <motion.p
                  className="text-white/80 mb-4"
                  variants={childVariants}
                >
                  Akses semua fitur peta interaktif dengan detail lengkap setiap rute dan lokasi
                </motion.p>
                <Link href="/map">
                  <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg w-full flex items-center justify-center cursor-pointer">
                      Buka Peta Lengkap
                      <Map className="ml-2 h-5 w-5" />
                    </button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}