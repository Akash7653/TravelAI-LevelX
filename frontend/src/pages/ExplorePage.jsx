import React, { useState, useRef } from "react";
import SearchBar from "../components/SearchBar";
import DestinationGrid from "../components/DestinationGrid";
import LanguageSelector from "../components/LanguageSelector";
import GuideOptions from "../components/GuideOptions";
import VoiceSelector from "../components/VoiceSelector";
import GenerateButton from "../components/GenerateButton";
import LoadingState from "../components/LoadingState";
import ErrorMessage from "../components/ErrorMessage";
import TravelGuideResult from "../components/TravelGuideResult";
import { destinations } from "../data/destinations";
import { PRODUCT_VOICES } from "../data/voices";
import { ENDPOINTS } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Compass, Sparkles, MapPin, Check, Headphones } from "lucide-react";

export default function ExplorePage() {
  const { token, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Selection State
  const [selectedPlace, setSelectedPlace] = useState("Charminar");
  const [selectedImage, setSelectedImage] = useState(
    destinations.find((d) => d.name === "Charminar")?.image || ""
  );
  const [customPlace, setCustomPlace] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [guideType, setGuideType] = useState("Summary");
  const [selectedGender, setSelectedGender] = useState("Female");
  const [selectedVoiceId, setSelectedVoiceId] = useState("en-US-alicia");

  // API Call & Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  const resultRef = useRef(null);

  // Filtered destinations
  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory =
      activeCategory === "All" || dest.category.toLowerCase() === activeCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      dest.name.toLowerCase().includes(query) ||
      dest.city.toLowerCase().includes(query) ||
      dest.country.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleSelectPlace = (placeName, placeImage) => {
    setSelectedPlace(placeName);
    if (placeImage) {
      setSelectedImage(placeImage);
    } else {
      const match = destinations.find((d) => d.name.toLowerCase() === placeName.toLowerCase());
      setSelectedImage(match?.image || "");
    }
  };

  const handleVoiceSelect = (voiceId) => {
    setSelectedVoiceId(voiceId);
  };

  const createAudioUrlFromBase64 = (base64Audio, mimeType = "audio/mpeg") => {
    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: mimeType });
      return URL.createObjectURL(audioBlob);
    } catch (err) {
      console.error("Base64 audio decoding failed:", err);
      throw new Error("Unable to decode generated audio stream.");
    }
  };

  const handleGenerate = async () => {
    setErrorMessage("");
    const destination = customPlace.trim() || selectedPlace.trim();

    if (!destination) {
      setErrorMessage("Please choose or enter a destination first.");
      addToast("Please choose a destination first.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        place: destination,
        answerType: guideType,
        language: selectedLanguage,
        voiceId: selectedVoiceId,
        gender: selectedGender,
        image: selectedImage
      };

      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(ENDPOINTS.GENERATE, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      const json = await response.json().catch(() => null);

      if (!response.ok || !json || !json.success) {
        const msg = json?.error?.message || json?.error || "We couldn't create your travel guide. Please try again.";
        throw new Error(msg);
      }

      const data = json.data || json;
      const audioB64 = data.audio || json.audio;
      const mime = data.audioMimeType || json.audioMimeType || "audio/mpeg";

      let audioUrl = null;
      if (audioB64) {
        audioUrl = createAudioUrlFromBase64(audioB64, mime);
      }

      const generatedResult = {
        guide_id: data.guide_id,
        description: data.description || json.description,
        audioUrl,
        audioMimeType: mime,
        favorite: false
      };

      setResult(generatedResult);
      addToast(`Travel guide for ${destination} generated successfully!`, "success");

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 250);

    } catch (err) {
      console.error("Guide generation error:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
      addToast(err.message || "Guide generation failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const activeDestination = customPlace.trim() || selectedPlace;
  const currentVoiceObj =
    PRODUCT_VOICES[selectedLanguage]?.[selectedGender] || PRODUCT_VOICES.English.Female;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25">
          <Compass className="w-3.5 h-3.5 text-red-500" />
          <span>Interactive Studio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore & Generate Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Search over 25+ landmarks or input any location worldwide to generate an AI audio tour experience.
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onSelectCustom={(custom) => {
          setCustomPlace(custom);
          setSelectedPlace(custom);
        }}
      />

      {/* DESTINATION SELECTION GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Select Landmark ({filteredDestinations.length})
          </h2>
          {activeDestination && (
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> Selected: {activeDestination}
            </span>
          )}
        </div>

        <DestinationGrid
          destinations={filteredDestinations}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          searchQuery={searchQuery}
          customPlace={customPlace}
          onCustomPlaceChange={setCustomPlace}
        />
      </section>

      {/* GENERATOR OPTIONS CONTAINER */}
      <div id="generator" className="space-y-10 scroll-mt-24 pt-4 border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Headphones className="w-3.5 h-3.5" />
            Audio Guide Customizer
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            Customize Voice & Language for {activeDestination}
          </h3>
        </div>

        {/* STEP 2: LANGUAGE SELECTION */}
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />

        {/* STEP 3: GUIDE DEPTH */}
        <GuideOptions
          selectedType={guideType}
          onSelectType={setGuideType}
        />

        {/* STEP 4: AI VOICE */}
        <VoiceSelector
          selectedVoiceId={selectedVoiceId}
          onSelectVoice={handleVoiceSelect}
          selectedLanguage={selectedLanguage}
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
        />
      </div>

      {/* ERROR MESSAGE DISPLAY */}
      <ErrorMessage
        message={errorMessage}
        onRetry={handleGenerate}
        onDismiss={() => setErrorMessage("")}
      />

      {/* LOADING STAGE */}
      {isLoading && (
        <LoadingState
          destination={activeDestination}
          language={selectedLanguage}
          voiceId={currentVoiceObj.name}
        />
      )}

      {/* GENERATE CTA BUTTON */}
      <GenerateButton
        onClick={handleGenerate}
        isLoading={isLoading}
        disabled={isLoading}
      />

      {/* RESULTS SECTION */}
      <div ref={resultRef} className="scroll-mt-24">
        <TravelGuideResult
          result={result}
          destination={activeDestination}
          destinationImage={selectedImage}
          language={selectedLanguage}
          guideType={guideType}
          voiceName={currentVoiceObj.name}
          onRegenerate={handleGenerate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
