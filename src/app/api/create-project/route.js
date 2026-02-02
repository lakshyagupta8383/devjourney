import { db } from "@/lib/firebaseAdmin";
import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const { uid, name, aiPrompt, description, techStack } = await req.json();

    if (!uid || !name || !aiPrompt || !techStack) {
      return Response.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create the project document first
    const projectRef = db.collection("projects").doc();
    await projectRef.set({
      name,
      description,
      aiPrompt,
      techStack,
      createdBy: uid,
      members: { [uid]: "leader" },
      createdAt: new Date(),
      status: "active",
      isPublic: false,
    });

    let tasks = [];

    try {
      // Try to generate tasks with OpenAI
      const prompt = `
You are an expert software planner.
Create a structured list of development tasks based on the following project:
Project Name: ${name}
Description: ${description}
Tech Stack: ${techStack.join(", ")}
AI Prompt: ${aiPrompt}

Return valid JSON only in this format:
[
  {"title": "Task title", "description": "short description"},
  ...
]
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that creates technical plans for developers.",
          },
          { role: "user", content: prompt },
        ],
      });

      const raw = completion.choices[0].message.content.trim();
      try {
        tasks = JSON.parse(raw);
      } catch {
        const match = raw.match(/\[.*\]/s);
        if (match) tasks = JSON.parse(match[0]);
      }

    } catch (openaiError) {
      console.warn("OpenAI unavailable or quota exceeded — using mock tasks.");
      // Mock fallback tasks
      tasks = [
        {
          title: "Set up project environment",
          description: "Initialize Next.js with Tailwind CSS and configure Firebase Admin SDK.",
        },
        {
          title: "Implement authentication",
          description: "Add Firebase Auth with Google sign-in and protect dashboard routes.",
        },
        {
          title: "Create Firestore schema",
          description: "Add collections for users, projects, and tasks with proper structure.",
        },
        {
          title: "Build AI integration",
          description: "Set up API route to handle AI-powered task generation later.",
        },
      ];
    }

    // Save tasks to Firestore
    const batch = db.batch();
    const taskCollection = projectRef.collection("tasks");

    tasks.forEach((task) => {
      const taskRef = taskCollection.doc();
      batch.set(taskRef, {
        title: task.title,
        description: task.description,
        status: "pending",
        createdAt: new Date(),
      });
    });

    await batch.commit();

    return Response.json({ success: true, projectId: projectRef.id, tasks }, { status: 200 });
  } catch (err) {
    console.error("Error creating project:", err);
    return Response.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
