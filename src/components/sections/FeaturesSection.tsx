'use client';

import { motion, useInView } from "framer-motion";
import { School, Bus, MapPin } from "lucide-react";
import { useRef } from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeaturesSection() {
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
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-white"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
          variants={childVariants}
        >
          <motion.div
            className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 mb-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            variants={childVariants}
          >
            <span className="text-sm font-medium text-emerald-700">Fitur Utama</span>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-5xl max-w-3xl"
            variants={childVariants}
          >
            Solusi Transportasi <span className="text-emerald-600">Kampus</span>
          </motion.h2>
          <motion.p
            className="max-w-[800px] text-muted-foreground md:text-xl/relaxed"
            variants={childVariants}
          >
            TransKampus Medan menyediakan informasi lengkap tentang transportasi antar kampus di Medan
          </motion.p>
        </motion.div>
        <motion.div className="grid gap-8 md:grid-cols-3" variants={childVariants}>
          <FeatureCard
            icon={<School className="h-10 w-10 text-emerald-600" />}
            title="Informasi Kampus"
            description="Data lengkap tentang kampus di Medan, termasuk lokasi, jumlah fakultas, dan jumlah mahasiswa."
          />
          <FeatureCard
            icon={<Bus className="h-10 w-10 text-emerald-600" />}
            title="Rute Transportasi"
            description="Informasi rute angkutan umum, bus kampus, dan transportasi lainnya dengan jadwal dan tarif."
          />
          <FeatureCard
            icon={<MapPin className="h-10 w-10 text-emerald-600" />}
            title="Stasiun & Halte"
            description="Lokasi stasiun dan halte dengan informasi jam operasional dan kapasitas."
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-50"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <motion.div
          className="rounded-xl bg-emerald-50 p-4"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}