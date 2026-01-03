import pkg from "pg";
const { Pool } = pkg;
import { randomUUID } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub";

const pool = new Pool({ connectionString: DATABASE_URL });

async function addIndiaSwag() {
    console.log("🇮🇳 Adding India-focused swag opportunities...");

    const client = await pool.connect();

    const items = [
        {
            title: "Google Student Ambassador India 2026",
            company: "Google",
            summary: "6-month leadership program for Indian students with exclusive Google swag, Gemini AI t-shirts, and mentorship.",
            content: `The Google Student Ambassador Program India is a prestigious 6-month program (July-December 2026) for passionate student leaders.

**What You'll Get:**
- Official Google certification
- Exclusive Gemini AI-branded T-shirts
- Event kits and Google merchandise
- Mentorship from Google Developer Relations
- Access to exclusive Google events
- Leadership training and networking

**Your Role:**
- Organize workshops on campus
- Spread awareness about Google technologies
- Build a community of learners
- Share your journey on social media`,
            hero_image: "/attached_assets/generated_images/google_india_swag.png",
            category: "Program",
            tags: JSON.stringify(["Google", "India", "T-Shirt", "Leadership", "Students", "Mentorship"]),
            eligibility: "Must be enrolled in an Indian college. Passionate about technology and community building. Leadership experience preferred.",
            requirements: JSON.stringify([
                { step: 1, title: "Apply Online", description: "Submit application by July 2026" },
                { step: 2, title: "Video Interview", description: "Share your passion for tech" },
                { step: 3, title: "Selection", description: "Top candidates selected as ambassadors" },
                { step: 4, title: "Onboarding", description: "Complete mandatory training modules" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "Gemini AI T-Shirt", description: "Exclusive branded merchandise" },
                { icon: "🎓", title: "Certification", description: "Official Google certificate" },
                { icon: "🎁", title: "Event Kit", description: "Swag to distribute at events" },
                { icon: "💼", title: "Mentorship", description: "Direct guidance from Googlers" }
            ]),
            official_link: "https://developers.google.com/community/gdsc",
            is_featured: true,
        },
        {
            title: "Google Arcade Facilitator Program 2026",
            company: "Google",
            summary: "Earn Google Cloud skill badges, credits, and exclusive swag by becoming a Cloud Facilitator in India.",
            content: `The Google Arcade Facilitator Program helps you master Google Cloud while earning amazing rewards.

**Program Benefits:**
- Free Google Cloud credits for labs
- Earn official Google Cloud skill badges
- Redeem points for exclusive swag
- Official facilitator certificate
- Access to private facilitator community

**How It Works:**
- Complete Google Cloud Skills Boost labs
- Earn points for each completed challenge
- Redeem points for Google goodies
- Top facilitators get premium rewards`,
            hero_image: "/attached_assets/generated_images/google_india_swag.png",
            category: "Program",
            tags: JSON.stringify(["Google Cloud", "India", "Badges", "Swag", "Learning"]),
            eligibility: "Open to all Indian students and professionals. No prior cloud experience required.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on the facilitator portal" },
                { step: 2, title: "Complete Labs", description: "Finish assigned skill badges" },
                { step: 3, title: "Earn Points", description: "Accumulate points from completions" },
                { step: 4, title: "Redeem Swag", description: "Exchange points for goodies" }
            ]),
            perks: JSON.stringify([
                { icon: "🎖️", title: "Skill Badges", description: "Google Cloud certifications" },
                { icon: "👕", title: "Google Swag", description: "T-shirts and accessories" },
                { icon: "☁️", title: "Cloud Credits", description: "Free usage credits" },
                { icon: "📜", title: "Certificate", description: "Official facilitator certificate" }
            ]),
            official_link: "https://cloud.google.com/innovators",
            is_featured: true,
        },
        {
            title: "Google Gen AI Exchange India",
            company: "Google",
            summary: "100% free program for Indian tech enthusiasts to learn Generative AI with goodies like T-shirts and hackathon prizes.",
            content: `Google Gen AI Exchange is an exclusive program for Indian tech enthusiasts to master Generative AI.

**What's Included:**
- Free Generative AI learning resources
- Hands-on labs with Google Gemini
- Hackathon with cash prizes
- 100% free Google goodies (T-shirts, swags)
- Skill badges and certificates
- Networking with AI experts

**Why Participate:**
- Learn cutting-edge AI/ML skills
- Build portfolio projects
- Connect with Google AI team
- Win amazing prizes`,
            hero_image: "/attached_assets/generated_images/india_tech_community.png",
            category: "Hackathon",
            tags: JSON.stringify(["AI", "Gen AI", "Google", "India", "T-Shirt", "Hackathon"]),
            eligibility: "Open to all Indian students and developers interested in Generative AI. No prior AI experience required.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up for the program" },
                { step: 2, title: "Learn", description: "Complete Gen AI learning modules" },
                { step: 3, title: "Build", description: "Create an AI-powered project" },
                { step: 4, title: "Submit", description: "Submit to hackathon" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "Free T-Shirt", description: "Google Gen AI branded" },
                { icon: "🏆", title: "Cash Prizes", description: "Win hackathon rewards" },
                { icon: "🎖️", title: "Skill Badges", description: "AI certifications" },
                { icon: "🤖", title: "AI Skills", description: "Learn Gemini and Vertex AI" }
            ]),
            official_link: "https://cloud.google.com/gen-ai-exchange",
            is_featured: true,
        },
        {
            title: "Social Summer of Code 2026",
            company: "Social India",
            summary: "Open source summer program connecting Indian students with mentored projects. Win certificates and cool swags!",
            content: `Social Summer of Code (SSoC) is a 3-month open-source program that helps students contribute to real-world projects.

**Program Highlights:**
- Mentored open-source contributions
- Work on real projects with experienced maintainers
- Digital certificates for all participants
- Cool swags for top contributors
- Build your GitHub profile
- Great for internship applications

**Timeline:**
- Registration: March-April
- Contribution Period: May-July
- Results: August`,
            hero_image: "/attached_assets/generated_images/india_tech_community.png",
            category: "Open Source",
            tags: JSON.stringify(["Open Source", "India", "Summer", "Certificate", "Swag", "Students"]),
            eligibility: "Open to all students globally, especially popular among Indian students. Must have a GitHub account.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on SSoC website" },
                { step: 2, title: "Select Projects", description: "Choose projects to contribute to" },
                { step: 3, title: "Contribute", description: "Submit quality pull requests" },
                { step: 4, title: "Earn Rewards", description: "Collect points for swag" }
            ]),
            perks: JSON.stringify([
                { icon: "📜", title: "Certificate", description: "Digital completion certificate" },
                { icon: "🎁", title: "Swag", description: "Cool goodies for top contributors" },
                { icon: "💻", title: "Experience", description: "Real open-source experience" },
                { icon: "🌟", title: "Recognition", description: "Featured on leaderboard" }
            ]),
            official_link: "https://ssoc.devfolio.co/",
            is_featured: false,
        },
        {
            title: "Microsoft Skill Builder India 2026",
            company: "Microsoft",
            summary: "Complete Microsoft Learn modules to earn free certificates, badges, and exclusive Microsoft goodies.",
            content: `Microsoft Skill Builder Program rewards students who complete learning modules on Microsoft Learn.

**What You Get:**
- Free Microsoft certifications
- Digital skill badges
- Exclusive Microsoft goodies
- Access to Microsoft events
- LinkedIn certification badges
- Career resources and guides

**How to Participate:**
- Sign up with your student email
- Complete assigned learning paths
- Earn points for each module
- Redeem for certificates and swag`,
            hero_image: "/attached_assets/generated_images/india_tech_community.png",
            category: "Program",
            tags: JSON.stringify(["Microsoft", "India", "Badges", "Certificate", "Learning", "Free"]),
            eligibility: "Open to all Indian students with a valid college email. .edu or .ac.in email required.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on Microsoft Learn" },
                { step: 2, title: "Complete Modules", description: "Finish assigned learning paths" },
                { step: 3, title: "Earn Badges", description: "Collect skill badges" },
                { step: 4, title: "Claim Rewards", description: "Request your goodies" }
            ]),
            perks: JSON.stringify([
                { icon: "🎖️", title: "Free Certifications", description: "Industry-recognized badges" },
                { icon: "🎁", title: "Goodies", description: "Microsoft branded items" },
                { icon: "💼", title: "Career Help", description: "Resume and interview prep" },
                { icon: "☁️", title: "Azure Credits", description: "Free cloud usage" }
            ]),
            official_link: "https://learn.microsoft.com/en-us/training/",
            is_featured: false,
        },
        {
            title: "DevFest India 2026",
            company: "Google Developer Groups",
            summary: "Attend DevFest at your nearest city to learn, network, and grab amazing Google swag and goodies.",
            content: `DevFest India is a series of community-led tech conferences organized by Google Developer Groups (GDGs) across India.

**What to Expect:**
- Technical sessions on Google technologies
- Hands-on workshops and codelabs
- Networking with developers and Googlers
- Amazing swag and goodies for attendees
- Career opportunities and job fair
- Food and entertainment

**Popular Cities:**
- DevFest Delhi, Mumbai, Bangalore
- DevFest Hyderabad, Chennai, Pune
- DevFest Kolkata, Ahmedabad, and more`,
            hero_image: "/attached_assets/generated_images/india_tech_community.png",
            category: "Conference",
            tags: JSON.stringify(["Google", "India", "Conference", "Swag", "Networking", "GDG"]),
            eligibility: "Open to all developers, students, and tech enthusiasts. Free or low-cost registration depending on city.",
            requirements: JSON.stringify([
                { step: 1, title: "Find Local GDG", description: "Search for GDG in your city" },
                { step: 2, title: "Register", description: "Sign up on event page" },
                { step: 3, title: "Attend", description: "Join sessions and workshops" },
                { step: 4, title: "Collect Swag", description: "Get goodies at venue" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "T-Shirts", description: "DevFest branded merchandise" },
                { icon: "🎁", title: "Goodies", description: "Stickers, badges, and more" },
                { icon: "🤝", title: "Networking", description: "Meet industry professionals" },
                { icon: "📚", title: "Learning", description: "Hands-on workshops" }
            ]),
            official_link: "https://gdg.community.dev/",
            is_featured: true,
        },
        {
            title: "Postman Student Expert India",
            company: "Postman",
            summary: "Complete API training to become a Postman Student Expert and earn exclusive Postman swag kit.",
            content: `The Postman Student Expert program trains students in API development and rewards them with exclusive swag.

**Program Benefits:**
- Free API development training
- Postman Student Expert certification
- Exclusive swag kit (t-shirt, stickers, badges)
- Featured on Postman Student Experts page
- LinkedIn badge for your profile
- Community access and mentorship

**Perfect for:**
- Computer Science students
- Anyone learning web development
- Future backend developers`,
            hero_image: "/attached_assets/generated_images/india_tech_community.png",
            category: "Program",
            tags: JSON.stringify(["Postman", "API", "T-Shirt", "Certificate", "Students", "Free"]),
            eligibility: "Must be a current student at any college or university. No prior API experience required.",
            requirements: JSON.stringify([
                { step: 1, title: "Start Training", description: "Begin the Student Expert course" },
                { step: 2, title: "Complete Modules", description: "Finish all API training modules" },
                { step: 3, title: "Pass Exam", description: "Clear the certification exam" },
                { step: 4, title: "Claim Swag", description: "Request your swag kit" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "T-Shirt", description: "Exclusive Postman shirt" },
                { icon: "🏅", title: "Certificate", description: "Student Expert certification" },
                { icon: "🎖️", title: "Badges", description: "Physical and digital badges" },
                { icon: "💻", title: "Skills", description: "Industry-ready API skills" }
            ]),
            official_link: "https://www.postman.com/student-program/",
            is_featured: false,
        }
    ];

    try {
        let added = 0;
        for (const item of items) {
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
          id, title, company, summary, content, hero_image, category, tags,
          eligibility, requirements, perks, official_link,
          status, is_featured, submitted_by, approved_by, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'published', $13, 'admin-001', 'admin-001', NOW())
      `, [
                randomUUID(),
                item.title,
                item.company,
                item.summary,
                item.content,
                item.hero_image,
                item.category,
                item.tags,
                item.eligibility,
                item.requirements,
                item.perks,
                item.official_link,
                item.is_featured
            ]);

            console.log(`  ✅ Added "${item.title}"`);
            added++;
        }

        console.log("");
        console.log(`🎉 Added ${added} India-focused swag opportunities!`);
        console.log(`📊 Total items in database: ${(await client.query("SELECT COUNT(*) FROM swag_items")).rows[0].count}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

addIndiaSwag();
