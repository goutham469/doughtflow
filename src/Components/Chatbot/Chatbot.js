
import React from 'react';
import { useEffect, useState } from 'react';
import { BodyParser } from '../NewPost/controllers';
import { Search, Loader2, Send, ExternalLink } from 'lucide-react';

function Chatbot() {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState(0); // 0: idle, 1: loading, 2: error
    const [results, setResults] = useState({});
    const [error, setError] = useState('');

    async function search(e) {
        e.preventDefault();
        if (!query || query.trim() === '') return;
        
        setStatus(1);
        setError('');
        
        try {
            let response = await fetch(`${process.env.REACT_APP_CHATBOT_URL}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "question": query })
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data);
            setResults(data);
            setStatus(0);
        } catch (err) {
            console.error("Search error:", err);
            setError(err.message || 'Failed to get response');
            setStatus(2);
        }
    }

    return (
        <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            backgroundColor: "#fff"
        }}>
            <h2 style={{
                color: "#333",
                textAlign: "center",
                marginBottom: "20px",
                borderBottom: "2px solid #f0f0f0",
                paddingBottom: "15px"
            }}>AI Knowledge Assistant</h2>
            
            <form onSubmit={search} style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px"
            }}>
                <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Search style={{
                        position: "absolute",
                        left: "12px",
                        color: "#666",
                        width: "20px",
                        height: "20px"
                    }} />
                    
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask me anything..."
                        style={{
                            width: "100%",
                            padding: "12px 15px 12px 40px",
                            borderRadius: "30px",
                            border: "1px solid #ddd",
                            fontSize: "16px",
                            outline: "none",
                            transition: "border 0.3s ease",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                        }}
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={status === 1 || !query}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "12px 25px",
                        backgroundColor: status === 1 ? "#ccc" : "#4d7cfe",
                        color: "#fff",
                        border: "none",
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: status === 1 ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s ease",
                        alignSelf: "center"
                    }}
                >
                    {status === 1 ? (
                        <>
                            <Loader2 className="animate-spin" style={{ width: "20px", height: "20px" }} />
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <Send style={{ width: "20px", height: "20px" }} />
                            <span>Search</span>
                        </>
                    )}
                </button>
            </form>
            
            {error && (
                <div style={{
                    padding: "15px",
                    backgroundColor: "#ffe0e0",
                    color: "#d32f2f",
                    borderRadius: "5px",
                    marginBottom: "20px",
                    fontSize: "14px"
                }}>
                    {error}
                </div>
            )}
            
            {results && results.answer && (
                <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                    <h3 style={{
                        marginTop: "0",
                        fontSize: "18px",
                        color: "#333",
                        marginBottom: "10px"
                    }}>Answer</h3>
                    <p style={{
                        fontSize: "16px",
                        lineHeight: "1.6",
                        color: "#444"
                    }}>{results.answer}</p>
                </div>
            )}
            
            {results && results.sources && results.sources.length > 0 && (
                <div style={{
                    marginTop: "20px"
                }}>
                    <h3 style={{
                        fontSize: "18px",
                        color: "#333",
                        marginBottom: "15px"
                    }}>Sources</h3>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px"
                    }}>
                        {results.sources.map((source, index) => 
                            source && <PostCard key={index} id={source} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function PostCard({ id }) {
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function getPostData() {
        try {
            setLoading(true);
            let response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/post?id=${id}`);
            
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("single post data in Post Card:", data);
            setPost(data);
        } catch (err) {
            console.error("Error fetching post:", err);
            setError("Could not load this source");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPostData();
    }, [id]);

    if (loading) {
        return (
            <div style={{
                padding: "15px",
                border: "1px solid #eee",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9f9f9",
                height: "100px"
            }}>
                <Loader2 className="animate-spin" style={{ width: "24px", height: "24px", color: "#666" }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: "15px",
                border: "1px solid #fee",
                borderRadius: "8px",
                backgroundColor: "#fff5f5",
                color: "#d32f2f",
                fontSize: "14px"
            }}>
                {error}
            </div>
        );
    }

    return (
        <div 
            onClick={() => window.open(`/ai-post?id=${id}`)}
            style={{
                padding: "15px",
                backgroundColor: "#f8f8f8",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                border: "1px solid #eaeaea",
                overflow: "hidden",
                maxHeight: "200px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                position: "relative",
                hoverTransform: "translateY(-2px)",
                hoverBoxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}
        >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
            }}>
                {post && post.title && (
                    <h4 style={{
                        margin: "0",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#333"
                    }}>
                        {post.title}
                    </h4>
                )}
                <ExternalLink style={{
                    width: "18px",
                    height: "18px",
                    color: "#666",
                    flexShrink: 0
                }} />
            </div>
            
            {post && post.body && (
                <div style={{
                    fontSize: "14px",
                    color: "#555",
                    overflow: "hidden",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    display: "-webkit-box"
                }}>
                    <BodyParser post={post.body} />
                </div>
            )}
            
            <div style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                height: "40px",
                background: "linear-gradient(to bottom, rgba(248,248,248,0) 0%, rgba(248,248,248,1) 100%)"
            }}></div>
        </div>
    );
}

export default Chatbot;