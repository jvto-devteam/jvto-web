import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/site-config";
import { type Metadata } from 'next';
import { operations } from "@/lib/legal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: 'Our Team – Local Guides & Tourism Professionals',
    description: 'Meet the JVTO team: local guides from Bromo and Ijen communities, tourist police-led leadership, and dedicated operations professionals.',
};

async function getCrew() {
  return await prisma.crew_members.findMany({
    where : {
      id : {
        notIn: [9,56,58]
      }
    }
  });
}

export default async function OurTeamPage() {
  const crew = await getCrew();
  console.log(crew);
  
  const team = [
    {
      name: SITE_CONFIG.founder.name,
      role: SITE_CONFIG.founder.role,
      bio: "Agung is an active Tourist Police officer in East Java. His experience handling real-world tourist safety cases informs JVTO's entire operational and safety culture. He founded the company to provide a safer, more transparent way for international visitors to experience the region's volcanoes.",
      image: {
        url : '/founder/mr-sam-tourist-police-portrait.png',
        alt_text : 'MR SAM'
      }
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-accent">
          <div className="container mx-auto px-4 text-center">
             <nav className="mb-8 text-sm text-muted-foreground">
                <Link href="/why-jvto" className="hover:text-primary">Why JVTO</Link>
                <span className="mx-2">›</span>
                <span className="text-foreground font-medium">Our Team</span>
            </nav>

            <h1 className="font-black uppercase text-4xl md:text-5xl tracking-tight">
              Our Team
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              JVTO is run by a dedicated local team from East Java. Our founder's direct involvement in tourist police operations and our network of experienced local guides are the foundation of our safety-first approach.
            </p>
          </div>
        </section>
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {team.map(member => (
                        member.image &&
                        <div key={member.name} className="grid md:grid-cols-3 gap-8 items-center bg-card p-8 rounded-sm shadow-md border">
                            <div className="md:col-span-1">
                                <Image 
                                    src={member.image.url} 
                                    alt={member.image.alt_text}
                                    width={400}
                                    height={400}
                                    className="rounded-sm object-cover w-full aspect-square"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <h2 className="font-black uppercase text-2xl">{member.name}</h2>
                                <p className="text-primary font-semibold mb-4">{member.role}</p>
                                <p className="text-muted-foreground">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                    <div className="text-center mt-12">
                        <h3 className="font-black uppercase text-2xl">Local Guides & Drivers</h3>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">The rest of our team consists of experienced local drivers and certified guides from the communities around Bromo, Ijen, and Tumpak Sewu. We believe in hiring locally to provide you with authentic expertise and to support the regional economy.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}

    