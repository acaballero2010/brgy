import { SmsNotificationTrigger } from "@/types/portal";

/**
 * Philippine SMS Gateway Notification Service
 * Formats official Barangay Pamplona Uno transactional SMS advisories
 * adhering to the 160-character single-segment standard or multi-part concatenation.
 */

export async function sendApplicationReceivedSms(
  recipientPhone: string,
  recipientName: string,
  documentTitle: string,
  trackingCode: string
): Promise<SmsNotificationTrigger> {
  // Format official SMS Template:
  // "BRGY PAMPLONA UNO: Hello [Name], your request for [Doc] has been queued. Ref: [Code]. Check status at brgy.gov.ph/services/track"
  const firstName = recipientName.split(" ")[0] || "Resident";
  const messageBody = `BRGY PAMPLONA UNO: Magandang araw ${firstName}! Ang iyong application para sa ${documentTitle} ay natanggap na. Reference: ${trackingCode}. I-track ang status sa portal.`;

  // Simulated gateway dispatch (e.g., Semaphore or Telco gateway integration)
  const simulatedMessageId = `SMS-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Log to server console
  console.log(`[SMS GATEWAY DISPATCH] -> To: ${recipientPhone} | ID: ${simulatedMessageId}`);
  console.log(`[MESSAGE CONTENT]: "${messageBody}"`);

  return {
    recipient: recipientPhone,
    message: messageBody,
    senderId: "BRGY-PAMPLONA",
    messageId: simulatedMessageId,
    status: "QUEUED",
    timestamp: new Date().toISOString(),
  };
}
