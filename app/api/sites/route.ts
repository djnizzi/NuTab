import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFavicon } from "@/lib/favicon-utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
// import { v4 as uuidv4 } from 'uuid'; // Removed

export async function GET() {
    try {
        const sites = await prisma.site.findMany({
            orderBy: {
                order: "asc",
            },
        });
        return NextResponse.json(sites);
    } catch (error) {
        console.error("Error fetching sites:", error);
        return NextResponse.json({ error: "Failed to fetch sites" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        let url = formData.get("url") as string;
        const iconFile = formData.get("icon") as File | null;

        if (!name || !url) {
            return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });
        }

        if (!url.startsWith("http")) {
            url = `https://${url}`;
        }

        let iconPath = "";

        if (iconFile && iconFile.size > 0) {
            // Handle file upload
            const buffer = Buffer.from(await iconFile.arrayBuffer());
            // Ensure upload directory exists
            const uploadDir = path.join(process.cwd(), "uploads");
            await mkdir(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${iconFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, buffer);

            iconPath = `/uploads/${filename}`;
        } else {
            // Fetch favicon
            iconPath = await getFavicon(url);
        }

        // Get max order
        const lastSite = await prisma.site.findFirst({
            orderBy: { order: "desc" },
        });
        const newOrder = (lastSite?.order ?? -1) + 1;

        const site = await prisma.site.create({
            data: {
                name,
                url,
                icon: iconPath,
                order: newOrder,
            },
        });

        return NextResponse.json(site);
    } catch (error) {
        console.error("Error creating site:", error);
        return NextResponse.json({ error: "Failed to create site" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        // Check if this is a reorder request
        if (Array.isArray(body)) {
            const updates = body.map((id: string, index: number) =>
                prisma.site.update({
                    where: { id },
                    data: { order: index },
                })
            );

            await prisma.$transaction(updates);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    } catch (error) {
        console.error("Error updating sites:", error);
        return NextResponse.json({ error: "Failed to update sites" }, { status: 500 });
    }
}
