import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TOOLS_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), "components", "tools");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "list";
    const tool = searchParams.get("tool");
    const file = searchParams.get("file");

    if (!tool) return NextResponse.json({ error: "Tool slug required" }, { status: 400 });

    const toolDir = findToolDir(tool);
    if (!toolDir) return NextResponse.json({ error: "Tool not found" }, { status: 404 });

    if (action === "list") {
      const files = getAllFiles(toolDir);
      return NextResponse.json({ files, toolDir });
    }

    if (action === "read" && file) {
      const filePath = path.join(/* turbopackIgnore: true */ toolDir, file);
      if (!fs.existsSync(/* turbopackIgnore: true */ filePath)) return NextResponse.json({ error: "File not found" }, { status: 404 });
      if (filePath.includes("..")) return NextResponse.json({ error: "Invalid path" }, { status: 400 });
      
      const content = fs.readFileSync(/* turbopackIgnore: true */ filePath, "utf-8");
      const ext = path.extname(file).replace(".", "");
      return NextResponse.json({ file, content, ext, size: content.length });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, tool, file, content, filename, newTool } = body;

    if (action === "save" && tool && file && content) {
      const toolDir = findToolDir(tool);
      if (!toolDir) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
      
      const filePath = path.join(/* turbopackIgnore: true */ toolDir, file);
      if (filePath.includes("..")) return NextResponse.json({ error: "Invalid path" }, { status: 400 });
      
      const backupPath = filePath + ".bak";
      if (fs.existsSync(/* turbopackIgnore: true */ filePath)) {
        fs.copyFileSync(/* turbopackIgnore: true */ filePath, backupPath);
      }
      
      fs.writeFileSync(/* turbopackIgnore: true */ filePath, content, "utf-8");
      return NextResponse.json({ success: true, message: "File saved! Backup created." });
    }

    if (action === "create-file" && tool && filename && content) {
      const toolDir = findToolDir(tool);
      if (!toolDir) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
      
      const filePath = path.join(/* turbopackIgnore: true */ toolDir, filename);
      if (filePath.includes("..")) return NextResponse.json({ error: "Invalid path" }, { status: 400 });
      if (fs.existsSync(/* turbopackIgnore: true */ filePath)) return NextResponse.json({ error: "File already exists" }, { status: 409 });
      
      fs.writeFileSync(/* turbopackIgnore: true */ filePath, content || "// New file", "utf-8");
      return NextResponse.json({ success: true, message: "File created!" });
    }

    if (action === "delete-file" && tool && file) {
      const toolDir = findToolDir(tool);
      if (!toolDir) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
      
      const filePath = path.join(/* turbopackIgnore: true */ toolDir, file);
      if (filePath.includes("..")) return NextResponse.json({ error: "Invalid path" }, { status: 400 });
      if (!fs.existsSync(/* turbopackIgnore: true */ filePath)) return NextResponse.json({ error: "File not found" }, { status: 404 });
      
      const backupPath = filePath + ".deleted." + Date.now();
      fs.renameSync(/* turbopackIgnore: true */ filePath, backupPath);
      return NextResponse.json({ success: true, message: "File moved to backup" });
    }

    if (action === "create-tool" && newTool) {
      const { slug, category, name } = newTool;
      if (!slug || !category || !name) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      
      const toolDir = path.join(/* turbopackIgnore: true */ TOOLS_DIR, category, slug);
      if (fs.existsSync(/* turbopackIgnore: true */ toolDir)) return NextResponse.json({ error: "Tool already exists" }, { status: 409 });
      
      fs.mkdirSync(/* turbopackIgnore: true */ toolDir, { recursive: true });
      fs.mkdirSync(/* turbopackIgnore: true */ path.join(toolDir, "content"), { recursive: true });
      
      const defaultContent = `"use client";
import { useState } from "react";
import { useTheme } from "@/components/theme/contexts/ThemeContext";

export default function ${name.replace(/[^a-zA-Z]/g, "")}Tool() {
  const { themeColors } = useTheme();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  return (
    <div className="p-6" style={{ backgroundColor: "var(--background)", color: "var(--text-primary)" }}>
      <h1 className="text-2xl font-bold mb-4">${name}</h1>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter value..."
        className="w-full p-3 border rounded-xl mb-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--text-primary)" }} />
      <button onClick={() => setResult("Result: " + input)} className="px-6 py-3 text-white rounded-xl font-medium" style={{ backgroundColor: "var(--primary)" }}>
        Process
      </button>
      {result && <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "var(--surface)" }}>{result}</div>}
    </div>
  );
}
`;
      
      fs.writeFileSync(/* turbopackIgnore: true */ path.join(toolDir, "tool.client.tsx"), defaultContent);
      
      for (const lang of ["en", "ur", "hi", "ar"]) {
        fs.writeFileSync(/* turbopackIgnore: true */ path.join(toolDir, "content", `${lang}.ts`), `export const content = { title: "${name}", description: "Free online ${name.toLowerCase()}" };`);
      }
      
      return NextResponse.json({ success: true, message: "Tool created with default files!", slug });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function findToolDir(slug: string): string | null {
  const categories = ["calculators", "code-tools", "design-tools", "image-tools", "pdf-tools", "security-tools", "text-tools"];
  for (const cat of categories) {
    const dir = path.join(/* turbopackIgnore: true */ TOOLS_DIR, cat, slug);
    if (fs.existsSync(/* turbopackIgnore: true */ dir)) return dir;
  }
  return null;
}

function getAllFiles(dir: string): any[] {
  const files: any[] = [];
  const items = fs.readdirSync(/* turbopackIgnore: true */ dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(/* turbopackIgnore: true */ dir, item.name);
    if (item.isDirectory()) {
      files.push({
        name: item.name,
        type: "folder",
        path: item.name,
        children: getAllFiles(fullPath)
      });
    } else {
      const ext = path.extname(item.name);
      files.push({
        name: item.name,
        type: "file",
        path: item.name,
        ext: ext.replace(".", ""),
        size: fs.statSync(/* turbopackIgnore: true */ fullPath).size,
        icon: getFileIcon(ext)
      });
    }
  }
  return files;
}

function getFileIcon(ext: string): string {
  const icons: Record<string, string> = {
    ".tsx": "⚛️", ".ts": "📘", ".css": "🎨", ".js": "📒",
    ".json": "📋", ".md": "📝", ".sql": "🗄️", ".html": "🌐"
  };
  return icons[ext] || "📄";
}
