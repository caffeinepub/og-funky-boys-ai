import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Download,
  Film,
  Image,
  Menu,
  MessageSquare,
  Mic,
  MicOff,
  Music,
  Plus,
  Send,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Types ───────────────────────────────────────────────────────────────
type MessageRole = "user" | "assistant";
type AttachmentType = "image" | "audio" | "video";

interface Attachment {
  type: AttachmentType;
  url: string;
  name: string;
}

interface ProgressCard {
  type: "progress";
  steps: string[];
  currentStep: number;
  progress: number;
  isMovie?: boolean;
  duration?: number;
}

interface ResultCard {
  type: "result";
  text: string;
}

interface PictorialCard {
  type: "pictorial";
  transcript: string;
  sceneTitle: string;
  sceneDescription: string;
  animeStyle: string;
  colors: string[];
  elements: string[];
}

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  progressCard?: ProgressCard;
  resultCard?: ResultCard;
  pictorialCard?: PictorialCard;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

// ── Anime presets ────────────────────────────────────────────────────────
const ANIME_PRESETS = [
  {
    id: "naruto",
    name: "Naruto Style",
    emoji: "🍃",
    gradient: "from-orange-600 to-yellow-500",
    desc: "Chakra aura & leaf village vibes",
  },
  {
    id: "dbz",
    name: "Dragon Ball Z",
    emoji: "⚡",
    gradient: "from-yellow-500 to-orange-500",
    desc: "Super Saiyan energy effects",
  },
  {
    id: "onepiece",
    name: "One Piece",
    emoji: "🏴‍☠️",
    gradient: "from-red-600 to-orange-400",
    desc: "Pirate king aesthetic",
  },
  {
    id: "demonslayer",
    name: "Demon Slayer",
    emoji: "🌸",
    gradient: "from-pink-500 to-red-600",
    desc: "Breathing technique overlays",
  },
  {
    id: "aot",
    name: "Attack on Titan",
    emoji: "⚔️",
    gradient: "from-slate-600 to-zinc-500",
    desc: "Survey Corps dark aesthetic",
  },
  {
    id: "mha",
    name: "My Hero Academia",
    emoji: "💪",
    gradient: "from-green-500 to-blue-500",
    desc: "Quirk activation effects",
  },
  {
    id: "jjk",
    name: "Jujutsu Kaisen",
    emoji: "👁️",
    gradient: "from-purple-600 to-blue-700",
    desc: "Cursed energy domain expansion",
  },
  {
    id: "bleach",
    name: "Bleach",
    emoji: "🌑",
    gradient: "from-gray-800 to-purple-800",
    desc: "Soul reaper bankai effects",
  },
];

const OG_ANIME_PRESETS = [
  {
    id: "og-ultra",
    name: "OG Ultra Mode",
    emoji: "👑",
    gradient: "from-yellow-400 to-orange-500",
    desc: "Exclusive OG power-up",
  },
  {
    id: "og-legendary",
    name: "OG Legendary",
    emoji: "🔥",
    gradient: "from-amber-400 to-yellow-300",
    desc: "Legendary golden transformation",
  },
];

// ── AI response generator ────────────────────────────────────────────────
function generateAIResponse(
  userMsg: string,
  attachments?: Attachment[],
): string {
  if (attachments && attachments.length > 0) {
    const type = attachments[0].type;
    if (type === "image") {
      return `🎨 **Image Analysis Complete!**\n\nI've analyzed your photo and detected the perfect anime transformation opportunities! Here are the styles I can apply:\n\n• **Naruto Style** — Chakra aura effects + hidden leaf village filter\n• **Demon Slayer** — Breathing technique particle overlays\n• **Dragon Ball Z** — Super Saiyan golden energy blast effects\n• **Jujutsu Kaisen** — Cursed energy dark aura with domain expansion\n\nWhich anime transformation would you like me to apply? I can also mix multiple styles for a unique look! 🌟`;
    }
    if (type === "video") {
      return `🎬 **Video Ready for Anime Transformation!**\n\nYour video is loaded and I've analyzed the motion patterns. I can enhance it with:\n\n• **Dynamic Speed Lines** — Classic anime action effect\n• **Dragon Ball Z Energy Blasts** — Ki explosion on impact frames\n• **Naruto Chakra Mode** — Glowing aura synced to movement\n• **Attack on Titan ODM Gear** — Wire swinging particle trails\n• **My Hero Academia Quirk FX** — Power activation visual bursts\n\nI can also add an **anime soundtrack overlay** to match the vibe. What's your vision? ⚡`;
    }
    if (type === "audio") {
      return `🎵 **Audio Beat Analysis Done!**\n\nI've analyzed your audio and mapped ${Math.floor(Math.random() * 80 + 40)} beat drops and rhythm peaks. I can sync these anime effects to your track:\n\n• **Flash cuts** on every beat drop\n• **Energy bursts** at peak frequencies  \n• **Sakura petals / lightning** flowing with the melody\n• **Demon Slayer breathing patterns** synced to BPM\n• **Super Saiyan charge-up** building with the crescendo\n\nThis is going to be absolutely EPIC! Which style do you want to ride the beat? 🎶`;
    }
  }

  const lower = userMsg.toLowerCase();
  if (lower.includes("naruto")) {
    return `🍃 **Naruto Style Transformation!**\n\nLet's give you that Hidden Leaf Village energy! I'll apply:\n\n• **Kyuubi chakra aura** — orange/red energy wisps around the subject\n• **Sharingan eye filter** (if Sasuke mode is activated)\n• **Rasengan particle burst** as a focal point effect\n• **Konoha headband** digitally added via AR\n• **Team 7 color grading** — warm earthy tones with high contrast\n\nBelieve it! 🎯 Upload a photo or video to get started!`;
  }
  if (
    lower.includes("dragon ball") ||
    lower.includes("dbz") ||
    lower.includes("saiyan")
  ) {
    return "⚡ **OVER 9000 POWER DETECTED!**\n\nTime to go Super Saiyan! Your anime edit will include:\n\n• **Golden SSJ aura** with electric sparks\n• **Spirit Bomb energy** gathering particles\n• **Kamehameha wave** directional blast effect  \n• **Ground crack** destruction particles\n• **Z Warriors color filter** — epic battle-ready tones\n\nKAMEHAMEHA! 🌟 Upload your media to transform it!";
  }
  if (lower.includes("demon slayer") || lower.includes("breathing")) {
    return `🌸 **Demon Slayer Breathing Effect Loaded!**\n\nYour transformation will channel the power of Total Concentration Breathing:\n\n• **Water Breathing** — flowing blue particle streams\n• **Flame Breathing** — Rengoku's iconic orange inferno\n• **Thunder Breathing** — Zenitsu's lightning bolt overlays\n• **Wind Breathing** — green slicing air effects\n• **Tanjiro's scar** — subtle facial marking filter\n\nDemon Slayer tier quality! 💎 Upload your photo or video to begin!`;
  }

  const responses = [
    `✨ **OG Funky Boys AI is ready to work!**\n\nI can transform any media into stunning anime artwork! Here's what I offer:\n\n• **Photo → Anime** — Convert any photo into your chosen anime art style\n• **Video Effects** — Add anime visual effects synced to motion\n• **Audio Visualization** — Create anime music videos with beat-synced effects\n• **Style Mixing** — Combine multiple anime aesthetics\n\nUpload a photo, video, or audio file to get started, or tell me which anime style you want! What's your vision? 🎨`,
    `🔥 **Let's create something legendary!**\n\nTell me more about your anime edit vision:\n\n• Which anime universe? (Naruto, DBZ, One Piece, Demon Slayer...)\n• What's the mood? (Epic battle, peaceful, transformation, emotional)\n• Any specific effects? (Energy auras, speed lines, particle effects)\n• Color palette preference? (Vibrant, dark & gritty, pastel, neon)\n\nThe more details you give me, the more EPIC your edit will be! 👑`,
    "🎌 **Anime Edit Expert at your service!**\n\nI specialize in these transformations:\n\n🍃 **Naruto Universe** — Chakra, jutsu effects, Hidden Village aesthetics\n⚡ **Dragon Ball** — Super Saiyan auras, energy blasts, scouter readings\n🏴‍☠️ **One Piece** — Haki effects, Devil Fruit powers, Grand Line atmosphere\n🌸 **Demon Slayer** — Breathing form particles, demon blood art\n\nWhat would you like to create today? Upload some media or describe your idea!",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ── Confetti ─────────────────────────────────────────────────────────────
function spawnConfetti(colors?: string[]) {
  const defaultColors = [
    "#FFD700",
    "#FF6D00",
    "#1565C0",
    "#FF4081",
    "#00E676",
    "#E040FB",
  ];
  const palette = colors ?? defaultColors;
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.className = "confetti-particle";
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = "-20px";
    el.style.background = palette[Math.floor(Math.random() * palette.length)];
    el.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    el.style.animationDelay = `${Math.random() * 0.8}s`;
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${6 + Math.random() * 8}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ── Sample chat sessions ──────────────────────────────────────────────────
const SAMPLE_SESSIONS: ChatSession[] = [
  {
    id: "s1",
    title: "Naruto Transformation Edit",
    lastMessage: "Super Saiyan effects applied!",
    timestamp: new Date(Date.now() - 3600000),
    messages: [],
  },
  {
    id: "s2",
    title: "Dragon Ball Z Music Video",
    lastMessage: "Beat-synced Kamehameha effects",
    timestamp: new Date(Date.now() - 86400000),
    messages: [],
  },
  {
    id: "s3",
    title: "Demon Slayer Photo Edit",
    lastMessage: "Water Breathing particles added",
    timestamp: new Date(Date.now() - 172800000),
    messages: [],
  },
];

// ── Progress simulation ───────────────────────────────────────────────────
const EDIT_STEPS = [
  "Analyzing media...",
  "Applying anime style effects...",
  "Rendering final output...",
  "Complete! ✓",
];

function getMovieSteps(duration: number): string[] {
  return [
    "Initializing movie renderer...",
    "Building scene sequences...",
    "Rendering frames...",
    `Encoding ${duration}min movie...`,
    "Movie ready! 🎬",
  ];
}

// ── localStorage helpers ─────────────────────────────────────────────────
const LS_KEY = "ogfb_sessions";

function loadSessionsFromStorage(): ChatSession[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return SAMPLE_SESSIONS;
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      title: string;
      lastMessage: string;
      timestamp: string;
      messages: Array<{
        id: string;
        role: MessageRole;
        content: string;
        attachments?: Attachment[];
        timestamp: string;
        progressCard?: ProgressCard;
        resultCard?: ResultCard;
      }>;
    }>;
    return parsed.map((s) => ({
      ...s,
      timestamp: new Date(s.timestamp),
      messages: s.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }));
  } catch {
    return SAMPLE_SESSIONS;
  }
}

// ── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [sessions, setSessions] = useState<ChatSession[]>(() =>
    loadSessionsFromStorage(),
  );
  const [activeSessionId, setActiveSessionId] = useState<string>("new");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cheatModalOpen, setCheatModalOpen] = useState(false);
  const [cheatCode, setCheatCode] = useState("");
  const [cheatError, setCheatError] = useState(false);
  const [ogMode, setOgMode] = useState(false);
  const [movieMode, setMovieMode] = useState(false);
  const [movieDialogOpen, setMovieDialogOpen] = useState(false);
  const [movieStyle, setMovieStyle] = useState(ANIME_PRESETS[0].name);
  const [movieDuration, setMovieDuration] = useState(30);
  const [movieStory, setMovieStory] = useState("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>(
    [],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cheatInputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef is stable
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Persist sessions to localStorage (cap at 20)
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional JSON sync
  useEffect(() => {
    const toStore = sessions.slice(0, 20);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(toStore));
    } catch {
      // storage full — ignore
    }
  }, [JSON.stringify(sessions)]);

  // Close sidebar on mobile when changing to desktop
  useEffect(() => {
    if (!isMobile) return;
    setSidebarOpen(false);
  }, [isMobile]);

  function handleNewChat() {
    setActiveSessionId("new");
    setMessages([]);
    setPendingAttachments([]);
    setInputText("");
    if (isMobile) setSidebarOpen(false);
  }

  function generatePictorialScene(transcript: string): PictorialCard {
    const lower = transcript.toLowerCase();
    let animeStyle = "MHA Quirk Activation";
    let colors = ["#32CD32", "#00FF7F", "#1E90FF"];
    let elements = ["energy burst", "power surge", "hero aura"];
    if (lower.match(/fire|flame|burn/)) {
      animeStyle = "Demon Slayer Flame Breathing";
      colors = ["#FF4500", "#FF8C00", "#FFD700"];
      elements = ["flame pillars", "fire vortex", "ember sparks"];
    } else if (lower.match(/water|ocean|rain/)) {
      animeStyle = "Demon Slayer Water Breathing";
      colors = ["#00BFFF", "#1E90FF", "#87CEEB"];
      elements = ["water stream", "tidal wave", "mist veil"];
    } else if (lower.match(/fight|battle|power|strong/)) {
      animeStyle = "DBZ Super Saiyan";
      colors = ["#FFD700", "#FFA500", "#FFFF00"];
      elements = ["ki blast", "power aura", "lightning charge"];
    } else if (lower.match(/peace|calm|nature|wind/)) {
      animeStyle = "Naruto Wind Style";
      colors = ["#90EE90", "#228B22", "#F0E68C"];
      elements = ["wind spiral", "leaf dance", "nature flow"];
    } else if (lower.match(/dark|night|shadow|curse/)) {
      animeStyle = "JJK Cursed Energy";
      colors = ["#4B0082", "#8A2BE2", "#191970"];
      elements = ["cursed aura", "shadow tendrils", "dark vortex"];
    }
    const words = transcript.split(" ").slice(0, 3).join(" ");
    const sceneTitle = `${animeStyle}: ${words.charAt(0).toUpperCase() + words.slice(1)}`;
    const sceneDescription = `A dynamic anime scene inspired by the words: "${transcript}". The ${animeStyle} technique activates — ${elements.join(", ")} manifest in explosive visual form.`;
    return {
      type: "pictorial",
      transcript,
      sceneTitle,
      sceneDescription,
      animeStyle,
      colors,
      elements,
    };
  }

  function startSpeechToVisual() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "⚠️ Speech recognition is not supported in this browser. Try Chrome or Edge.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const card = generatePictorialScene(transcript);
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: `🎤 ${transcript}`,
        timestamp: new Date(),
      };
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        pictorialCard: card,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsListening(false);
    };
    recognition.onerror = () => {
      const errMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Could not capture speech. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }

  function handleDownload(text: string) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OG-Funky-Boys-Result.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: AttachmentType,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingAttachments((prev) => [...prev, { type, url, name: file.name }]);
    e.target.value = "";
  }

  function removeAttachment(index: number) {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Multi-step progress simulation ────────────────────────────────────
  function runProgressSimulation(
    progressMsgId: string,
    steps: string[],
    finalText: string,
    isMovie = false,
    duration = 0,
  ) {
    const totalMs = isMovie ? 4000 : 2500;
    const stepInterval = totalMs / steps.length;
    let stepIdx = 0;
    let prog = 0;
    const progPerTick = 100 / (totalMs / 60);

    const tick = setInterval(() => {
      prog = Math.min(100, prog + progPerTick);
      const newStepIdx = Math.min(
        steps.length - 1,
        Math.floor((prog / 100) * steps.length),
      );
      if (newStepIdx !== stepIdx) stepIdx = newStepIdx;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === progressMsgId
            ? {
                ...m,
                progressCard: {
                  type: "progress",
                  steps,
                  currentStep: stepIdx,
                  progress: Math.round(prog),
                  isMovie,
                  duration,
                },
              }
            : m,
        ),
      );

      if (prog >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          // Replace progress card with result card
          setMessages((prev) =>
            prev.map((m) =>
              m.id === progressMsgId
                ? {
                    ...m,
                    content: "",
                    progressCard: undefined,
                    resultCard: { type: "result", text: finalText },
                  }
                : m,
            ),
          );
        }, 600);
      }
    }, 60);

    // Suppress unused variable warning — stepInterval used conceptually
    void stepInterval;
  }

  async function handleSend() {
    if (!inputText.trim() && pendingAttachments.length === 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim(),
      attachments: [...pendingAttachments],
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setPendingAttachments([]);
    setIsTyping(true);

    const title =
      inputText.trim().slice(0, 40) || `${pendingAttachments[0]?.type} edit`;
    if (activeSessionId === "new") {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title,
        lastMessage: userMsg.content || `${pendingAttachments[0]?.type} upload`,
        timestamp: new Date(),
        messages: newMessages,
      };
      setSessions((prev) => [newSession, ...prev].slice(0, 20));
      setActiveSessionId(newSession.id);
    } else {
      // Update existing session messages
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: newMessages,
                lastMessage:
                  userMsg.content || `${pendingAttachments[0]?.type} upload`,
              }
            : s,
        ),
      );
    }

    // Show typing for 800ms then switch to progress card
    await new Promise((r) => setTimeout(r, 800));
    setIsTyping(false);

    const aiResponse = generateAIResponse(userMsg.content, userMsg.attachments);
    const progressMsgId = (Date.now() + 1).toString();
    const progressMsg: Message = {
      id: progressMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      progressCard: {
        type: "progress",
        steps: EDIT_STEPS,
        currentStep: 0,
        progress: 0,
      },
    };

    setMessages((prev) => [...prev, progressMsg]);
    runProgressSimulation(progressMsgId, EDIT_STEPS, aiResponse);
  }

  function handleMovieGenerate() {
    setMovieDialogOpen(false);
    const movieSteps = getMovieSteps(movieDuration);
    const finalText = `🎬 **Movie Generation Complete!**\n\nYour **${movieDuration}-minute ${movieStyle}** cinematic anime movie has been rendered!\n\n• **Style:** ${movieStyle}\n• **Duration:** ${movieDuration} minutes\n• **Resolution:** 4K Cinematic\n• **Frames rendered:** ${(movieDuration * 60 * 24).toLocaleString()} frames\n• **Story:** ${movieStory || "Epic anime adventure"}\n\nYour movie is ready to download! This is a MOVIE MODE exclusive feature. 🍿`;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `🎬 Generate ${movieDuration}min ${movieStyle} movie: ${movieStory || "Epic anime adventure"}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    const progressMsgId = (Date.now() + 1).toString();
    const progressMsg: Message = {
      id: progressMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      progressCard: {
        type: "progress",
        steps: movieSteps,
        currentStep: 0,
        progress: 0,
        isMovie: true,
        duration: movieDuration,
      },
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, progressMsg]);
      runProgressSimulation(
        progressMsgId,
        movieSteps,
        finalText,
        true,
        movieDuration,
      );
    }, 400);

    setMovieStory("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleCheatSubmit() {
    if (cheatCode === "OGFUNKYBOYS103") {
      setOgMode(true);
      setCheatModalOpen(false);
      setCheatCode("");
      spawnConfetti();
      const ogMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "👑 **OG MODE ACTIVATED!** Welcome to the OG Funky Boys exclusive experience!\n\n🔥 You now have access to:\n• **OG Ultra Mode** anime presets\n• **Legendary Golden** transformation effects\n• **Priority processing** for all edits\n• **Exclusive** OG Funky Boys watermarks\n\nYou are now part of the OG Funky Boys inner circle! Let's create something LEGENDARY! 🏆",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, ogMsg]);
    } else if (cheatCode === "MOVIEDANCE103") {
      setMovieMode(true);
      setCheatModalOpen(false);
      setCheatCode("");
      spawnConfetti([
        "#7C3AED",
        "#A855F7",
        "#C084FC",
        "#EC4899",
        "#06B6D4",
        "#fff",
      ]);
      const movieMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "🎬 **MOVIE MODE UNLOCKED!** You now have access to generate up to 2-hour real graphical movies! Use the 🎬 Generate Movie button to create cinematic anime movies from your media.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, movieMsg]);
    } else {
      setCheatError(true);
      setTimeout(() => setCheatError(false), 600);
    }
  }

  function handlePresetClick(presetName: string) {
    setInputText(`Apply ${presetName} style to my content`);
  }

  const currentPresets = ogMode
    ? [...ANIME_PRESETS, ...OG_ANIME_PRESETS]
    : ANIME_PRESETS;

  // Sync messages to active session whenever messages change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (activeSessionId === "new" || messages.length === 0) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages } : s)),
    );
  }, [JSON.stringify(messages), activeSessionId]);

  // Format message content with markdown-lite
  function formatContent(text: string) {
    const lines = text.split("\n");
    return lines.map((line, idx) => (
      <span key={line.length > 0 ? line : `empty-line-${idx}`}>
        {line.split(/(\*\*[^*]+\*\*)/).map((part) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={part} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <span key={part || "empty"}>{part}</span>
          ),
        )}
        {idx < lines.length - 1 ? <br /> : null}
      </span>
    ));
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* ── Mobile overlay backdrop ── */}
      {isMobile && sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col transition-all duration-300 ease-in-out border-r border-border
          ${
            isMobile
              ? `fixed inset-y-0 left-0 z-50 w-72 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : sidebarOpen
                ? "w-64"
                : "w-0 overflow-hidden"
          }
        `}
        style={{ background: "oklch(0.14 0.01 265)" }}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div
            className={`w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ${ogMode ? "og-glow" : ""}`}
            style={{
              boxShadow: ogMode
                ? undefined
                : "0 0 12px oklch(0.68 0.22 50 / 30%)",
            }}
          >
            <img
              src="/assets/uploads/IMG_20260310_200424-1.png"
              alt="OG Funky Boys"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1
              className={`text-sm font-display font-bold leading-tight truncate ${ogMode ? "og-gradient-text" : "gradient-text"}`}
            >
              OG Funky Boys AI
            </h1>
            <p className="text-xs text-muted-foreground">Anime Edit Studio</p>
          </div>
        </div>

        {/* New Chat */}
        <div className="p-3">
          <Button
            data-ocid="chat.primary_button"
            onClick={handleNewChat}
            className="w-full gap-2 font-semibold"
            style={{
              background: ogMode
                ? "linear-gradient(135deg, oklch(0.87 0.17 95), oklch(0.68 0.22 50))"
                : movieMode
                  ? "linear-gradient(135deg, oklch(0.48 0.22 300), oklch(0.62 0.20 300))"
                  : "linear-gradient(135deg, oklch(0.68 0.22 50), oklch(0.44 0.17 254))",
              border: "none",
              color: "#fff",
            }}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Chat history */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            <p className="text-xs text-muted-foreground px-2 py-1 uppercase tracking-wider">
              Recent
            </p>
            {sessions.map((session, idx) => (
              <button
                type="button"
                key={session.id}
                data-ocid={`sidebar.item.${idx + 1}`}
                onClick={() => {
                  setActiveSessionId(session.id);
                  setMessages(session.messages);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${
                  activeSessionId === session.id
                    ? "bg-accent/30 text-foreground"
                    : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                  <span className="text-sm truncate font-medium">
                    {session.title}
                  </span>
                </div>
                <p className="text-xs truncate mt-0.5 ml-5.5 opacity-50">
                  {session.lastMessage}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom actions */}
        <div className="p-3 border-t border-border space-y-2">
          {ogMode && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg og-glow"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.87 0.17 95 / 15%), oklch(0.68 0.22 50 / 15%))",
              }}
            >
              <Trophy
                className="w-4 h-4"
                style={{ color: "oklch(0.87 0.17 95)" }}
              />
              <span className="text-xs font-bold og-gradient-text">
                OG MODE ACTIVE
              </span>
              <Badge
                className="ml-auto text-xs px-1 py-0"
                style={{ background: "oklch(0.87 0.17 95)", color: "#000" }}
              >
                OG
              </Badge>
            </div>
          )}
          {movieMode && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.48 0.22 300 / 20%), oklch(0.62 0.20 300 / 20%))",
                border: "1px solid oklch(0.55 0.22 300 / 40%)",
                boxShadow: "0 0 12px oklch(0.55 0.22 300 / 25%)",
              }}
            >
              <Clapperboard
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "oklch(0.75 0.18 300)" }}
              />
              <span
                className="text-xs font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.75 0.18 300), oklch(0.85 0.14 320))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MOVIE MODE ACTIVE
              </span>
              <Badge
                className="ml-auto text-xs px-1 py-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.48 0.22 300), oklch(0.62 0.20 300))",
                  color: "#fff",
                }}
              >
                🎬
              </Badge>
            </div>
          )}
          <Button
            data-ocid="cheatcode.open_modal_button"
            variant="ghost"
            size="sm"
            onClick={() => setCheatModalOpen(true)}
            className="w-full gap-2 text-muted-foreground hover:text-foreground justify-start"
          >
            <Zap className="w-4 h-4" />
            Enter Cheat Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-muted-foreground hover:text-foreground justify-start"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <div className="flex items-center gap-2 px-2 py-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.68 0.22 50), oklch(0.44 0.17 254))",
              }}
            >
              OG
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">
                OG User
                {ogMode && <span className="ml-1 text-yellow-400">👑</span>}
                {movieMode && <span className="ml-1">🎬</span>}
              </p>
              <p className="text-xs text-muted-foreground">Anime Editor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex flex-col flex-1 min-w-0 h-[100dvh] min-w-0">
        {/* Header */}
        <header
          className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0"
          style={{ background: "oklch(0.13 0.005 265)" }}
        >
          {/* Desktop chevron toggle */}
          <button
            type="button"
            data-ocid="sidebar.toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors ${isMobile ? "hidden" : ""}`}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          {/* Mobile hamburger */}
          {isMobile && (
            <button
              type="button"
              data-ocid="sidebar.toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src="/assets/uploads/IMG_20260310_200424-1.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2
              className={`text-sm font-display font-bold ${ogMode ? "og-gradient-text" : "gradient-text"}`}
            >
              {activeSessionId === "new"
                ? "New Anime Edit"
                : (sessions.find((s) => s.id === activeSessionId)?.title ??
                  "Chat")}
            </h2>
          </div>

          {ogMode && (
            <Badge
              className="font-bold text-xs animate-og-shine"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.87 0.17 95), oklch(0.68 0.22 50))",
                color: "#000",
                backgroundSize: "200% auto",
              }}
            >
              👑 OG MODE
            </Badge>
          )}
          {movieMode && (
            <Badge
              className="font-bold text-xs"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.48 0.22 300), oklch(0.62 0.20 300))",
                color: "#fff",
              }}
            >
              🎬 MOVIE MODE
            </Badge>
          )}

          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
            style={{
              background: "oklch(0.22 0.02 265)",
              color: "oklch(0.60 0 0)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Online
          </div>
        </header>

        {/* Messages area */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="max-w-3xl mx-auto px-2 md:px-4 py-4 md:py-6 space-y-6">
            {messages.length === 0 ? (
              /* Welcome / preset area */
              <div className="fade-in-up">
                <div className="text-center mb-10 mt-6">
                  <div
                    className={`w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 ${ogMode ? "og-glow" : ""}`}
                    style={{ boxShadow: "0 0 30px oklch(0.68 0.22 50 / 30%)" }}
                  >
                    <img
                      src="/assets/uploads/IMG_20260310_200424-1.png"
                      alt="OG Funky Boys"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2
                    className={`text-3xl font-display font-bold mb-2 ${ogMode ? "og-gradient-text" : "gradient-text"}`}
                  >
                    OG Funky Boys AI
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    The ultimate AI-powered anime edit studio. Transform your
                    photos, videos, and audio into epic anime content.
                  </p>
                  {movieMode && (
                    <div
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-semibold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.48 0.22 300 / 20%), oklch(0.62 0.20 300 / 20%))",
                        border: "1px solid oklch(0.55 0.22 300 / 40%)",
                        color: "oklch(0.80 0.16 300)",
                      }}
                    >
                      <Clapperboard className="w-4 h-4" />
                      Movie Mode Active — Up to 2-hour cinematic generation
                    </div>
                  )}
                </div>

                {/* Prompt suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {[
                    {
                      icon: "🍃",
                      text: "Transform this photo into Naruto anime style",
                      sub: "Chakra aura + Hidden Leaf filter",
                    },
                    {
                      icon: "⚡",
                      text: "Add Dragon Ball Z energy effects to my video",
                      sub: "Super Saiyan golden aura",
                    },
                    {
                      icon: "🌸",
                      text: "Apply Demon Slayer breathing effects",
                      sub: "Water/Flame breathing particles",
                    },
                    {
                      icon: "👁️",
                      text: "Jujutsu Kaisen domain expansion edit",
                      sub: "Cursed energy dark aesthetic",
                    },
                  ].map((prompt, promptIdx) => (
                    <button
                      type="button"
                      key={prompt.text}
                      data-ocid={`prompt.item.${promptIdx + 1}`}
                      onClick={() => setInputText(prompt.text)}
                      className="text-left p-3.5 rounded-xl border border-border hover:border-primary/40 transition-all hover:bg-accent/10 group"
                      style={{ background: "oklch(0.16 0.01 265)" }}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl">{prompt.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {prompt.text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {prompt.sub}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Anime style presets */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles
                      className="w-4 h-4"
                      style={{ color: "oklch(0.68 0.22 50)" }}
                    />
                    <h3 className="text-sm font-semibold text-foreground">
                      Anime Style Presets
                    </h3>
                    {ogMode && (
                      <Badge
                        className="text-xs"
                        style={{
                          background: "oklch(0.87 0.17 95)",
                          color: "#000",
                        }}
                      >
                        +OG Exclusives
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {currentPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        data-ocid={`preset.item.${preset.id}`}
                        onClick={() => handlePresetClick(preset.name)}
                        className="flex-shrink-0 w-36 p-3 rounded-xl text-left transition-transform hover:scale-105 active:scale-95"
                        style={{
                          background: `linear-gradient(135deg, ${getGradientColors(preset.gradient)})`,
                          boxShadow: preset.id.startsWith("og-")
                            ? "0 0 16px oklch(0.87 0.17 95 / 40%)"
                            : undefined,
                        }}
                      >
                        <div className="text-2xl mb-1.5">{preset.emoji}</div>
                        <div className="text-white font-bold text-xs leading-tight">
                          {preset.name}
                        </div>
                        <div className="text-white/70 text-xs mt-0.5 line-clamp-2">
                          {preset.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Chat messages */
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 message-enter ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  {msg.role === "assistant" ? (
                    <div
                      className={`w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 ${ogMode ? "og-glow" : ""}`}
                      style={{
                        boxShadow: "0 0 10px oklch(0.68 0.22 50 / 30%)",
                      }}
                    >
                      <img
                        src="/assets/uploads/IMG_20260310_200424-1.png"
                        alt="AI"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.68 0.22 50), oklch(0.44 0.17 254))",
                      }}
                    >
                      OG
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[85%] md:max-w-[75%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}
                  >
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.url}
                            className="rounded-xl overflow-hidden border border-border"
                          >
                            {att.type === "image" && (
                              <img
                                src={att.url}
                                alt={att.name}
                                className="max-w-[200px] max-h-[150px] object-cover"
                              />
                            )}
                            {att.type === "video" && (
                              <video
                                src={att.url}
                                className="max-w-[200px] max-h-[150px]"
                                controls
                              >
                                <track kind="captions" />
                              </video>
                            )}
                            {att.type === "audio" && (
                              <div
                                className="px-3 py-2 flex items-center gap-2"
                                style={{ background: "oklch(0.20 0.02 265)" }}
                              >
                                <Music
                                  className="w-4 h-4"
                                  style={{ color: "oklch(0.68 0.22 50)" }}
                                />
                                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                                  {att.name}
                                </span>
                                <audio src={att.url} controls className="h-6">
                                  <track kind="captions" />
                                </audio>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Progress card */}
                    {msg.progressCard && (
                      <div
                        className="w-80 rounded-2xl p-4 space-y-3"
                        style={{
                          background: msg.progressCard.isMovie
                            ? "linear-gradient(135deg, oklch(0.18 0.03 300), oklch(0.20 0.02 265))"
                            : "oklch(0.18 0.015 265)",
                          borderRadius: "1rem 1rem 1rem 0.25rem",
                          border: msg.progressCard.isMovie
                            ? "1px solid oklch(0.55 0.22 300 / 30%)"
                            : "1px solid oklch(0.25 0.01 265)",
                        }}
                        data-ocid="chat.loading_state"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center animate-spin"
                            style={{
                              background: msg.progressCard.isMovie
                                ? "linear-gradient(135deg, oklch(0.48 0.22 300), oklch(0.62 0.20 300))"
                                : "linear-gradient(135deg, oklch(0.68 0.22 50), oklch(0.44 0.17 254))",
                            }}
                          >
                            <div className="w-3 h-3 rounded-full bg-background" />
                          </div>
                          <span className="text-sm font-semibold">
                            {msg.progressCard.isMovie
                              ? "🎬 Generating Movie..."
                              : "🔄 Processing your request..."}
                          </span>
                        </div>

                        <Progress
                          value={msg.progressCard.progress}
                          className="h-2"
                          style={{
                            background: "oklch(0.25 0.01 265)",
                          }}
                        />

                        <div className="flex items-center justify-between text-xs">
                          <span
                            className="font-medium"
                            style={{
                              color: msg.progressCard.isMovie
                                ? "oklch(0.75 0.18 300)"
                                : "oklch(0.68 0.22 50)",
                            }}
                          >
                            {
                              msg.progressCard.steps[
                                msg.progressCard.currentStep
                              ]
                            }
                          </span>
                          <span className="text-muted-foreground font-mono">
                            {msg.progressCard.progress}%
                          </span>
                        </div>

                        <div className="space-y-1">
                          {msg.progressCard.steps.map((step, si) => (
                            <div
                              key={step}
                              className="flex items-center gap-2 text-xs"
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{
                                  background:
                                    si < msg.progressCard!.currentStep
                                      ? "oklch(0.62 0.20 150)"
                                      : si === msg.progressCard!.currentStep
                                        ? msg.progressCard!.isMovie
                                          ? "oklch(0.75 0.18 300)"
                                          : "oklch(0.68 0.22 50)"
                                        : "oklch(0.35 0.01 265)",
                                }}
                              />
                              <span
                                style={{
                                  color:
                                    si < msg.progressCard!.currentStep
                                      ? "oklch(0.62 0.20 150)"
                                      : si === msg.progressCard!.currentStep
                                        ? "oklch(0.90 0 0)"
                                        : "oklch(0.45 0 0)",
                                }}
                              >
                                {si < msg.progressCard!.currentStep
                                  ? `✓ ${step}`
                                  : step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Result card */}
                    {msg.resultCard && (
                      <div
                        className="w-full max-w-md rounded-2xl overflow-hidden"
                        style={{
                          background: "oklch(0.18 0.015 265)",
                          borderRadius: "1rem 1rem 1rem 0.25rem",
                          border: "1px solid oklch(0.30 0.04 150 / 60%)",
                        }}
                        data-ocid="chat.success_state"
                      >
                        <div
                          className="flex items-center gap-2 px-4 py-2.5"
                          style={{
                            background:
                              "linear-gradient(135deg, oklch(0.28 0.08 150 / 40%), oklch(0.20 0.04 150 / 30%))",
                            borderBottom:
                              "1px solid oklch(0.30 0.04 150 / 40%)",
                          }}
                        >
                          <span className="text-base">✅</span>
                          <span
                            className="text-sm font-bold"
                            style={{ color: "oklch(0.72 0.18 150)" }}
                          >
                            Generation Complete
                          </span>
                        </div>
                        <div
                          className="px-4 py-3 text-sm leading-relaxed"
                          style={{ color: "oklch(0.97 0 0)" }}
                        >
                          {formatContent(msg.resultCard.text)}
                        </div>
                        <div
                          className="flex items-center gap-2 px-4 py-3"
                          style={{
                            borderTop: "1px solid oklch(0.25 0.01 265)",
                          }}
                        >
                          <Button
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => handleDownload(msg.resultCard!.text)}
                            data-ocid="result.download_button"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Result
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs border-border hover:bg-accent/20"
                            data-ocid="result.secondary_button"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            Share
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs border-border hover:bg-accent/20"
                            onClick={() =>
                              setInputText("Apply another style to my content")
                            }
                            data-ocid="result.edit_button"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            Apply Another Style
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Pictorial scene card */}
                    {msg.pictorialCard && (
                      <div
                        className="w-full max-w-md rounded-2xl overflow-hidden"
                        style={{
                          background: "oklch(0.15 0.02 265)",
                          border: "1px solid oklch(0.30 0.08 280 / 60%)",
                          borderRadius: "1rem 1rem 1rem 0.25rem",
                        }}
                        data-ocid="chat.pictorial_card"
                      >
                        <div
                          className="px-4 py-3 flex items-center gap-2"
                          style={{
                            background: `linear-gradient(135deg, ${msg.pictorialCard.colors[0]}33, ${msg.pictorialCard.colors[1]}22)`,
                            borderBottom:
                              "1px solid oklch(0.30 0.04 280 / 40%)",
                          }}
                        >
                          <span className="text-lg">🎨</span>
                          <div>
                            <div
                              className="text-xs font-bold"
                              style={{ color: msg.pictorialCard.colors[0] }}
                            >
                              {msg.pictorialCard.animeStyle}
                            </div>
                            <div
                              className="text-sm font-semibold"
                              style={{ color: "oklch(0.95 0 0)" }}
                            >
                              {msg.pictorialCard.sceneTitle}
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <svg
                            role="img"
                            aria-label="Anime scene visualization"
                            viewBox="0 0 400 220"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full rounded-xl"
                            style={{ background: "oklch(0.10 0.02 265)" }}
                          >
                            <defs>
                              <radialGradient
                                id={`rg1-${msg.id}`}
                                cx="50%"
                                cy="50%"
                                r="50%"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={msg.pictorialCard.colors[0]}
                                  stopOpacity="0.8"
                                />
                                <stop
                                  offset="100%"
                                  stopColor={msg.pictorialCard.colors[0]}
                                  stopOpacity="0"
                                />
                              </radialGradient>
                              <radialGradient
                                id={`rg2-${msg.id}`}
                                cx="30%"
                                cy="40%"
                                r="40%"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={msg.pictorialCard.colors[1]}
                                  stopOpacity="0.6"
                                />
                                <stop
                                  offset="100%"
                                  stopColor={msg.pictorialCard.colors[1]}
                                  stopOpacity="0"
                                />
                              </radialGradient>
                              <radialGradient
                                id={`rg3-${msg.id}`}
                                cx="70%"
                                cy="60%"
                                r="35%"
                              >
                                <stop
                                  offset="0%"
                                  stopColor={
                                    msg.pictorialCard.colors[2] ||
                                    msg.pictorialCard.colors[0]
                                  }
                                  stopOpacity="0.5"
                                />
                                <stop
                                  offset="100%"
                                  stopColor={
                                    msg.pictorialCard.colors[2] ||
                                    msg.pictorialCard.colors[0]
                                  }
                                  stopOpacity="0"
                                />
                              </radialGradient>
                            </defs>
                            <circle
                              cx="200"
                              cy="110"
                              r="100"
                              fill={`url(#rg1-${msg.id})`}
                            />
                            <circle
                              cx="120"
                              cy="90"
                              r="70"
                              fill={`url(#rg2-${msg.id})`}
                            />
                            <circle
                              cx="280"
                              cy="130"
                              r="60"
                              fill={`url(#rg3-${msg.id})`}
                            />
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                              <line
                                key={i}
                                x1="200"
                                y1="110"
                                x2={200 + 130 * Math.cos((i * Math.PI) / 4)}
                                y2={110 + 100 * Math.sin((i * Math.PI) / 4)}
                                stroke={
                                  msg.pictorialCard!.colors[
                                    i % msg.pictorialCard!.colors.length
                                  ]
                                }
                                strokeWidth="1.5"
                                strokeOpacity="0.5"
                              />
                            ))}
                            <polygon
                              points="200,60 220,100 200,90 180,100"
                              fill={msg.pictorialCard.colors[0]}
                              opacity="0.9"
                            />
                            <polygon
                              points="200,160 215,125 200,135 185,125"
                              fill={msg.pictorialCard.colors[1]}
                              opacity="0.7"
                            />
                            <circle
                              cx="200"
                              cy="110"
                              r="18"
                              fill="none"
                              stroke={msg.pictorialCard.colors[0]}
                              strokeWidth="2.5"
                              opacity="0.9"
                            />
                            <circle
                              cx="200"
                              cy="110"
                              r="35"
                              fill="none"
                              stroke={msg.pictorialCard.colors[1]}
                              strokeWidth="1"
                              strokeDasharray="4 3"
                              opacity="0.6"
                            />
                            <circle
                              cx="200"
                              cy="110"
                              r="55"
                              fill="none"
                              stroke={
                                msg.pictorialCard.colors[2] ||
                                msg.pictorialCard.colors[0]
                              }
                              strokeWidth="0.5"
                              strokeDasharray="2 4"
                              opacity="0.4"
                            />
                            {msg.pictorialCard.elements.map((el, i) => (
                              <text
                                key={el}
                                x={50 + i * 110}
                                y={200}
                                fontSize="8"
                                fill={
                                  msg.pictorialCard!.colors[
                                    i % msg.pictorialCard!.colors.length
                                  ]
                                }
                                opacity="0.7"
                                textAnchor="middle"
                              >
                                {el}
                              </text>
                            ))}
                          </svg>
                        </div>
                        <div
                          className="px-4 pb-2 text-xs leading-relaxed"
                          style={{ color: "oklch(0.75 0 0)" }}
                        >
                          {msg.pictorialCard.sceneDescription}
                        </div>
                        <div
                          className="px-4 pb-3 text-xs italic"
                          style={{ color: "oklch(0.55 0 0)" }}
                        >
                          🎤 &quot;{msg.pictorialCard.transcript}&quot;
                        </div>
                        <div
                          className="flex items-center gap-2 px-4 py-3"
                          style={{
                            borderTop: "1px solid oklch(0.22 0.01 265)",
                          }}
                        >
                          <Button
                            size="sm"
                            className="gap-1.5 text-xs"
                            data-ocid="pictorial.download_button"
                            onClick={() => {
                              const svg = document.querySelector(
                                `[data-ocid="chat.pictorial_card"] svg`,
                              );
                              if (svg) {
                                const blob = new Blob([svg.outerHTML], {
                                  type: "image/svg+xml",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "anime-scene.svg";
                                a.click();
                                URL.revokeObjectURL(url);
                              }
                            }}
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Visual
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 text-xs border-border hover:bg-accent/20"
                            data-ocid="pictorial.apply_button"
                            onClick={() =>
                              setInputText(
                                `Apply ${msg.pictorialCard!.animeStyle} style to my content`,
                              )
                            }
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            Apply Style
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Plain text bubble */}
                    {msg.content &&
                      !msg.progressCard &&
                      !msg.resultCard &&
                      !msg.pictorialCard && (
                        <div
                          className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                          style={{
                            background:
                              msg.role === "user"
                                ? ogMode
                                  ? "linear-gradient(135deg, oklch(0.68 0.22 50), oklch(0.87 0.17 95 / 80%))"
                                  : "linear-gradient(135deg, oklch(0.44 0.17 254), oklch(0.68 0.22 50))"
                                : "oklch(0.18 0.015 265)",
                            color: "oklch(0.97 0 0)",
                            borderRadius:
                              msg.role === "user"
                                ? "1rem 1rem 0.25rem 1rem"
                                : "1rem 1rem 1rem 0.25rem",
                          }}
                        >
                          {formatContent(msg.content)}
                        </div>
                      )}

                    <span className="text-xs text-muted-foreground px-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 message-enter">
                <div
                  className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ boxShadow: "0 0 10px oklch(0.68 0.22 50 / 30%)" }}
                >
                  <img
                    src="/assets/uploads/IMG_20260310_200424-1.png"
                    alt="AI"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
                  style={{
                    background: "oklch(0.18 0.015 265)",
                    borderRadius: "1rem 1rem 1rem 0.25rem",
                  }}
                  data-ocid="chat.loading_state"
                >
                  <div
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: "oklch(0.68 0.22 50)" }}
                  />
                  <div
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: "oklch(0.68 0.22 50)" }}
                  />
                  <div
                    className="typing-dot w-2 h-2 rounded-full"
                    style={{ background: "oklch(0.68 0.22 50)" }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div
          className="flex-shrink-0 border-t border-border px-2 md:px-4 py-2 md:py-3"
          style={{ background: "oklch(0.13 0.005 265)" }}
        >
          <div className="max-w-3xl mx-auto">
            {/* Pending attachments preview */}
            {pendingAttachments.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {pendingAttachments.map((att, i) => (
                  <div
                    key={att.url}
                    className="relative group rounded-xl overflow-hidden border border-border"
                  >
                    {att.type === "image" && (
                      <img
                        src={att.url}
                        alt={att.name}
                        className="w-14 h-14 object-cover"
                      />
                    )}
                    {att.type === "video" && (
                      <div
                        className="w-14 h-14 flex items-center justify-center"
                        style={{ background: "oklch(0.20 0.02 265)" }}
                      >
                        <Film
                          className="w-6 h-6"
                          style={{ color: "oklch(0.68 0.22 50)" }}
                        />
                      </div>
                    )}
                    {att.type === "audio" && (
                      <div
                        className="w-14 h-14 flex items-center justify-center"
                        style={{ background: "oklch(0.20 0.02 265)" }}
                      >
                        <Music
                          className="w-6 h-6"
                          style={{ color: "oklch(0.44 0.17 254)" }}
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input row */}
            <div
              className="flex items-end gap-2 p-2 rounded-2xl border border-border"
              style={{ background: "oklch(0.17 0.01 265)" }}
            >
              {/* Upload buttons */}
              <div className="flex gap-1 pb-0.5">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "image")}
                />
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "audio")}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "video")}
                />

                <button
                  type="button"
                  data-ocid="input.upload_button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  title="Upload photo"
                >
                  <Image className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  type="button"
                  data-ocid="input.audio_upload_button"
                  onClick={() => audioInputRef.current?.click()}
                  className="p-2 rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  title="Upload audio"
                >
                  <Music className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  type="button"
                  data-ocid="input.video_upload_button"
                  onClick={() => videoInputRef.current?.click()}
                  className="p-2 rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  title="Upload video"
                >
                  <Film className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {/* Mic button for speech-to-visual */}
                <button
                  type="button"
                  data-ocid="input.mic_button"
                  onClick={startSpeechToVisual}
                  className={`p-2 rounded-xl transition-colors ${isListening ? "text-red-400 bg-red-500/20 animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-accent/20"}`}
                  title={
                    isListening
                      ? "Listening... (click to stop)"
                      : "Speak to generate anime visual"
                  }
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <Mic className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>

                {/* Movie generate button — only in movie mode */}
                {movieMode && (
                  <button
                    type="button"
                    data-ocid="input.movie_button"
                    onClick={() => setMovieDialogOpen(true)}
                    className="p-2 rounded-xl transition-colors"
                    title="Generate Movie (MOVIE MODE)"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.48 0.22 300 / 20%), oklch(0.62 0.20 300 / 20%))",
                      border: "1px solid oklch(0.55 0.22 300 / 50%)",
                      color: "oklch(0.75 0.18 300)",
                    }}
                  >
                    <Clapperboard className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Text input */}
              <textarea
                data-ocid="chat.textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  movieMode
                    ? "Describe your anime edit or use 🎬 Generate Movie..."
                    : "Describe your anime edit..."
                }
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground py-2 px-1 max-h-32"
                style={{ lineHeight: "1.5" }}
              />

              {/* Send */}
              <button
                type="button"
                data-ocid="chat.submit_button"
                onClick={handleSend}
                disabled={!inputText.trim() && pendingAttachments.length === 0}
                className="p-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                style={{
                  background:
                    inputText.trim() || pendingAttachments.length > 0
                      ? ogMode
                        ? "linear-gradient(135deg, oklch(0.87 0.17 95), oklch(0.68 0.22 50))"
                        : movieMode
                          ? "linear-gradient(135deg, oklch(0.48 0.22 300), oklch(0.62 0.20 300))"
                          : "linear-gradient(135deg, oklch(0.68 0.22 50), oklch(0.44 0.17 254))"
                      : "oklch(0.25 0 0)",
                  color: "white",
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              OG Funky Boys AI · Anime Edit Studio · Upload media or describe
              your vision
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="hidden md:block text-center py-2 text-xs text-muted-foreground"
          style={{ background: "oklch(0.13 0.005 265)" }}
        >
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </main>

      {/* ── Cheat Code Modal ── */}
      <Dialog open={cheatModalOpen} onOpenChange={setCheatModalOpen}>
        <DialogContent
          className="max-w-sm border-border"
          style={{ background: "oklch(0.16 0.015 265)" }}
          data-ocid="cheatcode.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl overflow-hidden"
                  style={{ boxShadow: "0 0 20px oklch(0.68 0.22 50 / 40%)" }}
                >
                  <img
                    src="/assets/uploads/IMG_20260310_200424-1.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="gradient-text font-display text-xl">
                  Enter Cheat Code
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground text-center">
              Enter a secret code to unlock exclusive features
            </p>

            <div className={cheatError ? "shake" : ""}>
              <Input
                ref={cheatInputRef}
                data-ocid="cheatcode.input"
                value={cheatCode}
                onChange={(e) => setCheatCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleCheatSubmit()}
                placeholder="ENTER CODE..."
                className="text-center font-mono font-bold tracking-widest text-lg border-border"
                style={{
                  background: "oklch(0.20 0.02 265)",
                  color: "oklch(0.97 0 0)",
                  borderColor: cheatError ? "oklch(0.62 0.24 27)" : undefined,
                }}
              />
            </div>

            {cheatError && (
              <p
                className="text-xs text-center"
                style={{ color: "oklch(0.62 0.24 27)" }}
                data-ocid="cheatcode.error_state"
              >
                ❌ Invalid cheat code. Try again!
              </p>
            )}

            <div className="flex gap-2">
              <Button
                data-ocid="cheatcode.cancel_button"
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setCheatModalOpen(false);
                  setCheatCode("");
                }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="cheatcode.confirm_button"
                className="flex-1 gap-2 font-bold"
                onClick={handleCheatSubmit}
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.22 50), oklch(0.44 0.17 254))",
                  border: "none",
                }}
              >
                <Star className="w-4 h-4" />
                ACTIVATE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Movie Generator Dialog ── */}
      <Dialog open={movieDialogOpen} onOpenChange={setMovieDialogOpen}>
        <DialogContent
          className="max-w-md border-border"
          style={{
            background: "oklch(0.16 0.015 265)",
            border: "1px solid oklch(0.55 0.22 300 / 40%)",
          }}
          data-ocid="movie.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.48 0.22 300), oklch(0.62 0.20 300))",
                    boxShadow: "0 0 24px oklch(0.55 0.22 300 / 40%)",
                  }}
                >
                  🎬
                </div>
                <span
                  className="font-display text-xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.18 300), oklch(0.85 0.14 320))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Generate Movie
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            <p className="text-sm text-muted-foreground text-center">
              Create a cinematic anime movie — up to 2 hours long
            </p>

            {/* Style picker */}
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="movie-style-select"
              >
                Anime Style
              </label>
              <Select value={movieStyle} onValueChange={setMovieStyle}>
                <SelectTrigger
                  id="movie-style-select"
                  className="border-border"
                  style={{ background: "oklch(0.20 0.02 265)" }}
                  data-ocid="movie.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ background: "oklch(0.18 0.015 265)" }}>
                  {[...ANIME_PRESETS, ...OG_ANIME_PRESETS].map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.emoji} {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="movie-duration"
                  className="text-sm font-medium text-foreground"
                >
                  Duration
                </label>
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: "oklch(0.75 0.18 300)" }}
                >
                  {movieDuration} min
                </span>
              </div>
              <Slider
                id="movie-duration"
                data-ocid="movie.toggle"
                min={1}
                max={120}
                step={1}
                value={[movieDuration]}
                onValueChange={([v]) => setMovieDuration(v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 min</span>
                <span>1 hour</span>
                <span>2 hours</span>
              </div>
            </div>

            {/* Story textarea */}
            <div className="space-y-1.5">
              <label
                htmlFor="movie-story"
                className="text-sm font-medium text-foreground"
              >
                Story / Description
              </label>
              <Textarea
                id="movie-story"
                data-ocid="movie.textarea"
                value={movieStory}
                onChange={(e) => setMovieStory(e.target.value)}
                placeholder="Describe your movie story, characters, scenes..."
                rows={3}
                className="border-border resize-none"
                style={{
                  background: "oklch(0.20 0.02 265)",
                  color: "oklch(0.97 0 0)",
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button
                data-ocid="movie.cancel_button"
                variant="ghost"
                className="flex-1"
                onClick={() => setMovieDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="movie.confirm_button"
                className="flex-1 gap-2 font-bold"
                onClick={handleMovieGenerate}
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.48 0.22 300), oklch(0.62 0.20 300))",
                  border: "none",
                  color: "#fff",
                }}
              >
                <Clapperboard className="w-4 h-4" />
                Generate Movie
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper to extract gradient colors from Tailwind gradient class names
function getGradientColors(gradient: string): string {
  const map: Record<string, string> = {
    "from-orange-600": "oklch(0.60 0.22 50)",
    "to-yellow-500": "oklch(0.80 0.18 85)",
    "from-yellow-500": "oklch(0.80 0.18 85)",
    "to-orange-500": "oklch(0.68 0.22 50)",
    "from-red-600": "oklch(0.55 0.24 27)",
    "to-orange-400": "oklch(0.73 0.20 55)",
    "from-pink-500": "oklch(0.65 0.25 355)",
    "to-red-600": "oklch(0.55 0.24 27)",
    "from-slate-600": "oklch(0.44 0.03 240)",
    "to-zinc-500": "oklch(0.50 0.01 270)",
    "from-green-500": "oklch(0.62 0.20 150)",
    "to-blue-500": "oklch(0.54 0.18 240)",
    "from-purple-600": "oklch(0.48 0.22 300)",
    "to-blue-700": "oklch(0.44 0.17 254)",
    "from-gray-800": "oklch(0.25 0 0)",
    "to-purple-800": "oklch(0.35 0.18 300)",
    "from-yellow-400": "oklch(0.85 0.18 90)",
    "from-amber-400": "oklch(0.84 0.18 80)",
    "to-yellow-300": "oklch(0.90 0.15 95)",
  };
  const parts = gradient.split(" ");
  const from = parts.find((p) => p.startsWith("from-")) ?? "from-orange-600";
  const to = parts.find((p) => p.startsWith("to-")) ?? "to-yellow-500";
  return `${map[from] ?? "oklch(0.60 0.22 50)"}, ${map[to] ?? "oklch(0.80 0.18 85)"}`;
}
