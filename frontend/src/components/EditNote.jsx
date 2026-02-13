import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import EmbeddedWhiteboard from "./EmbeddedWhiteboard";

// Define the runCode function globally so the onclick in HTML string can access it
// Note: This is a bit hacky but works for the MVP with `marked` returning strings.
window.runCodeSnippet = (encodedCode) => {
    try {
        const code = decodeURIComponent(encodedCode);
        // Basic console capture
        const oldLog = console.log;
        const logs = [];
        console.log = (...args) => {
             logs.push(args.join(' '));
             oldLog(...args);
        };
        
        // Execute
        // Using new Function is unsafe for production but fine for this prototype
        // Wrapping in async IIFE to support await
        const func = new Function(`return (async () => { ${code} })()`);
        
        func().then((res) => {
            console.log = oldLog;
            const output = logs.length > 0 ? logs.join('\n') : (res !== undefined ? String(res) : "Executed successfully (no output)");
            alert(`OUTPUT:\n${output}`);
        }).catch(err => {
            console.log = oldLog;
            alert(`ERROR: ${err.message}`);
        });
    } catch (err) {
        alert(`ERROR: ${err.message}`);
    }
};

export default function EditNote({ note, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const textAreaRef = useRef(null);
  
  // Helper to handle whiteboard updates
  const handleWhiteboardUpdate = (index, newData) => {
      const parts = content.split(/(\[Whiteboard:.*?\])/s);
      let wbCount = -1;
      
      const newParts = parts.map(part => {
          if (part.startsWith("[Whiteboard:")) {
              wbCount++;
              if (wbCount === index) {
                   const encoded = encodeURIComponent(newData);
                   return `[Whiteboard:${encoded}]`;
              }
          }
          return part;
      });
      
      setContent(newParts.join(''));
  };
  
  // Slash Menu State
  const [showSlash, setShowSlash] = useState(false);
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(Array.isArray(note.tags) ? note.tags.join(", ") : "");
    }
  }, [note]);

  // Configure marked to render code blocks with a Run button
  useEffect(() => {
    const renderer = new marked.Renderer();
    const oldCode = renderer.code.bind(renderer);
    
    renderer.code = (params) => {
        // params handles different signatures in newer marked versions, but usually (code, infostring, escaped)
         // marked v15: ({ text, lang, escaped }) or (code, language) depending on options
         // Let's assume standard (code, language)
         const code = typeof params === 'object' ? params.text : params;
         const lang = (typeof params === 'object' ? params.lang : arguments[1]) || '';
         
         const html = oldCode(params); // Use default Highlighting/Formatting
         
         if (lang === 'js' || lang === 'javascript') {
             // Embed a Run button
             const encoded = encodeURIComponent(code);
             return `<div class="relative group">
                        <button onclick="window.runCodeSnippet('${encoded}')" class="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            ▶ Run
                        </button>
                        ${html}
                     </div>`;
         }
         return html;
    };
    
    marked.setOptions({ renderer });
  }, []);

  const applyFormat = (type) => {
    if (!textAreaRef.current) return;
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || ""; // Default empty if insertion
    let formatted = selected;
    let newCursorPos = start;

    if (type === "bold") { formatted = `**${selected}**`; newCursorPos += 2; }
    if (type === "italic") { formatted = `*${selected}*`; newCursorPos += 1; }
    if (type === "underline") { formatted = `<u>${selected}</u>`; newCursorPos += 3; }
    if (type === "strike") { formatted = `~~${selected}~~`; newCursorPos += 2; }
    if (type === "code") { formatted = `\`${selected}\``; newCursorPos += 1; }
    if (type === "list") { formatted = `\n- ${selected}`; newCursorPos += 3; }
    if (type === "h1") { formatted = `\n# ${selected}`; newCursorPos += 3; }
    if (type === "h2") { formatted = `\n## ${selected}`; newCursorPos += 4; }
    if (type === "h3") { formatted = `\n### ${selected}`; newCursorPos += 5; }
    
    // Slash commands specific
    if (type === "codeblock") { formatted = `\n\`\`\`javascript\n${selected}\n\`\`\`\n`; newCursorPos += 14; }
    if (type === "todo") { formatted = `\n- [ ] ${selected}`; newCursorPos += 7; }
    if (type === "date") { formatted = new Date().toLocaleDateString(); newCursorPos += formatted.length; }
    if (type === "whiteboard") { 
        // Insert empty whiteboard object
        const emptyData = encodeURIComponent(JSON.stringify({})); 
        formatted = `\n[Whiteboard:${emptyData}]\n`; 
        newCursorPos += formatted.length; 
    }

    const next = content.slice(0, start) + formatted + content.slice(end);
    setContent(next);
    setShowSlash(false);
    
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + formatted.length; // Move to end of insertion
      textarea.selectionEnd = start + formatted.length;
    });
  };

  const handleKeyUp = (e) => {
    if (e.key === '/') {
        // Calculate position
        // This is tricky in a textarea. For MVP, just show near cursor or fixed center.
        // Or specific logic:
        const { selectionStart, value } = e.target;
        // Check if it's start of line or preceded by space
        const prevChar = value.charAt(selectionStart - 2); 
        // selectionStart is after the '/', so -1 is the slash, -2 is before.
        
        if (!prevChar || prevChar === '\n' || prevChar === ' ') {
            setShowSlash(true);
            // Simple positioning: Fixed near mouse or center of editor
            // To be precise requires a library or canvas measurement. 
            // We'll use a fixed centered modal for the menu for simplicity.
        }
    } else {
        // If typing content, maybe hide slash menu (or keep extracting query?)
        // For now, close if space or enter
        if (showSlash && (e.key === 'Escape' || e.key === ' ')) {
            setShowSlash(false);
        }
    }
  };

  // Voice Memo State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const toggleRecording = () => {
      if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
          alert("Browser does not support Speech Recognition.");
          return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      
      let finalTranscript = '';
      
      recognition.onresult = (event) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
          }
          // We need a way to insert this. For now, simple append to content or insert at cursor?
          // To keep it simple, we'll append to cursor position, but react state updates might conflict with "continuous".
          // Better strategy: Update a "preview" text or just wait for final?
          // Let's just insert finalized text.
          
          if (finalTranscript) {
             const textarea = textAreaRef.current;
             if (!textarea) return;
             
             const start = textarea.selectionStart;
             const end = textarea.selectionEnd;
             
             // Check if we already inserted this chunk? 
             // Actually, `onresult` gives accumulated results in some modes, or we just track new.
             // With `continuous=true`, `resultIndex` helps.
             
             // Simplest approach: Just stop and start for short commands? No, user wants dictation.
             // Let's insert `finalTranscript` into content and Reset finalTranscript to avoid dups if we handle it here.
             // WARNING: mutating content in loop.
             
             // BETTER: Just alert "Listening..." and append ONLY when stopped?
             // OR: Update a separate "transcription" state and inject on stop?
             // Let's try direct injection of FINAL results only.
             
              const textToInsert = finalTranscript;
              setContent(prev => {
                  // This is tricky because `prev` might have changed.
                  // For a prototype, let's just append to the END or insert at current implicit cursor.
                  return prev + textToInsert;
              });
              finalTranscript = ''; 
          }
      };
      
      recognition.start();
      recognitionRef.current = recognition;
  };

  return (
    <div className="flex flex-col h-full space-y-6 relative">
      <input
        className="text-4xl font-bold border-none outline-none bg-transparent placeholder-gray-300 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        autoFocus
      />

      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 mb-4 sticky top-0 bg-[var(--bg-panel)] z-10 pt-2">
          {!showPreview && (
            <div className="flex gap-1 flex-wrap items-center">
              {['h1', 'h2', 'h3'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyFormat(t)}
                  className="px-2 py-1 text-xs uppercase font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded"
                >
                  {t}
                </button>
              ))}
              <div className="w-px h-4 bg-[var(--border-color)] mx-1 self-center"></div>
              {['bold', 'italic', 'code', 'list'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyFormat(t)}
                  className="px-2 py-1 text-xs uppercase font-semibold text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] rounded"
                >
                  {t}
                </button>
              ))}
             <div className="w-px h-4 bg-[var(--border-color)] mx-1 self-center"></div>
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-2 py-1 text-xs uppercase font-bold rounded flex items-center gap-1 ${isRecording ? 'bg-red-50 text-red-600 animate-pulse' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
              >
                <span>🎙️</span> {isRecording ? "Rec" : "Voice"}
              </button>
            </div>
          )}
          <div className="flex-1"></div>
          <button
            type="button"
            className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 relative">
        {showSlash && !showPreview && (
            <div className="absolute top-10 left-10 z-50 w-64 bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 bg-gray-50 text-xs font-bold text-gray-500 border-b">BASIC BLOCKS</div>
                <button onClick={() => applyFormat('todo')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex gap-2">
                    <span>☐</span> To-do List
                </button>
                <button onClick={() => applyFormat('h1')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex gap-2">
                    <span className="font-bold">H1</span> Heading 1
                </button>
                 <button onClick={() => applyFormat('h2')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex gap-2">
                    <span className="font-bold">H2</span> Heading 2
                </button>
                <div className="p-2 bg-gray-50 text-xs font-bold text-gray-500 border-b border-t">ADVANCED</div>
                <button onClick={() => applyFormat('codeblock')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex gap-2 text-purple-600">
                    <span>⚡</span> Javascript Code
                </button>
                 <button onClick={() => applyFormat('date')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex gap-2">
                    <span>📅</span> Insert Date
                </button>
                 <button onClick={() => applyFormat('whiteboard')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm flex gap-2 text-pink-600">
                    <span>🎨</span> Whiteboard
                </button>
            </div>
        )}

        {showPreview ? (
            <div className="markdown-editor prose prose-slate max-w-none flex-1 overflow-y-auto">
                {(() => {
                    if (!content) return null;
                    const parts = content.split(/(\[Whiteboard:.*?\])/s);
                    let wbIndex = -1;
                    
                    return parts.map((part, i) => {
                        if (part.startsWith("[Whiteboard:")) {
                            wbIndex++;
                            const currentIndex = wbIndex;
                            try {
                                const dataStr = part.substring(12, part.length - 1);
                                const data = decodeURIComponent(dataStr);
                                return (
                                    <div key={i} className="my-8 border rounded-lg shadow-sm">
                                        <EmbeddedWhiteboard 
                                            initialData={data} 
                                            readOnly={false} 
                                            onSave={(newData) => handleWhiteboardUpdate(currentIndex, newData)}
                                        />
                                    </div>
                                );
                            } catch (e) {
                                return <div key={i} className="text-red-500">[Invalid Whiteboard Data]</div>;
                            }
                        } else {
                            return (
                                <div
                                key={i}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(marked.parse(part || "")),
                                }}
                                />
                            );
                        }
                    });
                })()}
            </div>
        ) : (
            <textarea
            ref={textAreaRef}
            className="w-full h-full flex-1 resize-none border-none outline-none bg-transparent text-lg leading-relaxed font-mono text-[var(--text-primary)]"
            value={content}
            onKeyUp={handleKeyUp}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type '/' for commands..."
            />
        )}
      </div>

      <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
         <input
            className="w-full text-sm text-[var(--text-secondary)] bg-transparent outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags..."
        />
        <div className="flex gap-3 justify-end">
            <button onClick={onCancel} className="btn-ghost text-sm">
            Cancel
            </button>
            <button
            onClick={() => {
                const parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
                onSave(note._id, { title, content, tags: parsedTags });
            }}
            className="btn-primary rounded-md text-sm"
            >
            Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}
