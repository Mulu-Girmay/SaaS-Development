import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect, useState, useCallback } from 'react'

export default function EmbeddedWhiteboard({ initialData, onSave, readOnly = false }) {
    // We need to manage the store or data. 
    // Tldraw handles internal state. We need to extract it on change or on save.
    // For this simple version, we'll listen to changes if possible, or provide a manual "Save Drawing" button?
    // Auto-save is better.
    
    // We can use `onMount` to get the app instance and listen.
    const [editor, setEditor] = useState(null)

    const handleMount = (editorInstance) => {
        setEditor(editorInstance)
        
        if (initialData) {
            try {
                // If we have a snapshot, load it. 
                // formatted as { document: ..., session: ... } usually
                editorInstance.loadSnapshot(JSON.parse(initialData))
            } catch (e) {
                console.error("Failed to load whiteboard data", e)
            }
        }

        if (readOnly) {
            editorInstance.updateInstanceState({ isReadonly: true })
        }
    }

    // Debounced save? or Save on unmount?
    // Let's expose a method or save on every change (expensive).
    // Better: Parent provides a "Save" button for the whole note, we just need to make sure
    // we export the data when parent asks, OR we update parent state on change.
    
    // Using `editor.store.listen` 
    useEffect(() => {
        if (!editor || readOnly) return;
        
        const cleanup = editor.store.listen(
            () => {
                // Determine if we should save? 
                // Just snapshot the whole thing.
                const { document, session } = editor.getSnapshot()
                if (onSave) {
                     onSave(JSON.stringify({ document, session }))
                }
            },
            { scope: 'document', source: 'user' }
        )
        
        return () => cleanup()
    }, [editor, onSave, readOnly])

  return (
    <div className="h-96 w-full border border-gray-200 rounded-lg overflow-hidden relative" style={{ minHeight: '400px' }}>
      <Tldraw 
        onMount={handleMount}
        hideUi={readOnly} // Hide UI in read-only mode for cleaner look? Or keep it for zooming?
        // inferDarkMode
      />
      {readOnly && <div className="absolute inset-0 z-10 pointer-events-none bg-transparent"></div>} 
      {/* Overlay to prevent interaction if strict readOnly, but tldraw has isReadonly prop */}
    </div>
  )
}
