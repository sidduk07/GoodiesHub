import pkg from "pg";
const { Pool } = pkg;
import { randomUUID } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub";

const pool = new Pool({ connectionString: DATABASE_URL });

async function addSwagItems() {
    console.log("🎁 Adding new swag opportunities...");

    const client = await pool.connect();

    const items = [
        {
            title: "AWS Community Builder Program",
            company: "Amazon Web Services",
            summary: "Join the global community of AWS enthusiasts to get exclusive swag, $500+ AWS credits, and private Slack access.",
            content: `The AWS Community Builder program is for technical enthusiasts who love sharing knowledge about AWS cloud services.

**What you'll get:**
- Exclusive AWS swag pack (t-shirts, stickers, gear)
- $500+ AWS credits annually
- Private Slack community access with AWS teams
- Early access to new AWS services and features
- Speaking opportunities at AWS Summits and re:Invent
- Direct mentorship from AWS Developer Advocates`,
            category: "Program",
            tags: JSON.stringify(["AWS", "Cloud", "T-Shirt", "Credits", "Community"]),
            eligibility: "Must be 18+. Active technical content creator (blogs, videos, talks). Passionate about AWS and cloud technologies.",
            requirements: JSON.stringify([
                { step: 1, title: "Apply Online", description: "Fill out the application form with your technical profile" },
                { step: 2, title: "Share Your Content", description: "Link your blogs, videos, or talks about AWS" },
                { step: 3, title: "Wait for Review", description: "Applications reviewed quarterly" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "Swag Pack", description: "Exclusive AWS gear including t-shirts" },
                { icon: "☁️", title: "AWS Credits", description: "$500+ in annual service credits" },
                { icon: "🎤", title: "Speaking Ops", description: "Present at AWS events" }
            ]),
            official_link: "https://aws.amazon.com/developer/community/community-builders/",
            is_featured: true,
        },
        {
            title: "Google Cloud Ready Facilitator Program 2026",
            company: "Google",
            summary: "Become a Cloud Ready Facilitator to earn Google Cloud skill badges, credits, and exclusive Google swag.",
            content: `The Google Cloud Ready Facilitator Program helps you build skills in cloud computing while earning exclusive rewards.

**Program Benefits:**
- Google Cloud skill badges and certifications
- Exclusive Google merchandise (t-shirts, bags, accessories)
- Google Cloud credits for hands-on labs
- Access to Google Cloud community events
- Certificate of completion
- LinkedIn badge recognition`,
            category: "Program",
            tags: JSON.stringify(["Google", "Cloud", "Badges", "T-Shirt", "Learning"]),
            eligibility: "Open to students and professionals interested in cloud computing. Must complete required labs and courses.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on the official program page" },
                { step: 2, title: "Complete Labs", description: "Finish required Google Cloud Skills Boost labs" },
                { step: 3, title: "Earn Badges", description: "Collect skill badges by completing challenges" },
                { step: 4, title: "Claim Swag", description: "Redeem points for exclusive Google goodies" }
            ]),
            perks: JSON.stringify([
                { icon: "🎓", title: "Skill Badges", description: "Google Cloud certifications" },
                { icon: "👕", title: "Google Swag", description: "T-shirts and accessories" },
                { icon: "☁️", title: "Cloud Credits", description: "Free Google Cloud usage" }
            ]),
            official_link: "https://cloud.google.com/training",
            is_featured: true,
        },
        {
            title: "Salesforce Trailblazer Quest 2026",
            company: "Salesforce",
            summary: "Complete Trailhead learning modules to earn a FREE limited-edition Salesforce hoodie and skill certifications.",
            content: `Salesforce Trailblazer Quest is a gamified learning program for college students to build skills in CRM, AI, and cloud technologies.

**Why Join:**
- Learn in-demand Salesforce skills for FREE
- Earn a limited-edition Trailblazer hoodie
- Get certified in Salesforce technologies
- Build your Trailblazer community profile
- Connect with Salesforce recruiters and hiring partners
- Access to exclusive Trailblazer community events`,
            category: "Program",
            tags: JSON.stringify(["Salesforce", "Hoodie", "Learning", "CRM", "Students"]),
            eligibility: "Must be a current college student. Open to all majors, no prior Salesforce experience required.",
            requirements: JSON.stringify([
                { step: 1, title: "Create Trailhead Account", description: "Sign up on Trailhead for free" },
                { step: 2, title: "Complete Trails", description: "Finish required learning modules" },
                { step: 3, title: "Earn Badges", description: "Collect the specified badges" },
                { step: 4, title: "Submit Form", description: "Complete the hoodie claim form" }
            ]),
            perks: JSON.stringify([
                { icon: "🧥", title: "Free Hoodie", description: "Limited edition Trailblazer hoodie" },
                { icon: "🎖️", title: "Certifications", description: "Industry-recognized credentials" },
                { icon: "💼", title: "Career Boost", description: "Connect with recruiters" }
            ]),
            official_link: "https://trailhead.salesforce.com/",
            is_featured: true,
        },
        {
            title: "GirlScript Summer of Code 2026",
            company: "GirlScript Foundation",
            summary: "India's premier open-source program for students. Contribute to projects and win swag, goodies, and certificates.",
            content: `GirlScript Summer of Code (GSSOC) is a 3-month open-source program where participants contribute to real projects and earn exciting rewards.

**Why Participate:**
- Learn open-source development hands-on
- Get mentored by experienced developers
- Win swag packs (t-shirts, stickers, merchandise)
- Earn verified certificates
- Top contributors receive special goodies and recognition
- Build your GitHub profile and portfolio`,
            category: "Open Source",
            tags: JSON.stringify(["Open Source", "T-Shirt", "Certificate", "India", "Students"]),
            eligibility: "Open to students and beginners worldwide. Must have a GitHub account and basic coding knowledge.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Apply on the official GSSOC website" },
                { step: 2, title: "Select Projects", description: "Choose projects that match your skills" },
                { step: 3, title: "Contribute", description: "Submit PRs and complete assigned issues" },
                { step: 4, title: "Earn Points", description: "Climb the leaderboard for more rewards" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "Swag Pack", description: "T-shirts and stickers for top contributors" },
                { icon: "📜", title: "Certificate", description: "Verified completion certificate" },
                { icon: "🏆", title: "Recognition", description: "Special goodies for top performers" }
            ]),
            official_link: "https://gssoc.girlscript.tech/",
            is_featured: true,
        },
        {
            title: "Social Winter of Code 2026",
            company: "Social Winter of Code",
            summary: "Open-source winter program with certificates and cool swags for successful contributors.",
            content: `Social Winter of Code (SWOC) is an open-source program similar to GSSOC, running during winter months.

**Program Highlights:**
- 2-month contribution window
- Beginner-friendly projects available
- Mentored by project maintainers
- Digital certificates for all participants
- Physical swag for top contributors
- Great for building open-source portfolio`,
            category: "Open Source",
            tags: JSON.stringify(["Open Source", "Winter", "Certificate", "Swag", "Beginners"]),
            eligibility: "Open to all students and developers. No prior open-source experience required.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on SWOC website" },
                { step: 2, title: "Browse Projects", description: "Find projects matching your interest" },
                { step: 3, title: "Contribute", description: "Submit quality pull requests" }
            ]),
            perks: JSON.stringify([
                { icon: "📜", title: "Certificate", description: "Digital certificate for all" },
                { icon: "🎁", title: "Swag", description: "Cool swags for top contributors" },
                { icon: "💼", title: "Experience", description: "Real-world coding experience" }
            ]),
            official_link: "https://www.swoc.in/",
            is_featured: false,
        },
        {
            title: "JetBrains Free Student License",
            company: "JetBrains",
            summary: "Get free access to all JetBrains IDEs (IntelliJ, PyCharm, WebStorm, etc.) with your student email - forever renewable!",
            content: `JetBrains offers FREE professional IDE licenses to students and educators.

**What You Get:**
- Free access to ALL JetBrains IDEs (worth $600+/year)
- IntelliJ IDEA Ultimate for Java
- PyCharm Professional for Python
- WebStorm for JavaScript/React
- PhpStorm, GoLand, CLion, and more
- License renewable every year while you're a student`,
            category: "Program",
            tags: JSON.stringify(["Software", "IDE", "Free Tools", "Students", "JetBrains"]),
            eligibility: "Must be a student or educator with a valid school email (.edu). Can verify with student ID or official document.",
            requirements: JSON.stringify([
                { step: 1, title: "Apply", description: "Submit application with school email" },
                { step: 2, title: "Verify", description: "Confirm student status" },
                { step: 3, title: "Download", description: "Install any JetBrains IDE" }
            ]),
            perks: JSON.stringify([
                { icon: "💻", title: "All IDEs Free", description: "Access to entire JetBrains suite" },
                { icon: "🔄", title: "Renewable", description: "Renew free every year as student" },
                { icon: "🎓", title: "Pro Features", description: "Full professional features included" }
            ]),
            official_link: "https://www.jetbrains.com/community/education/",
            is_featured: false,
        },
        {
            title: "Google Developer Expert Program",
            company: "Google",
            summary: "Become a Google Developer Expert (GDE) for exclusive swag, conference passes, and direct access to Google teams.",
            content: `The Google Developer Expert program recognizes exceptional developers who actively contribute to the developer community.

**Benefits of being a GDE:**
- Exclusive Google swag and merchandise
- Free tickets to Google I/O and other conferences
- Direct access to Google engineering teams
- Early access to new Google products
- Speaking opportunities at Google events
- Mentorship from Google Developer Relations`,
            category: "Program",
            tags: JSON.stringify(["Google", "Expert", "Swag", "Conference", "Community"]),
            eligibility: "Must be an active community contributor (speaker, blogger, open-source maintainer). Nomination-based program.",
            requirements: JSON.stringify([
                { step: 1, title: "Build Presence", description: "Create content and speak at events" },
                { step: 2, title: "Get Nominated", description: "Receive nomination from existing GDE" },
                { step: 3, title: "Interview", description: "Complete technical interview process" }
            ]),
            perks: JSON.stringify([
                { icon: "🏅", title: "GDE Badge", description: "Official Google recognition" },
                { icon: "🎫", title: "Event Passes", description: "Free Google I/O tickets" },
                { icon: "👕", title: "Exclusive Swag", description: "Google merchandise" }
            ]),
            official_link: "https://developers.google.com/community/experts",
            is_featured: true,
        }
    ];

    try {
        let added = 0;
        for (const item of items) {
            // Check if item already exists
            const { rows: existing } = await client.query(
                "SELECT id FROM swag_items WHERE title = $1",
                [item.title]
            );

            if (existing.length > 0) {
                console.log(`  ⏭️  Skipping "${item.title}" (already exists)`);
                continue;
            }

            await client.query(`
        INSERT INTO swag_items (
          id, title, company, summary, content, category, tags,
          eligibility, requirements, perks, official_link,
          status, is_featured, submitted_by, approved_by, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'published', $12, 'admin-001', 'admin-001', NOW())
      `, [
                randomUUID(),
                item.title,
                item.company,
                item.summary,
                item.content,
                item.category,
                item.tags,
                item.eligibility,
                JSON.stringify(item.requirements ? JSON.parse(item.requirements as unknown as string) : null),
                JSON.stringify(item.perks ? JSON.parse(item.perks as unknown as string) : null),
                item.official_link,
                item.is_featured
            ]);

            console.log(`  ✅ Added "${item.title}"`);
            added++;
        }

        console.log("");
        console.log(`🎉 Added ${added} new swag opportunities!`);
        console.log(`📊 Total items in database: ${(await client.query("SELECT COUNT(*) FROM swag_items")).rows[0].count}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

addSwagItems();
