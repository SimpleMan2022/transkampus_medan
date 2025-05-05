'use client';

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Map, ArrowRight } from "lucide-react";
import { useRef } from "react";

export function CTASection() {
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
      id="contact"
      className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-100"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-100"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="container px-4 md:px-6">
        <motion.div
          className="mx-auto max-w-3xl"
          variants={childVariants}
        >
          <motion.div
            className="rounded-2xl bg-white p-8 shadow-xl"
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            variants={childVariants}
          >
            <motion.div
              className="flex flex-col items-center justify-center space-y-6 text-center"
              variants={childVariants}
            >
              <motion.div className="space-y-3" variants={childVariants}>
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  variants={childVariants}
                >
                  Mulai Jelajahi <span className="text-emerald-600">Sekarang</span>
                </motion.h2>
                <motion.p
                  className="max-w-[700px] text-muted-foreground md:text-xl/relaxed"
                  variants={childVariants}
                >
                  Temukan rute transportasi terbaik antar kampus di Medan dengan TransKampus Medan
                </motion.p>
              </motion.div>
              <motion.div
                className="flex flex-col gap-3 sm:flex-row"
                variants={childVariants}
              >
                <Link href="/map">
                  <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center cursor-pointer">
                      Jelajahi Peta
                      <Map className="ml-2 h-5 w-5" />
                    </button>
                  </motion.div>
                </Link>
                <Link href="/">
                  <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                    <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium py-3 px-6 rounded-lg w-full sm:w-auto flex items-center justify-center cursor-pointer">
                      Hubungi Kami
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}