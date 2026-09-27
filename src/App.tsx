import { useRef, useState } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Shirt,
  BriefcaseBusiness,
  UserRound,
  Snowflake,
} from "lucide-react";

type Category = "sherwani" | "formal" | "casual" | "ice";

const presets = {
  sherwani: [
    ["Royal Sherwani", "contrast(1.12) saturate(1.25)"],
    ["Wedding Gold", "sepia(.22) saturate(1.35) contrast(1.08)"],
    ["Mehndi Style", "hue-rotate(55deg) saturate(1.25)"],
    ["Classic Black", "grayscale(.25) contrast(1.25)"],
  ],
  formal: [
    ["Executive", "contrast(1.18) saturate(.82)"],
    ["Office Pro", "brightness(1.04) contrast(1.12)"],
    ["Luxury", "contrast(1.2) saturate(1.12)"],
    ["Classic", "sepia(.12) contrast(1.08)"],
  ],
  casual: [
    ["Denim", "saturate(1.15) hue-rotate(185deg)"],
    ["Street", "contrast(1.15) saturate(1.2)"],
    ["Fresh", "brightness(1.08) saturate(1.15)"],
    ["Dark Jeans", "brightness(.82) contrast(1.2)"],
  ],
  ice: [
    ["Ice Pink", "hue-rotate(315deg) saturate(.8) brightness(1.08)"],
    ["Ice Blue", "hue-rotate(175deg) saturate(.75) brightness(1.08)"],
    ["Ice Green", "hue-rotate(85deg) saturate(.7)"],
    ["Cold", "saturate(.55) brightness(1.08) contrast(1.08)"],
  ],
};

const colors = [
  ["Pink", "#ec4899"],
  ["Red", "#ef4444"],
  ["Mehndi", "#6b7f23"],
  ["Brown", "#8b5e3c"],
  ["Blue", "#2563eb"],
  ["Black", "#111827"],
  ["Yellow", "#eab308"],
  ["Peach", "#fb923c"],
];

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<string>("");
  const [category, setCategory] = useState<Category>("sherwani");
  const [filter, setFilter] = useState("none");
  const [color, setColor] = useState<string>("");
  const [before, setBefore] = useState(false);
  const [processing, setProcessing] = useState(false);

  const uploadImage = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const url = URL.createObjectURL(file);
    setImage(url);
    setFilter("none");
    setColor("");
    setBefore(false);
  };

  const applyPreset = (value: string) => {
    setProcessing(true);

    setTimeout(() => {
      setFilter(value);
      setProcessing(false);
    }, 350);
  };

  const reset = () => {
    setFilter("none");
    setColor("");
    setBefore(false);
  };

  const exportPNG = () => {
    if (!image) {
      alert("Pehle photo upload karo.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.filter = before || filter === "none" ? "none" : filter;
      ctx.drawImage(img, 0, 0);

      if (!before && color) {
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }

      const link = document.createElement("a");
      link.download = "AuraShot-AI.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = image;
  };

  const tabs = [
    { id: "sherwani", label: "Sherwani", icon: Sparkles },
    { id: "formal", label: "Formal", icon: BriefcaseBusiness },
    { id: "casual", label: "Casual", icon: Shirt },
    { id: "ice", label: "Ice Lens", icon: Snowflake },
  ] as const;

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="logo">AuraShot AI</div>
          <div className="subtitle">AI Photo Style Studio</div>
        </div>

        <button className="iconBtn" onClick={reset}>
          <RotateCcw size={20} />
        </button>
      </header>

      <main>
        <section className="previewCard">
          {!image ? (
            <button
              className="uploadArea"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={42} />
              <strong>Upload Your Photo</strong>
              <span>JPG, PNG or WEBP</span>
            </button>
          ) : (
            <div className="preview">
              <img
                src={image}
                alt="AuraShot preview"
                style={{
                  filter: before ? "none" : filter,
                }}
              />

              {!before && color && (
                <div
                  className="colorOverlay"
                  style={{ backgroundColor: color }}
                />
              )}

              {processing && (
                <div className="processing">
                  <Sparkles size={26} />
                  <span>Processing...</span>
                </div>
              )}
            </div>
          )}
        </section>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => uploadImage(e.target.files?.[0])}
        />

        <canvas ref={canvasRef} hidden />

        <button
          className="uploadBtn"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={19} />
          {image ? "Change Photo" : "Upload Photo"}
        </button>

        <div className="sectionTitle">Style</div>

        <div className="tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                className={category === tab.id ? "tab active" : "tab"}
                onClick={() => setCategory(tab.id)}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="presetGrid">
          {presets[category].map(([name, value]) => (
            <button
              key={name}
              className="preset"
              onClick={() => applyPreset(value)}
            >
              <div className="presetIcon">
                {category === "sherwani" && <Sparkles size={20} />}
                {category === "formal" && <BriefcaseBusiness size={20} />}
                {category === "casual" && <UserRound size={20} />}
                {category === "ice" && <Snowflake size={20} />}
              </div>
              <span>{name}</span>
            </button>
          ))}
        </div>

        <div className="sectionTitle">Fabric Colour</div>

        <div className="colors">
          {colors.map(([name, value]) => (
            <button
              key={name}
              className={color === value ? "color selected" : "color"}
              style={{ backgroundColor: value }}
              title={name}
              onClick={() => setColor(value)}
            />
          ))}
        </div>

        <div className="actions">
          <button
            className={before ? "action activeAction" : "action"}
            onClick={() => setBefore(!before)}
            disabled={!image}
          >
            Before
          </button>

          <button className="action" onClick={reset}>
            <RotateCcw size={17} />
            Reset
          </button>

          <button className="action primary" onClick={exportPNG}>
            <Download size={17} />
            HD PNG
          </button>
        </div>

        <p className="note">
          AuraShot AI currently applies visual photo styles and colour effects.
          Real AI clothing replacement can be connected later.
        </p>
      </main>
    </div>
  );
}
