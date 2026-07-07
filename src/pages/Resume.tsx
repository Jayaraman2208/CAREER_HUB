import { useState } from "react";
import { Button, Card, Input, SectionTitle } from "../components/ui";

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  projects: string;
}

const INITIAL: ResumeData = {
  name: "Jane Doe",
  title: "Software Engineer",
  email: "jane@example.com",
  phone: "+91 90000 00000",
  location: "Bengaluru, India",
  summary:
    "Final-year CS student passionate about building scalable systems. Strong in DSA and full-stack development.",
  skills: "Python, JavaScript, React, SQL, Data Structures, Git",
  experience:
    "Software Intern — Acme Corp (2024)\n• Built REST APIs serving 10k requests/day\n• Reduced page load time by 40%",
  education:
    "B.Tech Computer Science — XYZ University (2021–2025)\nCGPA: 8.7/10",
  projects:
    "AI Career Hub — A placement prep platform with online compiler\nPortfolio Website — Personal site built with React",
};

export default function Resume() {
  const [data, setData] = useState<ResumeData>(INITIAL);
  const set = (k: keyof ResumeData, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <div>
      <SectionTitle
        title="Resume Builder"
        subtitle="Fill in your details and see a live preview. Use Print to save as PDF."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card className="space-y-4 lg:max-h-[78vh] lg:overflow-y-auto print:hidden">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name" value={data.name} onChange={(e) => set("name", e.target.value)} />
            <Input label="Title" value={data.title} onChange={(e) => set("title", e.target.value)} />
            <Input label="Email" value={data.email} onChange={(e) => set("email", e.target.value)} />
            <Input label="Phone" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <Input label="Location" value={data.location} onChange={(e) => set("location", e.target.value)} />
          {(
            [
              ["summary", "Professional Summary"],
              ["skills", "Skills (comma separated)"],
              ["experience", "Experience"],
              ["education", "Education"],
              ["projects", "Projects"],
            ] as [keyof ResumeData, string][]
          ).map(([k, label]) => (
            <label key={k} className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">
                {label}
              </span>
              <textarea
                value={data[k]}
                onChange={(e) => set(k, e.target.value)}
                rows={k === "summary" ? 3 : 4}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-cyan-400/50"
              />
            </label>
          ))}
          <Button className="w-full" onClick={() => window.print()}>
            🖨️ Print / Save as PDF
          </Button>
        </Card>

        {/* Preview */}
        <div className="print:col-span-2">
          <div
            id="resume-preview"
            className="mx-auto rounded-2xl bg-white p-8 text-slate-800 shadow-2xl"
          >
            <div className="border-b-2 border-slate-800 pb-3">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {data.name}
              </h1>
              <p className="text-sm font-semibold text-indigo-600">
                {data.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {data.email} · {data.phone} · {data.location}
              </p>
            </div>

            {(
              [
                ["Summary", data.summary],
                ["Skills", data.skills],
                ["Experience", data.experience],
                ["Education", data.education],
                ["Projects", data.projects],
              ] as [string, string][]
            ).map(([title, body]) => (
              <section key={title} className="mt-4">
                <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-700">
                  {title}
                </h2>
                {title === "Skills" ? (
                  <div className="flex flex-wrap gap-1.5">
                    {body
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((s) => (
                        <span
                          key={s}
                          className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                    {body}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
