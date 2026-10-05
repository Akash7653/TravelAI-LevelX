export const PRODUCT_VOICES = {
  English: {
    Male: { id: "en-US-miles", name: "Matthew", gender: "Male", description: "Deep, articulate storytelling", avatar: "🎙️" },
    Female: { id: "en-US-alicia", name: "Alicia", gender: "Female", description: "Warm, engaging guide delivery", avatar: "👩‍💼" }
  },
  Hindi: {
    Male: { id: "hi-IN-kabir", name: "Aman", gender: "Male", description: "Poetic, expressive Hindi tone", avatar: "🧑‍🏫" },
    Female: { id: "hi-IN-shweta", name: "Namrita", gender: "Female", description: "Clear, melodious Hindi narration", avatar: "👩" }
  },
  Tamil: {
    Male: { id: "ta-IN-sarvesh", name: "Murali", gender: "Male", description: "Classic, scholarly Tamil cadence", avatar: "👨‍🏫" },
    Female: { id: "ta-IN-iniya", name: "Iniya", gender: "Female", description: "Gentle, lyrical heritage narrator", avatar: "👩‍💼" }
  },
  Telugu: {
    Male: { id: "en-US-zion", name: "Zion", gender: "Male", description: "Crisp, dynamic storytelling style", avatar: "👨" },
    Female: { id: "en-US-josie", name: "Josie", gender: "Female", description: "Captivating, friendly pacing", avatar: "👩‍🦰" }
  }
};

export const defaultVoices = [
  // English
  {
    voiceId: "en-US-alicia",
    displayName: "Alicia",
    gender: "Female",
    locale: "en-US",
    displayLanguage: "English",
    accent: "US / International",
    description: "Warm, engaging guide delivery — perfect for cultural storytelling.",
    avatar: "👩‍💼"
  },
  {
    voiceId: "en-US-miles",
    displayName: "Matthew",
    gender: "Male",
    locale: "en-US",
    displayLanguage: "English",
    accent: "US / International",
    description: "Deep, articulate storytelling tone with cinematic presence.",
    avatar: "🎙️"
  },

  // Hindi
  {
    voiceId: "hi-IN-shweta",
    displayName: "Namrita",
    gender: "Female",
    locale: "hi-IN",
    displayLanguage: "Hindi",
    accent: "Indian",
    description: "Clear, melodious Hindi narration for monuments and heritage.",
    avatar: "👩"
  },
  {
    voiceId: "hi-IN-kabir",
    displayName: "Aman",
    gender: "Male",
    locale: "hi-IN",
    displayLanguage: "Hindi",
    accent: "Indian",
    description: "Poetic, expressive Hindi guide bringing ancient lore alive.",
    avatar: "🧑‍🏫"
  },

  // Tamil
  {
    voiceId: "ta-IN-iniya",
    displayName: "Iniya",
    gender: "Female",
    locale: "ta-IN",
    displayLanguage: "Tamil",
    accent: "Tamil Nadu",
    description: "Gentle, lyrical heritage narrator with classic depth.",
    avatar: "👩‍💼"
  },
  {
    voiceId: "ta-IN-sarvesh",
    displayName: "Murali",
    gender: "Male",
    locale: "ta-IN",
    displayLanguage: "Tamil",
    accent: "Tamil Nadu",
    description: "Distinguished, scholarly Tamil guide with authentic phrasing.",
    avatar: "👨‍🏫"
  },

  // Telugu
  {
    voiceId: "en-US-josie",
    displayName: "Josie",
    gender: "Female",
    locale: "te-IN",
    displayLanguage: "Telugu",
    accent: "Andhra / Telangana",
    description: "Captivating, warm pacing with clear modern Telugu articulation.",
    avatar: "👩‍🦰"
  },
  {
    voiceId: "en-US-zion",
    displayName: "Zion",
    gender: "Male",
    locale: "te-IN",
    displayLanguage: "Telugu",
    accent: "Andhra / Telangana",
    description: "Crisp, dynamic storytelling style for immersive excursions.",
    avatar: "👨"
  }
];
