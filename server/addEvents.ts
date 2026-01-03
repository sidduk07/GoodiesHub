import pkg from "pg";
const { Pool } = pkg;
import { randomUUID } from "crypto";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub";
const pool = new Pool({ connectionString: DATABASE_URL });

async function addHackathonsInternshipsConferences() {
    console.log("🚀 Adding Hackathons, Internships, and Conferences...\n");

    const client = await pool.connect();

    const items = [
        // ============ HACKATHONS ============
        {
            title: "MLH Global Hack Week 2026",
            company: "Major League Hacking",
            summary: "Week-long global hackathon with limited-edition stickers, tees, and amazing swag. Ships to India!",
            content: `MLH Global Hack Week is a week-long celebration of building with over 200+ hackathons worldwide.

**What You Get:**
- Limited-edition MLH stickers and tees
- First-run swag for early participants
- Digital badges and certificates
- Access to sponsor challenges with prizes
- Google Swag Kits for API challenges
- Community mentorship and workshops

**The 2026 Season runs July 2025 - June 2026!**`,
            hero_image: "/attached_assets/generated_images/hackathon_event.png",
            category: "Hackathon",
            tags: JSON.stringify(["MLH", "Global", "T-Shirt", "Stickers", "Students"]),
            eligibility: "Open to all students globally. Must be 18+ or have parental consent.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on MLH website" },
                { step: 2, title: "Join Event", description: "Participate in hackathon week" },
                { step: 3, title: "Complete Challenges", description: "Build projects and submit" },
                { step: 4, title: "Claim Swag", description: "Swag ships worldwide including India" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "Limited Edition Tee", description: "Exclusive MLH t-shirt" },
                { icon: "🎖️", title: "Sticker Pack", description: "First-run limited stickers" },
                { icon: "🏆", title: "Prizes", description: "Sponsor challenge prizes" }
            ]),
            official_link: "https://mlh.io/seasons/2026/events",
            is_featured: true,
        },
        {
            title: "Smart India Hackathon 2026",
            company: "Government of India",
            summary: "India's biggest nationwide hackathon with ₹1 Lakh+ prizes per problem statement and certificates.",
            content: `Smart India Hackathon (SIH) is the world's biggest open innovation model organized by Government of India.

**Why Participate:**
- Solve real government and industry problems
- Cash prizes of ₹1 Lakh+ per problem statement
- Certificates for all participants
- Direct recognition from ministries
- Internship and job opportunities
- Mentorship from industry experts

**Timeline:** Registrations Aug-Sep, Grand Finale Sep-Dec`,
            hero_image: "/attached_assets/generated_images/hackathon_event.png",
            category: "Hackathon",
            tags: JSON.stringify(["India", "Government", "Cash Prize", "Certificate", "Innovation"]),
            eligibility: "Open to all Indian students enrolled in recognized institutions. Team of 6 members required.",
            requirements: JSON.stringify([
                { step: 1, title: "Form Team", description: "Create a team of 6 members" },
                { step: 2, title: "Register", description: "Register on SIH portal" },
                { step: 3, title: "Select Problem", description: "Choose a problem statement" },
                { step: 4, title: "Build Solution", description: "Develop and present your solution" }
            ]),
            perks: JSON.stringify([
                { icon: "💰", title: "Cash Prize", description: "₹1 Lakh+ per problem" },
                { icon: "📜", title: "Certificate", description: "Government recognition" },
                { icon: "💼", title: "Opportunities", description: "Internships and jobs" }
            ]),
            official_link: "https://sih.gov.in/",
            is_featured: true,
        },
        {
            title: "GeeksforGeeks Byte Quest 2026",
            company: "GeeksforGeeks",
            summary: "Free hackathon with T-shirts, hoodies, and stickers for top 50 participants. Free shipping across India!",
            content: `GFG Byte Quest is a beginner-friendly hackathon with amazing goodies for participants.

**Goodies Include:**
- T-shirts for top 50 participants
- Hoodies for winners
- Stickers for all participants
- Free shipping across India
- Certificates for everyone
- Stipends for best projects`,
            hero_image: "/attached_assets/generated_images/hackathon_event.png",
            category: "Hackathon",
            tags: JSON.stringify(["GFG", "India", "T-Shirt", "Hoodie", "Free", "Beginners"]),
            eligibility: "Open to all students and developers in India. Beginner-friendly.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on GFG portal" },
                { step: 2, title: "Build Project", description: "Create your solution" },
                { step: 3, title: "Submit", description: "Submit before deadline" }
            ]),
            perks: JSON.stringify([
                { icon: "👕", title: "T-Shirt", description: "For top 50 participants" },
                { icon: "🧥", title: "Hoodie", description: "For winners" },
                { icon: "📜", title: "Certificate", description: "For all participants" }
            ]),
            official_link: "https://practice.geeksforgeeks.org/",
            is_featured: false,
        },
        {
            title: "ETHGlobal Web3 Hackathons",
            company: "ETHGlobal",
            summary: "Premium Web3 hackathons with exclusive NFT merch, crypto tokens, hardware wallets, and cash prizes.",
            content: `ETHGlobal hosts the world's premier Ethereum and Web3 hackathons with incredible prizes.

**Unique Swag:**
- Exclusive NFT merchandise
- Hardware wallets (Ledger, Trezor)
- Crypto token prizes
- Limited edition physical merch
- VIP access to future events`,
            hero_image: "/attached_assets/generated_images/hackathon_event.png",
            category: "Hackathon",
            tags: JSON.stringify(["Web3", "Crypto", "NFT", "Global", "Premium"]),
            eligibility: "Open to all developers interested in blockchain and Web3.",
            requirements: JSON.stringify([
                { step: 1, title: "Apply", description: "Apply for upcoming hackathon" },
                { step: 2, title: "Build", description: "Create a Web3 project" },
                { step: 3, title: "Demo", description: "Present to judges" }
            ]),
            perks: JSON.stringify([
                { icon: "🎨", title: "NFT Merch", description: "Exclusive digital collectibles" },
                { icon: "💰", title: "Crypto Prizes", description: "Token rewards" },
                { icon: "🔐", title: "Hardware Wallet", description: "Ledger/Trezor for winners" }
            ]),
            official_link: "https://ethglobal.com/",
            is_featured: true,
        },

        // ============ INTERNSHIPS ============
        {
            title: "Google STEP Internship India 2026",
            company: "Google",
            summary: "10-12 week paid internship for 1st/2nd year students with mentorship, Google swag, and potential full-time offer.",
            content: `Google STEP (Student Training in Engineering Program) is designed for first and second-year undergrads.

**Benefits:**
- Competitive paid stipend
- Work on real Google products
- Direct mentorship from Google engineers
- Google swag and branded merchandise
- Free meals and snacks on-site
- Travel and relocation assistance
- Potential full-time conversion

**Locations:** Bengaluru, Hyderabad, Pune`,
            hero_image: "/attached_assets/generated_images/tech_internship.png",
            category: "Internship",
            tags: JSON.stringify(["Google", "India", "Paid", "Swag", "Students", "STEP"]),
            eligibility: "1st or 2nd year B.Tech/BE students in CS or related fields. Must be enrolled in accredited Indian institution.",
            requirements: JSON.stringify([
                { step: 1, title: "Apply Online", description: "Submit application on Google Careers" },
                { step: 2, title: "Coding Assessment", description: "Complete online coding test" },
                { step: 3, title: "Interviews", description: "Technical and behavioral interviews" },
                { step: 4, title: "Offer", description: "Receive and accept internship offer" }
            ]),
            perks: JSON.stringify([
                { icon: "💰", title: "Paid Stipend", description: "Competitive compensation" },
                { icon: "👕", title: "Google Swag", description: "Branded merchandise" },
                { icon: "🍕", title: "Free Meals", description: "On-site food and snacks" },
                { icon: "💼", title: "Full-time Path", description: "Conversion opportunity" }
            ]),
            official_link: "https://careers.google.com/",
            is_featured: true,
        },
        {
            title: "Microsoft Explore Internship India 2026",
            company: "Microsoft",
            summary: "8-week internship for 1st/2nd year students with Microsoft swag, mentorship, and hands-on project experience.",
            content: `Microsoft Explore is a rotational internship program for students early in their career.

**What's Included:**
- Competitive paid stipend
- Hands-on project experience
- Mentorship from senior engineers
- Microsoft branded swag
- Networking opportunities
- Health insurance coverage
- Pre-placement offer potential

**Location:** Bangalore`,
            hero_image: "/attached_assets/generated_images/tech_internship.png",
            category: "Internship",
            tags: JSON.stringify(["Microsoft", "India", "Paid", "Swag", "Students", "Explore"]),
            eligibility: "1st or 2nd year students in CS/IT or related engineering fields.",
            requirements: JSON.stringify([
                { step: 1, title: "Apply", description: "Submit via Microsoft Careers" },
                { step: 2, title: "Assessment", description: "Complete online assessment" },
                { step: 3, title: "Interviews", description: "Technical interviews" }
            ]),
            perks: JSON.stringify([
                { icon: "💰", title: "Stipend", description: "Competitive pay" },
                { icon: "👕", title: "Microsoft Swag", description: "Branded merchandise" },
                { icon: "🏥", title: "Health Insurance", description: "Coverage during internship" }
            ]),
            official_link: "https://careers.microsoft.com/",
            is_featured: true,
        },
        {
            title: "Amazon SDE Internship India 2026",
            company: "Amazon",
            summary: "10-12 week paid internship with ₹50K-1L/month stipend, Amazon swag kit, laptop, and PPO opportunity.",
            content: `Amazon's Software Development Engineer internship offers real-world experience with amazing perks.

**Swag Kit Includes:**
- Amazon branded t-shirts
- Welcome kit with stickers and coasters
- Work from here box (cups, notebooks, pens)
- Company laptop (Mac/Windows choice)
- Amazon employee discount

**Locations:** Bengaluru, Hyderabad, Pune, Mumbai, Delhi, Chennai`,
            hero_image: "/attached_assets/generated_images/tech_internship.png",
            category: "Internship",
            tags: JSON.stringify(["Amazon", "India", "Paid", "Swag", "Laptop", "SDE"]),
            eligibility: "Pre-final or final year students graduating in 2026/2027. CS/IT background required.",
            requirements: JSON.stringify([
                { step: 1, title: "Apply", description: "Apply on Amazon Jobs portal" },
                { step: 2, title: "Online Test", description: "Complete coding assessment" },
                { step: 3, title: "Interviews", description: "Multiple technical rounds" },
                { step: 4, title: "Join", description: "Accept offer and start internship" }
            ]),
            perks: JSON.stringify([
                { icon: "💰", title: "High Stipend", description: "₹50K-1L per month" },
                { icon: "👕", title: "Swag Kit", description: "Welcome package with goodies" },
                { icon: "💻", title: "Laptop", description: "Mac or Windows choice" },
                { icon: "🏷️", title: "Employee Discount", description: "Amazon shopping discount" }
            ]),
            official_link: "https://amazon.jobs/",
            is_featured: true,
        },

        // ============ CONFERENCES ============
        {
            title: "React India 2026",
            company: "React India",
            summary: "India's premier React conference with premium goodies bag, swag, workshops, and networking parties.",
            content: `React India is the largest React.js conference in India with world-class speakers and sessions.

**Early Bird Tickets Include:**
- Premium goodies bag with swag
- 2-day conference access
- All meals included
- Workshop access
- VIP networking opportunities
- After-parties

**Location:** Goa, India (October 2026)`,
            hero_image: "/attached_assets/generated_images/tech_conference.png",
            category: "Conference",
            tags: JSON.stringify(["React", "India", "Swag", "Networking", "JavaScript"]),
            eligibility: "Open to all developers with conference ticket. Student discounts available.",
            requirements: JSON.stringify([
                { step: 1, title: "Buy Ticket", description: "Purchase early bird for best swag" },
                { step: 2, title: "Attend", description: "Join sessions and workshops" },
                { step: 3, title: "Collect Swag", description: "Get your premium goodies bag" }
            ]),
            perks: JSON.stringify([
                { icon: "🎒", title: "Goodies Bag", description: "Premium swag collection" },
                { icon: "🍕", title: "All Meals", description: "Breakfast, lunch, dinner" },
                { icon: "🎉", title: "After Parties", description: "VIP networking events" }
            ]),
            official_link: "https://www.reactindia.io/",
            is_featured: true,
        },
        {
            title: "CityJS New Delhi 2026",
            company: "CityJS",
            summary: "Free conference swag, sponsor goodies, lunch, and breakfast included. Feb 18-19, 2026 in New Delhi.",
            content: `CityJS is a world-class JavaScript conference coming to New Delhi.

**What's Included:**
- Free conference swag
- Sponsor swags and goodies
- Breakfast and lunch included
- Free meetups and networking
- Session recordings access
- Community after-parties`,
            hero_image: "/attached_assets/generated_images/tech_conference.png",
            category: "Conference",
            tags: JSON.stringify(["JavaScript", "India", "Swag", "Free", "Delhi"]),
            eligibility: "Open to all developers. Early registration recommended.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Sign up on CityJS website" },
                { step: 2, title: "Attend", description: "Join sessions in New Delhi" },
                { step: 3, title: "Collect Swag", description: "Get free sponsor swags" }
            ]),
            perks: JSON.stringify([
                { icon: "🎁", title: "Free Swag", description: "Conference merchandise" },
                { icon: "🍳", title: "Meals", description: "Breakfast and lunch" },
                { icon: "🎥", title: "Recordings", description: "Access to all sessions" }
            ]),
            official_link: "https://cityjsconf.org/",
            is_featured: false,
        },
        {
            title: "PyConf Hyderabad 2026",
            company: "Python India",
            summary: "Regional Python conference with community swag, networking, and hands-on workshops. March 14-15, 2026.",
            content: `PyConf Hyderabad brings together Python enthusiasts from across India.

**Conference Features:**
- Python community swag
- Technical workshops
- Lightning talks
- Poster sessions
- Job fair and networking
- Community dinner`,
            hero_image: "/attached_assets/generated_images/tech_conference.png",
            category: "Conference",
            tags: JSON.stringify(["Python", "India", "Swag", "Hyderabad", "Community"]),
            eligibility: "Open to all Python enthusiasts. Student discounts available.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Buy ticket on website" },
                { step: 2, title: "Attend", description: "Join sessions in Hyderabad" }
            ]),
            perks: JSON.stringify([
                { icon: "🐍", title: "Python Swag", description: "Community merchandise" },
                { icon: "🎓", title: "Workshops", description: "Hands-on learning" },
                { icon: "🤝", title: "Networking", description: "Connect with Pythonistas" }
            ]),
            official_link: "https://pyconfhyd.org/",
            is_featured: false,
        },
        {
            title: "Bengaluru Tech Summit 2026",
            company: "Government of Karnataka",
            summary: "Asia's premier tech event with exhibitions, startup showcase, and exclusive tech swag. Nov 18-20, 2026.",
            content: `BTS is Asia's largest technology summit hosted by Government of Karnataka.

**What to Expect:**
- Exhibition with 500+ companies
- Startup showcase and awards
- Tech swag from exhibitors
- Networking with global leaders
- Product launches and demos
- Innovation challenges`,
            hero_image: "/attached_assets/generated_images/tech_conference.png",
            category: "Conference",
            tags: JSON.stringify(["Tech Summit", "India", "Bangalore", "Exhibition", "Startups"]),
            eligibility: "Open to all. Free passes for exhibitions, paid for conference sessions.",
            requirements: JSON.stringify([
                { step: 1, title: "Register", description: "Get your pass online" },
                { step: 2, title: "Visit", description: "Explore exhibitions and sessions" }
            ]),
            perks: JSON.stringify([
                { icon: "🎁", title: "Exhibitor Swag", description: "From 500+ companies" },
                { icon: "🚀", title: "Startup Expo", description: "Innovation showcase" },
                { icon: "🤝", title: "Networking", description: "Global tech leaders" }
            ]),
            official_link: "https://bengalurutechsummit.com/",
            is_featured: true,
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
                console.log(`  ⏭️  "${item.title}" already exists`);
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

            console.log(`  ✅ Added "${item.title}" [${item.category}]`);
            added++;
        }

        // Count by category
        const { rows: counts } = await client.query(`
      SELECT category, COUNT(*) as count FROM swag_items GROUP BY category ORDER BY count DESC
    `);

        console.log("\n📊 Database Summary:");
        counts.forEach(row => console.log(`  ${row.category}: ${row.count} items`));

        const { rows: total } = await client.query("SELECT COUNT(*) FROM swag_items");
        console.log(`\n🎉 Added ${added} new items! Total: ${total[0].count}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

addHackathonsInternshipsConferences();
