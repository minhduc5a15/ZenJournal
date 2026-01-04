import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";
import { verifyJWT } from "@/lib/auth";

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

  let query: any = { userId: payload.sub };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }
  if (mood) query.mood = mood;
  if (tag) query.tags = tag;

  const entries = await Entry.find(query).sort({ createdAt: -1 });
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const entry = await Entry.create({ ...body, userId: payload.sub });
  return NextResponse.json(entry);
}