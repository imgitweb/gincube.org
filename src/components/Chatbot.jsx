import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  MessageSquare, X, Send, Bot, User, Mic, MicOff, 
  Volume2, VolumeX, Loader2, Phone, Keyboard, Activity,
  Sparkles, Radio, AlertCircle
} from 'lucide-react';
import API_URL from "./Config"; 

// Required assets
import chatbotLogo from "../assets/chatbotlogo.png";
import chatbotGif from "../assets/chatbot.gif";

/* ═════════════════════════════════════════════════════════════════
   G.INCUBE KNOWLEDGE BASE (Used when live backend is offline/fallback)
═════════════════════════════════════════════════════════════════ */
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ["who", "what is", "about", "gincube", "g.incube", "incubator"],
    reply: "G.Incube is Gwalior's premier government-backed incubation center, established under Gwalior Smart City Development Corporation Limited (GSCDCL). We empower innovators, startups, and entrepreneurs with world-class co-working infrastructure, mentorship, funding assistance, and market access."
  },
  {
    keywords: ["apply", "registration", "join", "eligibility", "how to apply", "startup"],
    reply: "Applying to G.Incube is easy! Innovators, student entrepreneurs, and early-stage startups can apply directly through our website by clicking the 'Join Gincube' or 'Startup Registration' link. Our screening committee reviews applications based on innovation, feasibility, and impact."
  },
  {
    keywords: ["mentor", "mentorship", "guidance"],
    reply: "We connect incubated startups with seasoned industry veterans, academic leaders, and bureaucratic mentors. You can also register as a mentor through our Mentor Registration portal to guide rising startups."
  },
  {
    keywords: ["funding", "grant", "investor", "seed", "money", "capital"],
    reply: "G.Incube facilitates seed funding, government grant linkages, and connects promising startups with angel investors, venture capital networks, and government startup schemes like MP Startup Policy and Startup India."
  },
  {
    keywords: ["service", "facility", "facilities", "co-working", "office", "lab"],
    reply: "Our facilities include high-speed smart co-working spaces, private meeting suites, prototyping and testing labs, legal and IP support, cloud credits, and event networking spaces located at the heart of Gwalior."
  },
  {
    keywords: ["contact", "where", "location", "address", "phone", "email"],
    reply: "G.Incube is located at the Gwalior Smart City Development Corporation Limited premises in Gwalior, Madhya Pradesh. You can reach out through our Contact page or email us at support@gincube.org."
  },
  {
    keywords: ["collector", "commissioner", "ceo", "leadership", "head"],
    reply: "G.Incube operates under the visionary guidance of Smt. Ruchika Chauhan, IAS (District Collector & Magistrate), Abhishek Choudhary, IAS (Executive Director, GSCDCL), and T. Prateek Rao, IAS (CEO, GSCDCL)."
  },
  {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "genie", "who are you"],
    reply: "Hey! I’m Genie, Here to Help Your Startup Grow! How can I assist your startup journey at G.Incube today?"
  }
];

const findFallbackReply = (text) => {
  const lower = text.toLowerCase();
  for (const item of KNOWLEDGE_RESPONSES) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.reply;
    }
  }
  return `Thank you for your question about "${text}". G.Incube is dedicated to fostering innovation and supporting early-stage ventures in Gwalior. You can explore our mentorship, incubation programs, and funding opportunities on this portal, or reach out to our administration team for customized assistance.`;
};

/* ═════════════════════════════════════════════════════════════════
   MAIN REAL-TIME CHATBOT COMPONENT
═════════════════════════════════════════════════════════════════ */
const Chatbot = () => {
  // UI & View State
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat'); // 'chat' or 'voice'
  
  // Real-Time States: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error'
  const [botState, setBotState] = useState('idle');
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Sound & Speech synthesis state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voices, setVoices] = useState([]);
  
  // Conversation History
  const [messages, setMessages] = useState([
    { text: "Hey! I’m Genie, 👋 Here to Help Your Startup Grow! How can I assist you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [liveAudioLevel, setLiveAudioLevel] = useState(0);

  // References for live streams, audio nodes & interruption
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const rafIdRef = useRef(null);
  const abortControllerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Speech Queue for Progressive Streaming Audio Playback
  const ttsQueueRef = useRef([]);
  const isPlayingQueueRef = useRef(false);
  const currentUtteranceRef = useRef(null);

  // Live state tracking refs (for async closures)
  const isSpeakingRef = useRef(false);
  const botStateRef = useRef('idle');
  const isThinkingRef = useRef(false);
  const modeRef = useRef('chat');
  const conversationHistoryRef = useRef([]);

  // Sync refs with state
  useEffect(() => {
    botStateRef.current = botState;
    isSpeakingRef.current = botState === 'speaking';
    isThinkingRef.current = isThinking;
  }, [botState, isThinking]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimTranscript, botState, isThinking]);

  // Load available speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          setVoices(available);
        }
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════════
     BARGE-IN / INTERRUPTION ENGINE
     Immediately halts bot voice and in-flight AI processing
  ═══════════════════════════════════════════════════════════════ */
  const interruptBot = useCallback(() => {
    // 1. Abort ongoing network request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 2. Halt current SpeechSynthesis immediately
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtteranceRef.current = null;

    // 3. Purge audio sentence queue
    ttsQueueRef.current = [];
    isPlayingQueueRef.current = false;

    // 4. Reset bot state if it was speaking or thinking
    if (botStateRef.current === 'speaking' || botStateRef.current === 'thinking') {
      isSpeakingRef.current = false;
      setBotState('listening');
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════════
     STREAMING TTS AUDIO QUEUE
     Plays incoming sentence chunks immediately without waiting for full response
  ═══════════════════════════════════════════════════════════════ */
  const playNextInQueue = useCallback(() => {
    if (!soundEnabled || !('speechSynthesis' in window)) {
      isPlayingQueueRef.current = false;
      setBotState('idle');
      return;
    }

    if (ttsQueueRef.current.length === 0) {
      isPlayingQueueRef.current = false;
      // When done speaking, smoothly transition to listening if in voice mode, else idle
      if (modeRef.current === 'voice') {
        setBotState('listening');
        startContinuousListening();
      } else {
        setBotState('idle');
      }
      return;
    }

    isPlayingQueueRef.current = true;
    setBotState('speaking');

    const nextChunk = ttsQueueRef.current.shift();
    if (!nextChunk || !nextChunk.trim()) {
      playNextInQueue();
      return;
    }

    const cleanText = nextChunk.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) {
      playNextInQueue();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtteranceRef.current = utterance;

    if (voices.length > 0) {
      const preferred = voices.find(v => 
        (v.lang.includes("en-IN") || v.lang.includes("hi-IN") || v.name.includes("Natural") || v.name.includes("Google"))
      ) || voices[0];
      utterance.voice = preferred;
    }

    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setBotState('speaking');
    };

    utterance.onend = () => {
      currentUtteranceRef.current = null;
      // Play next chunk in queue immediately
      playNextInQueue();
    };

    utterance.onerror = (e) => {
      console.warn("TTS chunk playback interrupted/ended:", e);
      currentUtteranceRef.current = null;
      playNextInQueue();
    };

    window.speechSynthesis.speak(utterance);
  }, [soundEnabled, voices]);

  const queueSentenceForTTS = useCallback((sentence) => {
    if (!sentence || !sentence.trim() || !soundEnabled) return;
    ttsQueueRef.current.push(sentence);
    if (!isPlayingQueueRef.current) {
      playNextInQueue();
    }
  }, [soundEnabled, playNextInQueue]);

  /* ═══════════════════════════════════════════════════════════════
     VOICE ACTIVITY DETECTION (VAD) & MICROPHONE STREAMING
  ═══════════════════════════════════════════════════════════════ */
  const initAudioAnalyser = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (!micStreamRef.current) {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        });
      }

      const source = audioContextRef.current.createMediaStreamSource(micStreamRef.current);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Real-time audio loop for Barge-in detection
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudioActivity = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setLiveAudioLevel(Math.min(100, Math.round((average / 128) * 100)));

        // VAD Trigger: If volume indicates user is speaking
        if (average > 18) {
          // If bot is speaking while user speaks -> IMMEDIATE BARGE-IN!
          if (botStateRef.current === 'speaking' || isSpeakingRef.current) {
            interruptBot();
          }
        }

        rafIdRef.current = requestAnimationFrame(checkAudioActivity);
      };

      checkAudioActivity();
    } catch (err) {
      console.warn("AudioContext/Microphone permission notice:", err);
    }
  }, [interruptBot]);

  const stopAudioAnalyser = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setLiveAudioLevel(0);
  }, []);

  /* ═══════════════════════════════════════════════════════════════
     SPEECH RECOGNITION (Web Speech API with continuous VAD)
  ═══════════════════════════════════════════════════════════════ */
  const startContinuousListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      if (botStateRef.current !== 'speaking' && !isThinkingRef.current) {
        setBotState('listening');
      }
    };

    recognition.onresult = (event) => {
      // User speech detected -> Instant barge in if bot was speaking
      if (botStateRef.current === 'speaking' || isSpeakingRef.current) {
        interruptBot();
      }

      let interim = '';
      let finalSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim || finalSpeech);

      const detectedText = (finalSpeech || interim).trim();

      // Reset VAD silence timer
      clearTimeout(silenceTimerRef.current);

      if (detectedText.length > 1) {
        // If user pauses for 1.3 seconds, trigger message processing
        silenceTimerRef.current = setTimeout(() => {
          setInterimTranscript('');
          handleSendQuery(detectedText);
        }, 1300);
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        console.warn("Speech recognition notice:", event.error);
      }
    };

    recognition.onend = () => {
      // If voice mode is still active and bot is not actively speaking or thinking, restart recognition
      if (modeRef.current === 'voice' && botStateRef.current !== 'speaking' && !isThinkingRef.current) {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      initAudioAnalyser();
    } catch (e) {
      console.warn("Recognition start error:", e);
    }
  }, [interruptBot, initAudioAnalyser]);

  const stopContinuousListening = useCallback(() => {
    clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    stopAudioAnalyser();
    setInterimTranscript('');
    if (botStateRef.current === 'listening') {
      setBotState('idle');
    }
  }, [stopAudioAnalyser]);

  /* ═══════════════════════════════════════════════════════════════
     REAL-TIME STREAMING RESPONSE HANDLER
     Streams text progressively & streams audio immediately
  ═══════════════════════════════════════════════════════════════ */
  const handleSendQuery = async (queryText = null) => {
    const textToSend = (typeof queryText === 'string' ? queryText : inputValue).trim();
    if (!textToSend || isThinkingRef.current) return;

    // Interrupt any previous bot response before starting new one
    interruptBot();

    // 1. Append user message immediately
    setMessages(prev => [...prev, { text: textToSend, sender: 'user' }]);
    if (!queryText) setInputValue('');
    setInterimTranscript('');

    // Update conversation context memory
    conversationHistoryRef.current.push({ role: 'user', content: textToSend });

    // 2. Set thinking & loading states
    setIsThinking(true);
    setBotState('thinking');
    setErrorMessage('');

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    let fullAnswer = '';

    try {
      const incubationId = import.meta.env.VITE_INCUBATION_ID || "6ab39542497aa33526fcd95b";

      // Attempt 1: Live Backend Chat API with timeout race
      const livePromise = axios.post(`${API_URL}/bot/chat`, {
        question: textToSend,
        incubationId: incubationId,
        history: conversationHistoryRef.current.slice(-6)
      }, { signal });

      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(null), 3000);
      });

      const response = await Promise.race([livePromise, timeoutPromise]);

      if (response && response.data && response.data.success && response.data.data) {
        fullAnswer = response.data.data;
      } else {
        // Fallback to intelligent local knowledge engine
        fullAnswer = findFallbackReply(textToSend);
      }

      if (signal.aborted || !fullAnswer) return;

      // 3. Render Assistant Response (Added BEFORE isThinking becomes false)
      setMessages(prev => [...prev, { text: fullAnswer, sender: 'bot' }]);
      conversationHistoryRef.current.push({ role: 'assistant', content: fullAnswer });

      // 4. Queue sentences for streaming TTS voice playback if sound enabled
      const sentenceDelimiters = /(?<=[.?!])\s+/;
      const sentences = fullAnswer.split(sentenceDelimiters).filter(s => s.trim().length > 0);
      sentences.forEach(sentence => {
        queueSentenceForTTS(sentence);
      });

    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        // Interrupted by user barge-in
        return;
      }
      console.warn("Backend chat notice, using knowledge engine:", err.message);
      const fallbackAnswer = findFallbackReply(textToSend);
      setMessages(prev => [...prev, { text: fallbackAnswer, sender: 'bot' }]);
      conversationHistoryRef.current.push({ role: 'assistant', content: fallbackAnswer });
      queueSentenceForTTS(fallbackAnswer);
    } finally {
      // 5. GUARANTEE: isThinking is ALWAYS reset to false in finally block
      setIsThinking(false);
      // If voice playback is not running, transition botState to idle
      if (!isPlayingQueueRef.current) {
        setBotState(modeRef.current === 'voice' ? 'listening' : 'idle');
      }
    }
  };

  /* ═══════════════════════════════════════════════════════════════
     MODE TOGGLE & LIFECYCLE
  ═══════════════════════════════════════════════════════════════ */
  const toggleVoiceMode = () => {
    if (mode === 'chat') {
      setMode('voice');
      setSoundEnabled(true);
      interruptBot();
      startContinuousListening();
    } else {
      setMode('chat');
      stopContinuousListening();
      interruptBot();
    }
  };

  // Cleanup on unmount or modal close
  const handleClose = () => {
    interruptBot();
    stopContinuousListening();
    setIsOpen(false);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          FLOATING ACTION BUTTON
      ═══════════════════════════════════════════════════════ */}
      <div className={`fixed bottom-6 right-6 z-[99999] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <div className="absolute inset-0 bg-[#15436B] rounded-full blur-[16px] opacity-35" />
        <button
          onClick={() => {
            setIsOpen(true);
            if (mode === 'voice') {
              startContinuousListening();
            }
          }}
          aria-label="Open AI Assistant"
          className="relative bg-white text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(21,67,107,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-white/30 cursor-pointer overflow-hidden p-0"
        >
          <img 
            src={chatbotLogo} 
            alt="AI Assistant" 
            className="w-full h-full object-cover rounded-full" 
          />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#EA9F24] border-2 border-white rounded-full z-10" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MAIN CHAT & REAL-TIME VOICE WINDOW
      ═══════════════════════════════════════════════════════ */}
      <div 
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[99999] w-[92vw] sm:w-[410px] bg-white rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.25)] border border-slate-200 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right font-['Inter',sans-serif] ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' : 'scale-50 opacity-0 pointer-events-none translate-y-10'
        }`}
        style={{ height: '620px', maxHeight: '88vh' }}
      >
        {/* Header */}
        <div className="bg-[#0A2236] p-4 sm:p-5 flex justify-between items-center relative overflow-hidden shrink-0 border-b-[4px] border-[#EA9F24]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#287BBE]/20 rounded-full blur-[25px]" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#EA9F24]/10 rounded-full blur-[25px]" />
          
          <div className="flex items-center gap-3 relative z-10">
            {/* Dynamic Status Avatar */}
            <div className="relative">
              {botState === 'speaking' && (
                <div className="absolute inset-0 bg-[#EA9F24] rounded-full blur-[10px] animate-pulse scale-150 opacity-60" />
              )}
              {botState === 'listening' && (
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-[8px] animate-ping scale-125 opacity-40" />
              )}
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center border-2 border-white/30 shadow-inner relative z-10 overflow-hidden p-0">
                <img 
                  src={botState === 'speaking' ? chatbotGif : chatbotLogo} 
                  alt="Assistant Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0A2236] rounded-full z-20 ${
                botState === 'speaking' 
                  ? 'bg-[#EA9F24] animate-pulse' 
                  : isThinking
                    ? 'bg-amber-400 animate-spin'
                    : botState === 'listening' 
                      ? 'bg-blue-400 animate-ping' 
                      : 'bg-green-500'
              }`} />
            </div>
            
            <div>
              <h3 className="text-white font-extrabold text-[1.05rem] leading-tight tracking-wide flex items-center gap-1.5">
                <span>Genie</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#EA9F24]/20 text-[#EA9F24] border border-[#EA9F24]/30">AI</span>
              </h3>
              <p className="text-[0.75rem] font-semibold flex items-center gap-1 mt-0.5 text-slate-300">
                {botState === 'speaking' && <span className="text-[#EA9F24] animate-pulse">● Speaking...</span>}
                {botState === 'listening' && <span className="text-blue-300 animate-pulse">● Listening...</span>}
                {isThinking && <span className="text-amber-300 animate-pulse">● Thinking...</span>}
                {!isThinking && botState !== 'speaking' && botState !== 'listening' && (
                  <span className="text-emerald-400">● Here to Help Your Startup Grow!</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 relative z-10">
            {/* Mode Switcher (Voice Call vs Chat) */}
            {speechSupported && (
              <button 
                onClick={toggleVoiceMode}
                className={`p-2 rounded-full transition-all cursor-pointer ${
                  mode === 'voice' 
                    ? 'bg-[#EA9F24] text-white shadow-md' 
                    : 'text-slate-300 bg-white/10 hover:bg-white/20'
                }`}
                title={mode === 'voice' ? "Switch to Text Chat" : "Switch to Voice Call"}
              >
                {mode === 'voice' ? <Keyboard className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              </button>
            )}

            {/* Sound Toggle */}
            <button 
              onClick={() => {
                setSoundEnabled(prev => !prev);
                if (soundEnabled) {
                  interruptBot();
                }
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' 
                  : 'text-slate-400 bg-white/5 hover:bg-white/10'
              }`}
              title={soundEnabled ? "Mute Voice" : "Unmute Voice"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button 
              onClick={handleClose}
              className="text-slate-300 hover:text-white bg-white/5 hover:bg-[#EA9F24] p-2 rounded-full transition-colors ml-1 cursor-pointer"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            MODE 1: IMMERSIVE REAL-TIME VOICE CALL UI
        ═══════════════════════════════════════════════════════ */}
        {mode === 'voice' ? (
          <div className="flex-grow flex flex-col items-center justify-between bg-gradient-to-b from-[#0A2236] via-[#0E2A44] to-[#0A2236] p-6 relative overflow-hidden select-none">
            
            {/* Interactive Pulse Rings */}
            {(botState === 'listening' || botState === 'speaking') && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className={`absolute rounded-full border transition-all duration-300 ${
                    botState === 'speaking' 
                      ? 'border-[#EA9F24]/30 animate-[ping_2s_linear_infinite]' 
                      : 'border-blue-400/30 animate-[ping_3s_linear_infinite]'
                  }`}
                  style={{ width: `${180 + liveAudioLevel * 1.5}px`, height: `${180 + liveAudioLevel * 1.5}px` }}
                />
                <div 
                  className={`absolute rounded-full border transition-all duration-500 ${
                    botState === 'speaking' 
                      ? 'border-[#EA9F24]/15' 
                      : 'border-blue-400/15'
                  }`}
                  style={{ width: `${260 + liveAudioLevel * 2}px`, height: `${260 + liveAudioLevel * 2}px` }}
                />
              </div>
            )}

            {/* Real-time State & Equalizer Header */}
            <div className="w-full flex flex-col items-center pt-1 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90 shadow-sm">
                {botState === 'speaking' && (
                  <>
                    <Radio className="w-3.5 h-3.5 text-[#EA9F24] animate-pulse" />
                    <span>AI Speaking • Tap or speak to interrupt</span>
                  </>
                )}
                {botState === 'listening' && (
                  <>
                    <Mic className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span>Listening... speak naturally</span>
                  </>
                )}
                {isThinking && (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Thinking...</span>
                  </>
                )}
                {!isThinking && botState === 'idle' && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#EA9F24]" />
                    <span>Tap to talk</span>
                  </>
                )}
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="h-6 flex items-end gap-1 mt-3">
                {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      botState === 'speaking'
                        ? 'bg-[#EA9F24]'
                        : botState === 'listening'
                          ? 'bg-blue-400'
                          : 'bg-white/20'
                    }`}
                    style={{
                      height: botState === 'speaking' 
                        ? `${Math.max(6, Math.sin(Date.now() / 200 + i) * 20 + 12)}px`
                        : botState === 'listening'
                          ? `${Math.max(4, (liveAudioLevel / 100) * 24 * (h / 100))}px`
                          : '4px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── BOT AVATAR (chatbotlogo.png normal vs chatboat.gif speaking) ── */}
            <div 
              onClick={() => {
                if (botState === 'speaking') {
                  interruptBot();
                } else if (botState === 'idle') {
                  startContinuousListening();
                }
              }}
              className={`relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-500 ${
                botState === 'speaking' ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              {/* Radial Backdrop Glow */}
              <div 
                className={`absolute -inset-4 rounded-full blur-[35px] transition-colors duration-500 pointer-events-none ${
                  botState === 'speaking' 
                    ? 'bg-[#EA9F24]/60' 
                    : botState === 'listening' 
                      ? 'bg-blue-500/50' 
                      : 'bg-[#15436B]/50'
                }`} 
              />

              {/* Fully Covered Circular Avatar Container */}
              <div className="relative w-full h-full rounded-full border-4 border-white/40 shadow-2xl bg-white overflow-hidden p-0">
                <img 
                  src={botState === 'speaking' ? chatbotGif : chatbotLogo}
                  alt="G.Incube AI Assistant"
                  className="w-full h-full object-cover rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Real-time Subtitle & Transcript */}
            <div className="w-full text-center min-h-[90px] flex flex-col justify-end pb-2 z-10 px-2">
              {isThinking ? (
                <div className="flex items-center justify-center gap-2 text-white/80 font-medium text-base animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#EA9F24]" />
                  <span>Thinking & preparing response...</span>
                </div>
              ) : interimTranscript ? (
                <p className="text-white text-lg font-semibold leading-snug drop-shadow">
                  "{interimTranscript}"
                </p>
              ) : botState === 'speaking' ? (
                <p className="text-white/90 text-sm font-medium leading-relaxed max-h-16 overflow-y-auto px-2 scrollbar-none italic">
                  "{messages[messages.length - 1]?.text || "Speaking..."}"
                </p>
              ) : (
                <div className="text-white/80 text-sm">
                  {botState === 'listening' ? (
                    <p className="animate-pulse text-blue-200">Listening to your voice... Speak anytime.</p>
                  ) : (
                    <div>
                      <p className="text-white font-extrabold text-base mb-1 drop-shadow">Hey! I’m Genie,</p>
                      <p className="text-slate-300 text-xs">Here to Help Your Startup Grow! Tap the mic or speak to start.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls: Mic Button & Interrupt */}
            <div className="flex items-center gap-4 mb-2 z-10">
              <button
                onClick={() => {
                  if (botState === 'speaking') {
                    interruptBot();
                  } else if (botState === 'listening') {
                    stopContinuousListening();
                  } else {
                    startContinuousListening();
                  }
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-[0_8px_30px_rgba(0,0,0,0.4)] cursor-pointer ${
                  botState === 'speaking'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : botState === 'listening'
                      ? 'bg-[#EA9F24] hover:bg-[#D68A1B] text-white shadow-[#EA9F24]/40 animate-pulse'
                      : 'bg-[#15436B] hover:bg-[#1C5A8F] text-white border border-white/20'
                }`}
                title={
                  botState === 'speaking' 
                    ? "Click to interrupt bot" 
                    : botState === 'listening' 
                      ? "Stop listening" 
                      : "Start speaking"
                }
              >
                {botState === 'speaking' ? (
                  <X className="w-7 h-7" />
                ) : botState === 'listening' ? (
                  <Mic className="w-7 h-7" />
                ) : (
                  <MicOff className="w-7 h-7 opacity-75" />
                )}
              </button>
            </div>
            
            <p className="text-[11px] text-white/40 tracking-wider uppercase font-semibold z-10">
              {botState === 'speaking' ? "Tap to interrupt" : "Real-Time Streaming Voice"}
            </p>
          </div>
        ) : (
          
          /* ═══════════════════════════════════════════════════════
              MODE 2: TEXT CHAT MODE WITH REAL-TIME STREAMING
          ═══════════════════════════════════════════════════════ */
          <>
            <div className="flex-grow p-4 sm:p-5 overflow-y-auto bg-[#F8FAFC] flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                  <div className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Sender Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto shadow-xs ${
                      msg.sender === 'user' 
                        ? 'bg-[#15436B] text-white' 
                        : 'bg-white text-[#EA9F24] border border-slate-200 overflow-hidden'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <img 
                          src={botState === 'speaking' && index === messages.length - 1 ? chatbotGif : chatbotLogo} 
                          alt="AI Bot" 
                          className="w-full h-full object-cover rounded-full" 
                        />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div 
                      className={`p-3.5 text-[0.92rem] leading-relaxed shadow-xs font-normal ${
                        msg.sender === 'user' 
                          ? 'bg-[#15436B] text-white rounded-[20px] rounded-br-[4px]' 
                          : msg.isError 
                            ? 'bg-rose-50 border border-rose-200 text-rose-700 rounded-[20px] rounded-bl-[4px]'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-[20px] rounded-bl-[4px]'
                      }`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                      {msg.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-[#EA9F24] animate-pulse align-middle" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="flex gap-2.5 max-w-[85%] flex-row items-center">
                    <div className="w-8 h-8 rounded-full bg-white text-[#EA9F24] border border-slate-200 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                      <img src={chatbotLogo} alt="AI" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-[20px] rounded-bl-[4px] flex gap-1.5 items-center shadow-xs">
                      <span className="w-2 h-2 bg-[#EA9F24] rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-[#EA9F24] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-[#EA9F24] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isThinking}
                  placeholder={isThinking ? "Genie is thinking..." : "Ask Genie anything to help your startup grow..."} 
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-[50px] text-[0.92rem] text-slate-800 placeholder:text-slate-400 font-normal focus:outline-none focus:border-[#EA9F24] focus:ring-2 focus:ring-[#EA9F24]/20 transition-all disabled:opacity-50"
                />

                {/* Switch to Voice Button */}
                <button
                  type="button"
                  onClick={toggleVoiceMode}
                  disabled={isThinking}
                  className="w-11 h-11 bg-slate-100 hover:bg-[#15436B] hover:text-white disabled:opacity-50 text-slate-600 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  title="Switch to Real-Time Voice Mode"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                {/* Send Button */}
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isThinking}
                  className="w-11 h-11 bg-[#EA9F24] hover:bg-[#D68A1B] disabled:bg-[#F3C57B] disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md cursor-pointer"
                  title="Send Message"
                >
                  {isThinking ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 ml-0.5" />
                  )}
                </button>
              </form>

              <div className="text-center mt-2.5">
                <p className="text-[0.72rem] text-slate-400 font-medium">
                  Genie AI Assistant • <span className="text-[#15436B] font-bold">Here to Help Your Startup Grow!</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUpMessage {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUpMessage 0.25s ease-out forwards;
        }
      `}} />
    </>
  );
};

export default Chatbot;