import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Entry from "@/models/Entry";
import { verifyJWT } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  // We find by ID first, then check authorization
  const entry = await Entry.findById(id);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Authorization Check
  const isOwner = payload && entry.userId === payload.sub;
  const isPublic = entry.visibility === 'public';

  if (isPublic || isOwner) {
    return NextResponse.json(entry);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  // Ensure we don't overwrite userId
  delete body.userId;
  
  const entry = await Entry.findOneAndUpdate(
    { _id: id, userId: payload.sub },
    body,
    { new: true }
  );
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = token ? await verifyJWT(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entry = await Entry.findOneAndDelete({ _id: id, userId: payload.sub });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  return NextResponse.json({ success: true });
}
