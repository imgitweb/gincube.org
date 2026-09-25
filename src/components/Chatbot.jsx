import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  MessageSquare, X, Send, Bot, User, Mic, MicOff, 
  Volume2, VolumeX, Loader2, Phone, Keyboard, Activity 
} from 'lucide-react';
import API_URL from "./Config"; 
import chatbot from "../assets/chatbot.png";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat'); 
  
  const modeRef = useRef(mode);
  const transcriptRef = useRef('');
  const silenceTimerRef = useRef(null); 
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const [messages, setMessages] = useState([
    { text: "Hi there! 👋 Welcome to G.Incube. I am your AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voices, setVoices] = useState([]); 

  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, interimTranscript]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; 
      recognitionRef.current.interimResults = true; 
      recognitionRef.current.lang = 'en-IN'; 

      recognitionRef.current.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentFinal += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentFinal) {
          setFinalTranscript(prev => prev + ' ' + currentFinal);
        }
        setInterimTranscript(currentInterim);

        const fullText = (finalTranscript + ' ' + currentFinal + ' ' + currentInterim).trim();
        transcriptRef.current = fullText;

        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          const textToEvaluate = transcriptRef.current;
          if (textToEvaluate.length > 0) {
            handleSendMessage(textToEvaluate);
            setFinalTranscript('');
            setInterimTranscript('');
            transcriptRef.current = '';
          }
        }, 4000); 
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening && modeRef.current === 'voice' && !isSpeaking && !isTyping) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error("Restart error", e);
          }
        } else {
          setIsListening(false);
        }
      };
    } else {
      setSpeechSupported(false);
    }

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      clearTimeout(silenceTimerRef.current);
      window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isListening, finalTranscript, isSpeaking, isTyping]);

  const speakText = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voices.length > 0) {
      const naturalVoice = voices.find(v => 
        v.name.includes("Google") || v.name.includes("Natural") || v.lang.includes("en-IN")
      ) || voices[0];
      utterance.voice = naturalVoice;
    }

    utterance.rate = 1.0; 
    utterance.pitch = 1.0; 

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (modeRef.current === 'voice') {
        startListening();
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceMode = () => {
    if (mode === 'chat') {
      setMode('voice');
      setSoundEnabled(true);
      startListening();
    } else {
      setMode('chat');
      stopListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    try {
      recognitionRef.current?.start();
    } catch (e) {}
  };

  const stopListening = () => {
    setIsListening(false);
    clearTimeout(silenceTimerRef.current);
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
  };

  const handleSendMessage = async (customText = null, e = null) => {
    if (e) e.preventDefault();
    
    const textToSend = typeof customText === 'string' ? customText : inputValue;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { text: textToSend, sender: 'user' }]);
    if (!customText) setInputValue('');
    
    setIsTyping(true);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    
    stopListening();

    try {
      const incubationId = "6ab39542497aa33526fcd95b";
      
      const response = await axios.post(`${API_URL}/bot/chat`, { 
        question: textToSend,
        incubationId: incubationId
      });

      if (response.data && response.data.success) {
        const botReply = response.data.data;
        setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
        speakText(botReply);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Chatbot API Error:", error);
      const errorMsg = "I'm having a little trouble connecting right now. Please try again in a moment.";
      setMessages((prev) => [...prev, { text: errorMsg, sender: 'bot', isError: true }]);
      speakText(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* ================= FLOATING ACTION BUTTON ================= */}
      <div className={`fixed bottom-6 right-6 z-[99999] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="absolute inset-0 bg-[#15436B] rounded-full blur-[20px] opacity-40 animate-pulse"></div>
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-tr from-[#15436B] to-[#287BBE] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(21,67,107,0.5)] transition-all duration-300 hover:scale-110 group border-2 border-white/20"
        >
          <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-bounce"></span>
        </button>
      </div>

      {/* ================= MAIN CHAT WINDOW ================= */}
      <div 
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[99999] w-[92vw] sm:w-[400px] bg-white rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-[#eee] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right font-['Poppins',sans-serif] ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' : 'scale-50 opacity-0 pointer-events-none translate-y-10'
        }`}
        style={{ height: '600px', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="bg-[#0A2236] p-5 flex justify-between items-center relative overflow-hidden shrink-0 border-b-[4px] border-[#EA9F24]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#287BBE]/20 rounded-full blur-[25px]"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#EA9F24]/10 rounded-full blur-[25px]"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              {isSpeaking && (
                <div className="absolute inset-0 bg-[#EA9F24] rounded-full blur-[10px] animate-pulse scale-150 opacity-50"></div>
              )}
              <div className={`w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner relative z-10 transition-transform ${isSpeaking ? 'scale-105' : ''}`}>
                <Bot className={`w-7 h-7 ${isSpeaking ? 'text-white' : 'text-[#EA9F24]'}`} />
              </div>
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-[#0A2236] rounded-full z-20 ${isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-green-500'}`}></span>
            </div>
            
            <div>
              <h3 className="text-white font-extrabold text-[1.15rem] leading-tight tracking-wide">G.Incube AI Bot</h3>
              <p className={`text-[0.8rem] font-medium flex items-center gap-1 mt-0.5 ${isSpeaking ? 'text-green-400' : 'text-[#aaa]'}`}>
                {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Online'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 relative z-10">
            {speechSupported && (
              <button 
                onClick={toggleVoiceMode}
                className={`p-2 rounded-full transition-colors ${mode === 'voice' ? 'bg-[#EA9F24] text-white' : 'text-slate-300 bg-white/5 hover:bg-white/10'}`}
                title={mode === 'voice' ? "Switch to Text Chat" : "Switch to Voice Call"}
              >
                {mode === 'voice' ? <Keyboard className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              </button>
            )}
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if(soundEnabled) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
              }}
              className={`p-2 rounded-full transition-colors ${soundEnabled ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' : 'text-slate-400 bg-white/5 hover:bg-white/10'}`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                stopListening();
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }}
              className="text-slate-300 hover:text-white bg-white/5 hover:bg-[#EA9F24] p-2 rounded-full transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= VOICE MODE (Immersive Calling UI) ================= */}
        {mode === 'voice' ? (
          <div className="flex-grow flex flex-col items-center justify-between bg-gradient-to-b from-[#0A2236] to-[#0D1F2D] p-6 relative overflow-hidden">
            
            {(isListening || isSpeaking) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`absolute w-64 h-64 rounded-full border-2 border-[#EA9F24]/20 animate-[ping_2.5s_linear_infinite] ${isSpeaking ? 'border-green-500/30' : ''}`}></div>
                <div className={`absolute w-96 h-96 rounded-full border border-[#EA9F24]/10 animate-[ping_3.5s_linear_infinite] ${isSpeaking ? 'border-green-500/20' : ''}`}></div>
              </div>
            )}

            <div className="w-full flex justify-center pt-2 h-8">
              {isSpeaking ? (
                <div className="flex gap-1 items-end h-6">
                  <div className="w-1.5 bg-green-400 rounded-full animate-[bounce_1s_infinite] h-full"></div>
                  <div className="w-1.5 bg-green-400 rounded-full animate-[bounce_1s_infinite_0.2s] h-3/4"></div>
                  <div className="w-1.5 bg-green-400 rounded-full animate-[bounce_1s_infinite_0.4s] h-1/2"></div>
                  <div className="w-1.5 bg-green-400 rounded-full animate-[bounce_1s_infinite_0.6s] h-3/4"></div>
                </div>
              ) : isTyping ? (
                <Loader2 className="w-6 h-6 text-[#EA9F24] animate-spin" />
              ) : isListening ? (
                <Activity className="w-6 h-6 text-[#EA9F24] animate-pulse" />
              ) : null}
            </div>

            <div className={`relative z-10 w-44 h-44 transition-transform duration-500 ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
              <div className={`absolute inset-0 rounded-full blur-[30px] opacity-40 ${isSpeaking ? 'bg-green-500' : 'bg-[#EA9F24]'}`}></div>
              
              <img 
                src={chatbot} 
                alt="AI Chatbot Agent" 
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl bg-white/5 rounded-full border-2 border-white/10" 
                onError={(e) => { e.target.style.display = 'none'; }} 
              /> 
              
            </div>

            <div className="w-full text-center min-h-[100px] flex flex-col justify-end pb-4 z-10">
              {isTyping ? (
                <p className="text-white/80 font-medium animate-pulse text-lg">Getting response...</p>
              ) : (finalTranscript || interimTranscript) ? (
                <p className="text-white text-xl font-semibold leading-snug">
                  <span className="opacity-100">{finalTranscript}</span>
                  <span className="opacity-60 ml-1 italic">{interimTranscript}</span>
                </p>
              ) : (
                <p className="text-white/40 text-sm tracking-wide">
                  {isListening ? "Listening... start speaking" : "Microphone is off"}
                </p>
              )}
            </div>

            <div className="mb-4 z-10">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                  isListening 
                    ? 'bg-[#EA9F24] hover:bg-[#D68A1B] text-white animate-pulse' 
                    : 'bg-[#15436B] hover:bg-[#1C5A8F] text-white/70 border border-[#287BBE]/30'
                }`}
              >
                {isListening ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
              </button>
            </div>
          </div>
        ) : (
          
          /* ================= TEXT CHAT MODE ================= */
          <>
            <div className="flex-grow p-5 overflow-y-auto bg-[#f8f9fa] flex flex-col gap-5 scrollbar-thin scrollbar-thumb-[#ccc] scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-auto shadow-sm ${msg.sender === 'user' ? 'bg-[#15436B] text-white' : 'bg-white text-[#EA9F24] border border-[#eee]'}`}>
                      {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    
                    <div 
                      className={`p-3.5 text-[0.95rem] leading-relaxed shadow-sm font-medium ${
                        msg.sender === 'user' 
                          ? 'bg-[#15436B] text-white rounded-[20px] rounded-br-[4px]' 
                          : msg.isError 
                            ? 'bg-rose-50 border border-rose-200 text-rose-600 rounded-[20px] rounded-bl-[4px]'
                            : 'bg-white border border-[#eee] text-[#475569] rounded-[20px] rounded-bl-[4px]'
                      }`}
                      dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="flex gap-3 max-w-[85%] flex-row">
                    <div className="w-9 h-9 rounded-full bg-white text-[#EA9F24] border border-[#eee] flex items-center justify-center shrink-0 mt-auto shadow-sm">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-white border border-[#eee] px-4 py-4 rounded-[20px] rounded-bl-[4px] flex gap-1.5 items-center shadow-sm">
                      <span className="w-2.5 h-2.5 bg-[#EA9F24] rounded-full animate-bounce"></span>
                      <span className="w-2.5 h-2.5 bg-[#EA9F24] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2.5 h-2.5 bg-[#EA9F24] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-[#eee] shrink-0">
              <form onSubmit={(e) => handleSendMessage(null, e)} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  placeholder={isTyping ? "AI is thinking..." : "Type your message..."} 
                  className="flex-grow px-5 py-3.5 bg-[#f8f9fa] border border-[#eee] rounded-[50px] text-[0.95rem] text-[#0D1F2D] font-medium focus:outline-none focus:border-[#EA9F24] focus:ring-2 focus:ring-[#EA9F24]/20 transition-all disabled:opacity-50"
                />
                
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-12 h-12 bg-[#EA9F24] hover:bg-[#D68A1B] disabled:bg-[#F3C57B] disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md"
                >
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </button>
              </form>
              <div className="text-center mt-3">
                <p className="text-[0.75rem] text-[#aaa] font-medium">
                  Powered by <span className="text-[#EA9F24] font-bold">G.Incube AI</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUpMessage {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUpMessage 0.3s ease-out forwards;
        }
      `}} />
    </>
  );
};

export default Chatbot;