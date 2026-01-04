import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";
import { verifyJWT } from "@/lib/auth";
import { z } from "zod";
import { Mood, Visibility } from "@/types";

// Zod Schema for Entry Validation
const createEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  content: z.string().min(1, "Content is required"),
  mood: z.nativeEnum(Mood).default(Mood.Neutral),
  visibility: z.nativeEnum(Visibility).default(Visibility.Private),
  tags: z.array(z.string()).optional(),
  pinned: z.boolean().optional(),
});

export async function GET(request: Request) {
  await dbConnect();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const mood = searchParams.get("mood");
  const tag = searchParams.get("tag");
  
  // Pagination Params
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  let query: any = { userId: payload.sub };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }
  if (mood) query.mood = mood;
  if (tag) query.tags = tag;

  // Execute Query with Pagination
  const [entries, total] = await Promise.all([
    Entry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Entry.countDocuments(query)
  ]);

  return NextResponse.json({
    data: entries,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
}

export async function POST(request: Request) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate body against schema
    const validatedData = createEntrySchema.parse(body);

    const entry = await Entry.create({ 
      ...validatedData, 
      userId: payload.sub 
    });
    
    return NextResponse.json(entry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
