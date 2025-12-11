import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

// GET not needed for single site usually, but good practice. Skipped for now.

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; // Next.js 15+ params is a promise
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

        const existingSite = await prisma.site.findUnique({ where: { id } });
        if (!existingSite) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        let iconPath = existingSite.icon;

        if (iconFile && iconFile.size > 0) {
            // Handle file upload
            const buffer = Buffer.from(await iconFile.arrayBuffer());
            const uploadDir = path.join(process.cwd(), "uploads");
            const filename = `${Date.now()}-${iconFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
            const filepath = path.join(uploadDir, filename);
            await mkdir(uploadDir, { recursive: true });
            await writeFile(filepath, buffer);

            iconPath = `/uploads/${filename}`;

            // Delete old local file if it exists and was an upload
            if (existingSite.icon && existingSite.icon.startsWith("/uploads/")) {
                try {
                    const oldPath = path.join(process.cwd(), "uploads", existingSite.icon.replace("/uploads/", ""));
                    await unlink(oldPath);
                } catch (e) {
                    console.warn("Failed to delete old icon:", e);
                }
            }
        } else if (url !== existingSite.url && (!iconPath || !iconPath.startsWith("/uploads/"))) {
            // If URL changed and we are not using a custom upload, maybe refresh favicon?
            // For simplicity, let's keep the old one unless user cleared it, 
            // OR we can refetch. Let's assume user explicitly updates icon if they want new one.
            // Actually the plan said "Update details (name, url, icon)".
        }

        const site = await prisma.site.update({
            where: { id },
            data: {
                name,
                url,
                icon: iconPath,
            },
        });

        return NextResponse.json(site);
    } catch (error) {
        console.error("Error updating site:", error);
        return NextResponse.json({ error: "Failed to update site" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const site = await prisma.site.findUnique({ where: { id } });
        if (!site) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        await prisma.site.delete({ where: { id } });

        // Delete icon file if local
        if (site.icon && site.icon.startsWith("/uploads/")) {
            try {
                const oldPath = path.join(process.cwd(), "uploads", site.icon.replace("/uploads/", ""));
                await unlink(oldPath);
            } catch (e) {
                console.warn("Failed to delete icon file:", e);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting site:", error);
        return NextResponse.json({ error: "Failed to delete site" }, { status: 500 });
    }
}
