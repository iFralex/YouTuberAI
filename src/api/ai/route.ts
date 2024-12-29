import { SchemaType, VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY ?? "", "base64").toString()
);

const vertex_ai = new VertexAI({
    project: process.env.VERTEX_PROJECT_NAME,
    location: process.env.VERTEX_LOCATION,
    googleAuthOptions: {
        credentials: {
            client_email: process.env.VERTEX_AUTH_EMAIL,
            client_id: process.env.VERTEX_AUTH_CLIENT_ID,
            private_key: process.env.VERTEX_AUTH_PRIVATE_KEY
        },
    },
});
const model = "gemini-1.5-pro-preview-0409";

async function generateContent(promptInput: string, systemPrompt: string, cache: { name?, contents?: [{ text, description }] }) {
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model, cachedContent: !cache.name && cache.contents && {
            contents: [{ role: "model", parts: cache.contents }]
        }, systemInstruction: systemPrompt
    });

    const result = await generativeModel.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `your prompt here: ${promptInput}`,
                    },
                ],
            },
        ],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING, },
                    script: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    keywords: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.STRING,
                            description: ""
                        }
                    },
                },
                required: ["title", "script", "description", "keywords"]
            },
        }, cachedContent: cache.name
    });

    return { cache: cache.name || generativeModel.getCachedContent().name, result: JSON.parse(result.response.candidates?.[0]?.content.parts[0]?.text) }
}

export async function POST(req: Request) {
    const data = await req.json();
    // ... sanitize promptInput ...
    const text = await generateContent(data.promptInput, data.systemPrompt, data.cache);
    // ... sanitize output ...

    return NextResponse.json({ text });
}