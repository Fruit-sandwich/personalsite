import React, { useState } from "react";
import { PersonalSiteData, ProjectItem, ProjectSection } from "../types";
import {
  X,
  Sparkles,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface SiteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PersonalSiteData;
  onSave: (updatedData: PersonalSiteData) => void;
  onReset: () => void;
}

export const SiteEditorModal: React.FC<SiteEditorModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<PersonalSiteData>(data);
  const [activeTab, setActiveTab] = useState<"general" | "projects" | "tools" | "sync">("general");

  // AI Refine State
  const [aiInstruction, setAiInstruction] = useState("Make it concise, creative, and futuristic");
  const [isRefining, setIsRefining] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync formData with props when opened
  React.useEffect(() => {
    if (isOpen) {
      setFormData(data);
      setSaveSuccess(false);
      setAiMessage(null);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleRefineBioWithAI = async () => {
    setIsRefining(true);
    setAiMessage(null);
    try {
      const response = await fetch("/api/ai/refine-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: formData.bio,
          name: formData.name,
          title: formData.title,
          instruction: aiInstruction,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to refine bio.");
      }

      if (resData.refinedBio) {
        setFormData((prev) => ({ ...prev, bio: resData.refinedBio }));
        setAiMessage("Bio refined successfully with Gemini 3.5 Flash!");
      }
    } catch (err: any) {
      console.error(err);
      setAiMessage(`AI error: ${err.message}`);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = () => {
    const updated: PersonalSiteData = {
      ...formData,
      datePublished: new Date().toISOString(),
    };
    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleAddProject = (sectionId: string) => {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "New Project Exploration",
      url: "https://",
      description: "Short description of the new digital artwork or experiment.",
      badge: "New",
    };

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, items: [newProject, ...sec.items] } : sec
      ),
    }));
  };

  const handleDeleteProject = (sectionId: string, projectId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, items: sec.items.filter((item) => item.id !== projectId) }
          : sec
      ),
    }));
  };

  const handleUpdateProject = (
    sectionId: string,
    projectId: string,
    field: keyof ProjectItem,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              items: sec.items.map((item) =>
                item.id === projectId ? { ...item, [field]: value } : item
              ),
            }
          : sec
      ),
    }));
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `dennis-mabuka-data-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed.name && parsed.bio) {
            setFormData(parsed);
            setAiMessage("Imported successfully from JSON file!");
          } else {
            setAiMessage("Invalid JSON structure: missing name or bio.");
          }
        } catch {
          setAiMessage("Failed to parse JSON file.");
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto rounded-2xl bg-[#181818] border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#1a1a1a] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white font-serif italic">
              Update Personal Website
            </h2>
            <p className="text-xs text-zinc-400">
              Customize bio, works, links &amp; leverage Gemini AI content tools.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 px-6 bg-[#161616] text-xs sm:text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-4 border-b-2 font-mono transition-colors ${
              activeTab === "general"
                ? "border-[#8fff00] text-[#8fff00] font-bold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Bio &amp; Persona
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`py-3 px-4 border-b-2 font-mono transition-colors ${
              activeTab === "projects"
                ? "border-[#8fff00] text-[#8fff00] font-bold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Projects &amp; Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tools")}
            className={`py-3 px-4 border-b-2 font-mono transition-colors ${
              activeTab === "tools"
                ? "border-[#8fff00] text-[#8fff00] font-bold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Tools &amp; Education
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sync")}
            className={`py-3 px-4 border-b-2 font-mono transition-colors ${
              activeTab === "sync"
                ? "border-[#8fff00] text-[#8fff00] font-bold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Import / Export
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {aiMessage && (
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-[#ffed00] flex items-center justify-between">
              <span>{aiMessage}</span>
              <button
                type="button"
                onClick={() => setAiMessage(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-zinc-700 text-white focus:outline-none focus:border-[#8fff00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Artist Title / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-zinc-700 text-white focus:outline-none focus:border-[#8fff00]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-zinc-400">
                    Short Bio Text
                  </label>
                  <span className="text-[11px] text-zinc-500">First-person narrative</span>
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={5}
                  className="w-full p-3 rounded-lg bg-[#121212] border border-zinc-700 text-white focus:outline-none focus:border-[#8fff00] font-sans leading-relaxed"
                />
              </div>

              {/* Gemini AI Bio Refiner Section */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 via-[#1a1720] to-zinc-900 border border-[#ff0ae4]/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff0ae4]" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Gemini Intelligence: Refine Bio with AI
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={aiInstruction}
                    onChange={(e) => setAiInstruction(e.target.value)}
                    placeholder="e.g. Make it more focused on 3D Blender &amp; SVG art"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#121212] border border-zinc-700 text-zinc-200 focus:outline-none focus:border-[#ff0ae4]"
                  />
                  <button
                    type="button"
                    onClick={handleRefineBioWithAI}
                    disabled={isRefining}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#ff0ae4] text-black font-bold text-xs hover:bg-[#ff4bf2] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isRefining ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Polishing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply AI Polish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Connect & Web3 Keys */}
              <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Connect &amp; Web3 Keys</h4>
                  <span className="text-[11px] text-zinc-500 font-mono">Arweave &amp; Ethereum ENS</span>
                </div>
                <div className="space-y-2.5">
                  {formData.socials.map((soc, idx) => (
                    <div key={soc.id || idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                      <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                        <span className="text-zinc-600">0{idx + 1}</span>
                        <span className="text-zinc-200 font-semibold">{soc.label}</span>
                      </div>
                      <input
                        type="text"
                        value={soc.handle || ""}
                        onChange={(e) => {
                          const updated = [...formData.socials];
                          updated[idx] = { ...updated[idx], handle: e.target.value };
                          setFormData({ ...formData, socials: updated });
                        }}
                        placeholder="Handle / Address (e.g. riotgear.eth)"
                        className="px-3 py-1.5 rounded-lg bg-[#181818] border border-zinc-700 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => {
                          const updated = [...formData.socials];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setFormData({ ...formData, socials: updated });
                        }}
                        placeholder="https://..."
                        className="px-3 py-1.5 rounded-lg bg-[#181818] border border-zinc-700 text-[#8fff00] text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              {formData.sections.map((section) => (
                <div
                  key={section.id}
                  className="p-4 rounded-xl bg-[#121212] border border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white font-serif italic text-base">
                      {section.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleAddProject(section.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-zinc-800 hover:bg-[#8fff00] hover:text-black text-[#8fff00] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-[#181818] border border-zinc-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
                      >
                        <div className="space-y-2 flex-1 w-full">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) =>
                                handleUpdateProject(section.id, item.id, "title", e.target.value)
                              }
                              placeholder="Project Title"
                              className="px-2.5 py-1.5 rounded bg-[#121212] border border-zinc-700 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) =>
                                handleUpdateProject(section.id, item.id, "url", e.target.value)
                              }
                              placeholder="https://..."
                              className="px-2.5 py-1.5 rounded bg-[#121212] border border-zinc-700 text-xs text-[#8fff00]"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={item.description || ""}
                              onChange={(e) =>
                                handleUpdateProject(
                                  section.id,
                                  item.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Short blurb / description"
                              className="sm:col-span-2 px-2.5 py-1 rounded bg-[#121212] border border-zinc-700 text-xs text-zinc-300"
                            />
                            <input
                              type="text"
                              value={item.badge || ""}
                              onChange={(e) =>
                                handleUpdateProject(section.id, item.id, "badge", e.target.value)
                              }
                              placeholder="Badge (e.g. Featured)"
                              className="px-2.5 py-1 rounded bg-[#121212] border border-zinc-700 text-xs text-zinc-300"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(section.id, item.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "tools" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800 space-y-3">
                <h4 className="font-bold text-white text-base">University &amp; Study</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={formData.university.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          university: { ...formData.university, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-zinc-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Course / Dept URL</label>
                    <input
                      type="text"
                      value={formData.university.url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          university: { ...formData.university, url: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-zinc-700 text-[#8fff00] text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800 space-y-3">
                <h4 className="font-bold text-white text-base">Favorite Creative Tools</h4>
                <div className="space-y-2">
                  {formData.tools.map((tool, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tool.name}
                        onChange={(e) => {
                          const newTools = [...formData.tools];
                          newTools[index].name = e.target.value;
                          setFormData({ ...formData, tools: newTools });
                        }}
                        className="w-1/3 px-3 py-1.5 rounded-lg bg-[#181818] border border-zinc-700 text-white text-xs"
                        placeholder="Tool Name"
                      />
                      <input
                        type="text"
                        value={tool.url}
                        onChange={(e) => {
                          const newTools = [...formData.tools];
                          newTools[index].url = e.target.value;
                          setFormData({ ...formData, tools: newTools });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#181818] border border-zinc-700 text-[#8fff00] text-xs"
                        placeholder="https://..."
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs text-[#ff0ae4] font-mono block mb-1">
                    Featured Tool Highlight
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.favoriteToolHighlight || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, favoriteToolHighlight: e.target.value })
                      }
                      placeholder="e.g. unit"
                      className="w-1/3 px-3 py-1.5 rounded-lg bg-[#181818] border border-zinc-700 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={formData.favoriteToolUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, favoriteToolUrl: e.target.value })
                      }
                      placeholder="https://unit.software/"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#181818] border border-zinc-700 text-[#8fff00] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sync" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#121212] border border-zinc-800 space-y-2">
                <h4 className="font-bold text-white text-base">Webstudio Data Sync Format</h4>
                <p className="text-xs text-zinc-400">
                  Export your website data as a JSON file matching the personal site dynamic sync
                  format, or import an updated JSON state.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222] border border-zinc-700 text-xs font-bold text-white hover:bg-zinc-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#ffed00]" />
                    <span>Download data.json</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222] border border-zinc-700 text-xs font-bold text-white hover:bg-zinc-800 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#8fff00]" />
                    <span>Import data.json</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-red-900/40 text-xs text-red-400 hover:bg-red-950/40 transition-colors ml-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#1a1a1a] rounded-b-2xl">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#8fff00] text-black font-bold text-xs hover:bg-[#a6ff2e] transition-colors shadow-lg shadow-[#8fff00]/20 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Updates</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
