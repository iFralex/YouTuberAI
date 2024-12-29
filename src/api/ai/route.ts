import { SchemaType, VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY ?? "", "base64").toString()
);

const vertex_ai = new VertexAI({
    project: "youtuber-ai",
    location: "us-central1",
    googleAuthOptions: {
        credentials: {
            client_email: credential.client_email,
            client_id: credential.client_id,
            private_key: credential.private_key,
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