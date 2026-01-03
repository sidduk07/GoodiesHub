import { SwagItem, User } from "@shared/schema";
import { storage } from "./storage";

// ============================================
// EMAIL SERVICE (Mock Implementation)
// Logs emails to console - Replace with real email provider
// when ready (e.g., Resend, Nodemailer, SendGrid)
// ============================================

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  // In production, replace with actual email service
  console.log("\n========== EMAIL NOTIFICATION ==========");
  console.log(`To: ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log("------- HTML Content -------");
  console.log(options.html);
  console.log("==========================================\n");

  return true;
}

// ============================================
// EMAIL TEMPLATES
// ============================================
function generateSwagPublishedEmail(swag: SwagItem, swagUrl: string): string {
  const heroImageHtml = swag.heroImage
    ? `<img src="${swag.heroImage}" alt="${swag.title}" style="width: 100%; max-width: 500px; border-radius: 12px; margin-bottom: 24px;" />`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Swag Alert! 🎉</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <span style="font-size: 28px;">⚡</span>
              <span style="font-size: 24px; font-weight: bold; color: #3b82f6;">GoodiesHub</span>
            </td>
          </tr>
          
          <!-- Main Content Card -->
          <tr>
            <td style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Badge -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 20px; letter-spacing: 0.5px;">
                  🎉 NEW SWAG ALERT
                </span>
              </div>
              
              <!-- Hero Image -->
              <div style="text-align: center;">
                ${heroImageHtml}
              </div>
              
              <!-- Company Name -->
              <p style="text-align: center; color: #3b82f6; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
                ${swag.company}
              </p>
              
              <!-- Title -->
              <h1 style="text-align: center; color: #18181b; font-size: 28px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
                ${swag.title}
              </h1>
              
              <!-- Description -->
              <p style="text-align: center; color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                ${swag.summary}
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center;">
                <a href="${swagUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 50px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);">
                  View Swag →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 32px 20px;">
              <p style="color: #71717a; font-size: 14px; margin: 0 0 8px 0;">
                You're receiving this because you enabled email notifications.
              </p>
              <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} GoodiesHub. Made with ❤️ for students.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================
export async function notifyUsersAboutNewSwag(
  swag: SwagItem,
  baseUrl: string = "http://localhost:5000"
): Promise<void> {
  // Only notify for published swag
  if (swag.status !== "published") {
    console.log(`[Email] Skipping notification - swag status is ${swag.status}`);
    return;
  }

  // Get users with email notifications enabled
  const users = await storage.getUsersWithEmailNotifications();

  if (users.length === 0) {
    console.log("[Email] No users with notifications enabled");
    return;
  }

  console.log(`[Email] Notifying ${users.length} users about new swag: ${swag.title}`);

  const swagUrl = `${baseUrl}/swag/${swag.id}`;
  const emailHtml = generateSwagPublishedEmail(swag, swagUrl);

  // Send emails to all subscribed users
  for (const user of users) {
    try {
      await sendEmail({
        to: user.email,
        subject: `🎉 New Swag Alert: ${swag.title} from ${swag.company}`,
        html: emailHtml,
      });
    } catch (error) {
      console.error(`[Email] Failed to send to ${user.email}:`, error);
    }
  }
}
