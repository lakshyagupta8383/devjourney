import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req) {
  try {
    // ✅ Confirm Firebase Admin is initialized
    if (!admin.apps.length) {
      console.error("❌ Firebase Admin not initialized!");
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    console.log("🔥 Connected to project:", admin.app().options.projectId);

    // ✅ Read request body
    const body = await req.json();
    console.log("📥 Incoming data:", body);

    const { uid, name, email, photoURL } = body;

    // ✅ Validate input
    if (!uid || !email) {
      console.error("❌ Missing UID or Email in request body");
      return NextResponse.json(
        { error: "Missing uid or email" },
        { status: 400 }
      );
    }

    // ✅ Reference Firestore using your exported db
    const userRef = db.collection("users").doc(uid);

    // ✅ Save or update user document
    await userRef.set(
      {
        uid,
        name: name || "",
        email,
        photoURL: photoURL || "",
        updatedAt: new Date(),
      },
      { merge: true }
    );

    console.log(`✅ User ${email} saved successfully in Firestore!`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 API Error (create-user):", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
