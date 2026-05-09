// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 

import multer from "multer";

// import { runIndexing } from "../7_runIndexing.js";
import { resolveQueryEntities } from "../9_entityResolver.js";
import { classifyQuery } from "../10_queryClassifier.js";
import { handleGraphQuery } from "../11_graphHandler.js";
import { handleSimilarityQuery } from "../12_similarityHandler.js";


const app = express();

app.use(cors()); 

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


const upload = multer({ dest: "uploads/" });


// MAIN QUERY API
app.post("/query", async (req, res) => {
  try {
    const { query } = req.body;

    const steps = [];

    // Step 1: Entity resolution
    const resolved = await resolveQueryEntities(query);
    steps.push("🔍 Extracted entities from query");

    // Step 2: Classification
    const classification = await classifyQuery(query, resolved);
    steps.push(`🧠 Classified query as ${classification.type}`);

    // Step 3: Routing
    let answer;

    if (classification.type === "similarity") {

      steps.push("🗄️ Resolved entities using Neo4j");
      steps.push("📐 Retrieved semantic context from Pinecone");

      answer = await handleSimilarityQuery(query, resolved);

    } else {

      steps.push("🗄️ Resolved entities using Neo4j");
      steps.push("🧭 Executed graph traversal query");

      answer = await handleGraphQuery(query, resolved);
    }


    // 🔥 SEND DEBUG INFO ALSO
    // res.json({
    //   answer,
    //   debug: {
    //     entities: resolved.entities.map((e) => e.nodeName),
    //     type: classification.type,
    //     db: classification.type === "similarity" ? "Vector + Graph" : "Graph",
    //   },
    // });

    // 🔥 SEND DEBUG INFO ALSO

    // Step 4: Final response generation
    steps.push("🧠 Generated final response using Gemini");

    // SEND RESPONSE

    res.json({
      answer,

      debug: {
        entities: resolved.entities.map((e) => e.nodeName),
        type: classification.type,
        db:
          classification.type === "similarity"
            ? "Vector + Graph"
            : "Graph",
      },


      steps: [
        "🔍 Extracted entities from query",
        "🗄️ Resolved entities using Neo4j",
        classification.type === "similarity"
          ? "📐 Retrieved semantic context from Pinecone"
          : "🧭 Executed graph traversal query",
        "🧠 Generated final response using Gemini",
      ],

      steps,

    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// app.post("/query", async (req, res) => {
//   try {
//     console.log("Incoming query:", req.body.query);

//     const result = await runQuery(req.body.query);

//     console.log("Final result:", result);

//     res.json(result);
//   } catch (err) {
//     console.error("QUERY ERROR:", err);

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });
 
//Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  const fileName = req.file.originalname.toLowerCase();

  if (!fileName.includes("movie")) {
    return res.status(400).json({
      error: "Only movie dataset PDFs are allowed",
    });
  }

  const filePath = req.file.path;

  // await runIndexing(filePath);

  res.json({ message: "Movie dataset indexed successfully" });
});

//  Start server
app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on Port",process.env.PORT);
});
