import { Code, Gem, Globe } from "lucide-react";
import { CustomCard } from "@/components/animations/animated-glow-card";
import Link from "next/link";

const cards = [
  {
    icon: Code,
    label: "Resume & About Me",
    color: "text-aurora-electric-pink",
    description: "Explore my professional career and milestones.",
    link: "/resume-about",
  },
  {
    icon: Gem,
    label: "Skills",
    color: "text-aurora-french-violet",
    description: "Discover my technical skills and expertise.",
    link: "/skills",
  },
  {
    icon: Globe,
    label: "Colors",
    color: "text-aurora-royal-blue",
    description: "Learn how I chose this site's color palette.",
    link: "/colors",
  },
];

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 text-center">
      <h2 className="text-lg font-light tracking-wider text-muted-foreground sm:text-xl">
        FULL STACK DEVELOPER
      </h2>

      <p className="max-w-lg text-base text-muted-foreground sm:text-lg md:max-w-xl">
        Crafting elegant solutions through clean code and intuitive design. Specializing in modern
        web technologies and scalable architectures.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6">
        <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-8">
          {cards.map((item, index) => (
            <Link key={index} href={item.link} passHref>
              <CustomCard key={index} size="xl" effect="glow" gradient="adaptive">
                <item.icon className={`mb-4 h-8 w-8 ${item.color}`} />
                <span className="text-lg font-medium">{item.label}</span>
                <span className="text-md text-muted-foreground">{item.description}</span>
              </CustomCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
