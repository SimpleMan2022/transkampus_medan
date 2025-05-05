'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useRef } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    email: string;
    linkedin: string;
    github: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Andi Wijaya",
    role: "Project Manager",
    bio: "Mahasiswa Teknik Informatika dengan spesialisasi dalam GIS dan pengembangan web.",
    image: "/images/person.jpg",
    social: {
      email: "mailto:andi@example.com",
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
    },
  },
  {
    id: 2,
    name: "Budi Santoso",
    role: "Backend Developer",
    bio: "Spesialis database spasial dan pengembangan API untuk aplikasi GIS.",
    image: "/images/person.jpg",
    social: {
      email: "mailto:budi@example.com",
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
    },
  },
  {
    id: 3,
    name: "Cindy Paramita",
    role: "UI/UX Designer",
    bio: "Desainer antarmuka pengguna dengan fokus pada pengalaman pengguna yang intuitif.",
    image: "/images/person.jpg",
    social: {
      email: "mailto:cindy@example.com",
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
    },
  },
  {
    id: 4,
    name: "Deni Kurniawan",
    role: "Frontend Developer",
    bio: "Pengembang frontend dengan keahlian dalam React dan visualisasi data.",
    image: "/images/person.jpg",
    social: {
      email: "mailto:deni@example.com",
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
    },
  },
  {
    id: 5,
    name: "Eka Putri",
    role: "GIS Specialist",
    bio: "Ahli sistem informasi geografis dengan pengalaman dalam pemetaan transportasi.",
    image: "/images/person.jpg",
    social: {
      email: "mailto:eka@example.com",
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
    },
  },
  {
    id: 6,
    name: "Fajar Ramadhan",
    role: "Data Analyst",
    bio: "Analis data dengan keahlian dalam pengolahan data spasial dan visualisasi.",
    image: "/images/person.jpg",
    social: {
      email: "mailto:fajar@example.com",
      linkedin: "https://linkedin.com/in/username",
      github: "https://github.com/username",
    },
  },
];

export function TeamSection() {
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
      id="team"
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
            <span className="text-sm font-medium text-emerald-700">Tim Kami</span>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-5xl max-w-3xl"
            variants={childVariants}
          >
            Kenali <span className="text-emerald-600">Tim</span> di Balik TransKampus Medan
          </motion.h2>
          <motion.p
            className="max-w-[800px] text-muted-foreground md:text-xl/relaxed"
            variants={childVariants}
          >
            Kami adalah tim mahasiswa yang berdedikasi untuk meningkatkan aksesibilitas transportasi kampus di Medan
          </motion.p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={childVariants}
        >
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

interface TeamMemberCardProps {
  member: TeamMember;
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  const fallbackImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=10b981&color=fff&size=256`;
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/40 to-transparent"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={fallbackImageUrl}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-emerald-100 font-medium">{member.role}</p>
          <motion.p
            className="text-white/80 text-sm"
            
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {member.bio}
          </motion.p>
          <motion.div
            className="flex space-x-3 pt-2"
            
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={member.social.email} className="text-white hover:text-emerald-200">
              <motion.div whileHover={{ scale: 1.25 }} transition={{ duration: 0.3 }}>
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </motion.div>
            </Link>
            <Link href={member.social.linkedin} className="text-white hover:text-emerald-200">
              <motion.div whileHover={{ scale: 1.25 }} transition={{ duration: 0.3 }}>
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </motion.div>
            </Link>
            <Link href={member.social.github} className="text-white hover:text-emerald-200">
              <motion.div whileHover={{ scale: 1.25 }} transition={{ duration: 0.3 }}>
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}