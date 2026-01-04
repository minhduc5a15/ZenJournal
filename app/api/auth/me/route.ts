import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export async function GET() {
  await dbConnect();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const user = await User.findById(payload.sub).select("-password");
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}
