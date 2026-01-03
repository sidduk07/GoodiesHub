import pkg from "pg";
const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub";
const pool = new Pool({ connectionString: DATABASE_URL });

// Map of titles to their hero images
const imageUpdates: Record<string, string> = {
    // AWS
    "AWS Community Builder Program": "/attached_assets/generated_images/aws_cloud_swag.png",

    // Salesforce
    "Salesforce Trailblazer Quest 2026": "/attached_assets/generated_images/salesforce_blue_hoodie.png",

    // JetBrains
    "JetBrains Free Student License": "/attached_assets/generated_images/jetbrains_developer.png",

    // GirlScript
    "GirlScript Summer of Code 2026": "/attached_assets/generated_images/girlscript_opensource.png",

    // SWOC
    "Social Winter of Code 2026": "/attached_assets/generated_images/swoc_winter_code.png",

    // Google programs - use the google swag image
    "Google Cloud Ready Facilitator Program 2026": "/attached_assets/generated_images/google_india_swag.png",
    "Google Developer Expert Program": "/attached_assets/generated_images/google_india_swag.png",
};

async function updateImages() {
    console.log("🖼️  Updating hero images for swag items...");

    const client = await pool.connect();

    try {
        let updated = 0;

        for (const [title, heroImage] of Object.entries(imageUpdates)) {
            const result = await client.query(
                "UPDATE swag_items SET hero_image = $1 WHERE title = $2 AND (hero_image IS NULL OR hero_image = '')",
                [heroImage, title]
            );

            if (result.rowCount && result.rowCount > 0) {
                console.log(`  ✅ Updated "${title}"`);
                updated++;
            } else {
                // Try updating even if it has an image
                const result2 = await client.query(
                    "UPDATE swag_items SET hero_image = $1 WHERE title = $2",
                    [heroImage, title]
                );
                if (result2.rowCount && result2.rowCount > 0) {
                    console.log(`  🔄 Replaced image for "${title}"`);
                    updated++;
                }
            }
        }

        // Check for items still without images
        const { rows: noImage } = await client.query(
            "SELECT title FROM swag_items WHERE hero_image IS NULL OR hero_image = ''"
        );

        if (noImage.length > 0) {
            console.log("\n⚠️  Items still without images:");
            noImage.forEach(row => console.log(`  - ${row.title}`));
        }

        console.log(`\n🎉 Updated ${updated} items!`);

        // Show all items with their images
        const { rows: allItems } = await client.query(
            "SELECT title, CASE WHEN hero_image IS NOT NULL AND hero_image != '' THEN '✅' ELSE '❌' END as has_image FROM swag_items ORDER BY title"
        );

        console.log("\n📊 All items:");
        allItems.forEach(row => console.log(`  ${row.has_image} ${row.title}`));

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

updateImages();
