'use client';

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Map, ArrowRight } from "lucide-react";
import { useRef } from "react";

export function HeroSection() {
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
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container px-4 md:px-6 relative">
        <motion.div
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-100 blur-3xl opacity-70"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-100 blur-3xl opacity-70"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div className="space-y-6 relative z-10" variants={childVariants}>
            <motion.div
              className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              variants={childVariants}
            >
              <span className="text-sm font-medium text-emerald-700">Sistem Informasi Geografis</span>
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              variants={childVariants}
            >
              Transportasi Kampus Medan yang <span className="text-emerald-600">Terintegrasi</span>
            </motion.h1>
            <motion.p className="text-xl text-muted-foreground" variants={childVariants}>
              Temukan rute transportasi terbaik antar kampus di Medan dengan sistem informasi geografis yang lengkap dan akurat.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-3" variants={childVariants}>
              <Link href="/map">
                <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center cursor-pointer">
                    Jelajahi Peta
                    <Map className="ml-2 h-5 w-5" />
                  </button>
                </motion.div>
              </Link>
              <Link href="/map">
                <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                  <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium py-3 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center cursor-pointer">
                    Lihat Rute
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div className="relative z-10" variants={childVariants}>
            <motion.div
              className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl hidden sm:block"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent z-10" />
              <Image
                src="/images/hero.png"
                alt="Peta Transportasi Kampus Medan"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}