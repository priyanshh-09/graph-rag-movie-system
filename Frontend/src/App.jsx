import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [debug, setDebug] = useState(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);

  const handleAsk = async () => {
    if (!query) return;

    const userMsg = { role: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post("https://graph-rag-movie-system.onrender.com/query", { query });

      setMessages((prev) => [...prev, { role: "bot", text: res.data.answer }]);

      setDebug(res.data.debug);
      setSteps(res.data.steps || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
    setQuery("");
  };

  // const handleUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     await axios.post("https://graph-rag-movie-system.onrender.com/upload", formData);
  //     alert("✅ Movie dataset indexed!");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">GraphRAG Movie Intelligence</h1>
        {/* <p className="text-gray-400 mb-4">
          Upload a movie dataset and ask anything
        </p> */}

        {/* UPLOAD */}
        {/* <input
          type="file"
          onChange={handleUpload}
          className="mb-4 block text-sm text-gray-300"
        /> */}

        {/* Example Queries */}
        <div className="bg-gray-800/60 backdrop-blur-md p-4 rounded-2xl border border-gray-700 shadow-lg mb-4">
          <h2 className="text-lg font-semibold mb-3">Try asking</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div
              onClick={() => setQuery("Movies like Inception")}
              className="bg-gray-700 hover:bg-gray-600 transition p-3 rounded-xl cursor-pointer"
            >
              🎬 Movies like Inception
            </div>

            <div
              onClick={() => setQuery("Movies directed by Christopher Nolan")}
              className="bg-gray-700 hover:bg-gray-600 transition p-3 rounded-xl cursor-pointer"
            >
              🎥 Movies directed by Christopher Nolan
            </div>

            <div
              onClick={() => setQuery("Tell me about Interstellar")}
              className="bg-gray-700 hover:bg-gray-600 transition p-3 rounded-xl cursor-pointer"
            >
              👤 Tell me about Interstellar
            </div>

            <div
              onClick={() =>
                setQuery(
                  "How is Leonardo DiCaprio related to Christopher Nolan?",
                )
              }
              className="bg-gray-700 hover:bg-gray-600 transition p-3 rounded-xl cursor-pointer"
            >
              🔗 How is Leonardo DiCaprio related to Christopher Nolan?
            </div>
          </div>
        </div>

        {/* CHAT BOX */}
        <div className="bg-gray-800/60 backdrop-blur-md p-4 rounded-2xl h-[400px] overflow-y-auto shadow-lg mb-4 border border-gray-700">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs ${
                  msg.role === "user" ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && <p className="text-gray-400 text-sm">Thinking...</p>}
        </div>

        {/* INPUT */}
        <div className="flex gap-2 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none"
            placeholder="Ask about movies..."
          />
          <button
            onClick={handleAsk}
            className="bg-blue-600 px-5 rounded-xl hover:bg-blue-700 transition"
          >
            Ask
          </button>
        </div>

        {/* PIPELINE ACTIVITY */}
        {steps.length > 0 && (
          <div className="bg-gray-800/60 backdrop-blur-md p-4 rounded-2xl border border-gray-700 shadow-md mb-4">
            <h2 className="font-semibold mb-3">⚡ Pipeline Activity</h2>

            <div className="space-y-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="bg-gray-700 px-3 py-2 rounded-lg text-sm text-gray-200"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DEBUG PANEL */}
        {debug && (
          <div className="bg-gray-800/60 backdrop-blur-md p-4 rounded-2xl border border-gray-700 shadow-md">
            <h2 className="font-semibold mb-2">⚙️ System Info</h2>

            <p>
              <span className="text-gray-400">Entities:</span>{" "}
              {debug.entities.length > 0
                ? debug.entities.join(", ")
                : "None found"}
            </p>

            <p>
              <span className="text-gray-400">Query Type:</span> {debug.type}
            </p>

            <p>
              <span className="text-gray-400">DB Used:</span> {debug.db}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
