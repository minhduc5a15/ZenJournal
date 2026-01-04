import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const mood = searchParams.get("mood");
  const tag = searchParams.get("tag");
  const userId = searchParams.get("userId");

  let query: any = {};

  if (userId) {
    query.userId = userId;
  }

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
  const body = await request.json();
  const entry = await Entry.create(body);
  return NextResponse.json(entry);
}
