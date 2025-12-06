"use server";

import { prismaGov } from "@/lib/db/gov";
import { revalidatePath } from "next/cache";

export async function sendAlert(formData: FormData) {
  const title = formData.get("title") as string;
  const message = formData.get("message") as string;
  const severity = formData.get("severity") as string;
  const recipient = formData.get("recipient") as string;
  const region = formData.get("region") as string;

  if (!title || !message || !severity || !recipient) {
    throw new Error("Missing required fields");
  }

  await prismaGov.alert.create({
    data: {
      title,
      message,
      severity,
      recipient,
      region,
      status: "SENT", // Simulating immediate send
    },
  });

  revalidatePath("/gov-dashboard");
}
