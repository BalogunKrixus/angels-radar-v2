// Development seed data for AngelsRadar. Every row here is flagged
// isSeedData: true so it's clearly distinguishable from real submissions.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PASSWORD = "password123";

async function hash(pw: string) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  const passwordHash = await hash(PASSWORD);

  console.log("Seeding admin...");
  await prisma.user.upsert({
    where: { email: "admin@angelsradar.dev" },
    update: {},
    create: {
      email: "admin@angelsradar.dev",
      passwordHash,
      role: "admin",
      isSeedData: true,
    },
  });

  console.log("Seeding founders + startups...");
  const startupSeeds = [
    {
      email: "founder.greentech@angelsradar.dev",
      founderName: "Amara Nwosu",
      status: "approved",
      name: "[Seed] GreenTech Africa",
      tagline: "Solar-powered cold storage for smallholder farmers.",
      industry: "Climate",
      country: "Nigeria",
      stage: "seed",
      amountRaising: 250000,
    },
    {
      email: "founder.paypoint@angelsradar.dev",
      founderName: "Kwame Asante",
      status: "approved",
      name: "[Seed] PayPoint",
      tagline: "Mobile money rails for informal merchants.",
      industry: "Fintech",
      country: "Ghana",
      stage: "series_a",
      amountRaising: 1500000,
    },
    {
      email: "founder.farmledger@angelsradar.dev",
      founderName: "Wanjiru Kamau",
      status: "approved",
      name: "[Seed] FarmLedger",
      tagline: "Supply chain traceability for East African agriculture.",
      industry: "Agritech",
      country: "Kenya",
      stage: "pre_seed",
      amountRaising: 75000,
    },
    {
      email: "founder.mediconnect@angelsradar.dev",
      founderName: "Thabo Nkosi",
      status: "pending",
      name: "[Seed] MediConnect",
      tagline: "Telehealth for underserved communities.",
      industry: "Healthtech",
      country: "South Africa",
      stage: "seed",
      amountRaising: 400000,
    },
    {
      email: "founder.eduspark@angelsradar.dev",
      founderName: "Fatima Diallo",
      status: "changes_requested",
      name: "[Seed] EduSpark",
      tagline: "Offline-first learning for rural schools.",
      industry: "Edtech",
      country: "Senegal",
      stage: "pre_seed",
      amountRaising: 50000,
      adminNote: "Please add more detail on your traction and revenue model before we can approve.",
    },
    {
      email: "founder.rejected@angelsradar.dev",
      founderName: "Sample Founder",
      status: "rejected",
      name: "[Seed] QuickCart",
      tagline: "Same-day delivery marketplace.",
      industry: "E-commerce",
      country: "Egypt",
      stage: "other",
      amountRaising: 100000,
      adminNote: "Overlaps too closely with an existing approved startup in our network.",
    },
    {
      email: "founder.draft@angelsradar.dev",
      founderName: "Draft Founder",
      status: "draft",
      name: "[Seed] Untitled Startup",
      tagline: "",
      industry: "SaaS",
      country: "Rwanda",
      stage: "pre_seed",
      amountRaising: null as number | null,
    },
  ];

  const startupIds: Record<string, string> = {};

  for (const s of startupSeeds) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: { email: s.email, passwordHash, role: "founder", isSeedData: true },
    });

    const founder = await prisma.founderProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        fullName: s.founderName,
        title: "Founder & CEO",
      },
    });

    const startup = await prisma.startup.upsert({
      where: { founderId: founder.id },
      update: {},
      create: {
        founderId: founder.id,
        name: s.name,
        tagline: s.tagline,
        description: `${s.name} is a seed-data startup used for demoing AngelsRadar locally.`,
        country: s.country,
        industry: s.industry,
        stage: s.stage,
        amountRaising: s.amountRaising,
        currency: "USD",
        status: s.status,
        adminNote: s.adminNote ?? null,
        submittedAt: s.status === "draft" ? null : new Date(),
        approvedAt: s.status === "approved" ? new Date() : null,
        isSeedData: true,
        problem: "Placeholder problem statement for seed data.",
        solution: "Placeholder solution statement for seed data.",
      },
    });

    startupIds[s.name] = startup.id;
  }

  console.log("Seeding investors...");
  const investorSeeds = [
    {
      email: "investor.approved1@angelsradar.dev",
      fullName: "Sarah Mensah",
      organisation: "Savanna Ventures",
      investorType: "vc",
      country: "Ghana",
      status: "approved",
      sectors: ["Fintech", "Agritech"],
      countries: ["Ghana", "Nigeria", "Kenya"],
      stages: ["pre_seed", "seed"],
      ticketRanges: ["50k_250k", "250k_500k"],
    },
    {
      email: "investor.approved2@angelsradar.dev",
      fullName: "David Okoro",
      organisation: "Lagos Angel Network",
      investorType: "angel",
      country: "Nigeria",
      status: "approved",
      sectors: ["Climate", "Healthtech"],
      countries: ["Nigeria", "South Africa"],
      stages: ["seed", "series_a"],
      ticketRanges: ["under_50k", "50k_250k"],
    },
    {
      email: "investor.pending@angelsradar.dev",
      fullName: "Grace Mwangi",
      organisation: "",
      investorType: "angel",
      country: "Kenya",
      status: "pending",
      sectors: [],
      countries: [],
      stages: [],
      ticketRanges: [],
    },
    {
      email: "investor.changes@angelsradar.dev",
      fullName: "Ibrahim Toure",
      organisation: "Sahel Capital",
      investorType: "fund",
      country: "Mali",
      status: "changes_requested",
      sectors: ["SaaS"],
      countries: ["Mali"],
      stages: ["series_a"],
      ticketRanges: ["500k_1m"],
      adminNote: "Please add your fund's website so we can verify your organisation.",
    },
  ];

  for (const inv of investorSeeds) {
    const user = await prisma.user.upsert({
      where: { email: inv.email },
      update: {},
      create: { email: inv.email, passwordHash, role: "investor", isSeedData: true },
    });

    await prisma.investorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        fullName: inv.fullName,
        organisation: inv.organisation,
        investorType: inv.investorType,
        country: inv.country,
        status: inv.status,
        adminNote: inv.adminNote ?? null,
        approvedAt: inv.status === "approved" ? new Date() : null,
        isSeedData: true,
        preferences: {
          create: {
            sectors: inv.sectors,
            countries: inv.countries,
            stages: inv.stages,
            ticketRanges: inv.ticketRanges,
          },
        },
      },
    });
  }

  console.log("Seeding introduction requests...");
  const sarah = await prisma.investorProfile.findFirst({ where: { fullName: "Sarah Mensah" } });
  const david = await prisma.investorProfile.findFirst({ where: { fullName: "David Okoro" } });

  if (sarah && startupIds["[Seed] GreenTech Africa"]) {
    await prisma.introductionRequest.upsert({
      where: { id: "seed-intro-1" },
      update: {},
      create: {
        id: "seed-intro-1",
        investorId: sarah.id,
        startupId: startupIds["[Seed] GreenTech Africa"],
        status: "new",
        isSeedData: true,
      },
    });
  }

  if (david && startupIds["[Seed] PayPoint"]) {
    await prisma.introductionRequest.upsert({
      where: { id: "seed-intro-2" },
      update: {},
      create: {
        id: "seed-intro-2",
        investorId: david.id,
        startupId: startupIds["[Seed] PayPoint"],
        status: "contacted",
        investorNote: "Interested in leading the Series A.",
        isSeedData: true,
      },
    });
  }

  console.log("\nSeed complete. Dev accounts (password: %s):", PASSWORD);
  console.log("  Admin:     admin@angelsradar.dev");
  console.log("  Founders:  founder.greentech@angelsradar.dev, founder.paypoint@angelsradar.dev, ...");
  console.log("  Investors: investor.approved1@angelsradar.dev, investor.approved2@angelsradar.dev, ...");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
