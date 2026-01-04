import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { signJWT } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();
  const { email, password, name } = await request.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword, name });
    const token = await signJWT({
      sub: user._id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ user, token });
  } catch (error) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
