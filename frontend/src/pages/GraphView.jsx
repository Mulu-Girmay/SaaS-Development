import { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { getNotes } from "../api/notes";
import { useNavigate } from "react-router-dom";

export default function GraphView() {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const navigate = useNavigate();
    const containerRef = useRef();

    useEffect(() => {
        loadGraph();
    }, []);

    const loadGraph = async () => {
        try {
            const res = await getNotes();
            const notes = res.data;

            const nodes = notes.map(n => ({
                id: n._id,
                name: n.title || "Untitled",
                val: 1 + (n.tags?.length || 0) // Bigger nodes for more tags
            }));

            const links = [];
            
            // Link by shared tags
            // O(N^2) naive approach for small N is fine.
            for (let i = 0; i < notes.length; i++) {
                for (let j = i + 1; j < notes.length; j++) {
                    const n1 = notes[i];
                    const n2 = notes[j];
                    
                    // Check intersection of tags
                    const sharedTags = n1.tags?.filter(t => n2.tags?.includes(t));
                    if (sharedTags?.length > 0) {
                        links.push({
                            source: n1._id,
                            target: n2._id,
                            type: 'tag',
                            value: sharedTags.length // Thicker link
                        });
                    }
                    
                    // Check if content mentions title
                    // Very messy for common words, but let's try strict case insensitive match of full title
                    // Ignore short titles < 4 chars to avoid noise
                    if (n1.title.length > 3 && n2.content?.toLowerCase().includes(n1.title.toLowerCase())) {
                        links.push({ source: n2._id, target: n1._id, type: 'mention' });
                    }
                    if (n2.title.length > 3 && n1.content?.toLowerCase().includes(n2.title.toLowerCase())) {
                        links.push({ source: n1._id, target: n2._id, type: 'mention' });
                    }
                }
            }

            setGraphData({ nodes, links });
        } catch (err) {
            console.error("Failed to load graph", err);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-900 text-white flex flex-col hidden-scrollbar">
             <div className="flex-none p-4 bg-slate-800 flex justify-between items-center shadow-lg z-10">
                <h1 className="text-xl font-bold">Knowledge Graph</h1>
                <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded">
                    Back to Dashboard
                </button>
             </div>
             <div className="flex-1 relative overflow-hidden" ref={containerRef}>
                <ForceGraph2D
                    graphData={graphData}
                    nodeLabel="name"
                    nodeColor={node => node.val > 2 ? "#d8b4fe" : "#a78bfa"}
                    linkColor={() => "#475569"}
                    backgroundColor="#0f172a"
                    onNodeClick={node => {
                        navigate(`/dashboard?note=${node.id}`);
                    }}
                    nodeRelSize={6}
                />
             </div>
        </div>
    );
}
