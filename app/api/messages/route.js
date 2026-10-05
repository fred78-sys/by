import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        const body = await request.json();

        const text = typeof body.text === "string"
            ? body.text.trim()
            : "";

        let conversationId = body.conversationId || null;

        if (!text) {
            return Response.json(
                {
                    success: false,
                    error: "Message is empty."
                },
                { status: 400 }
            );
        }

        if (text.length > 5000) {
            return Response.json(
                {
                    success: false,
                    error: "Message is too long."
                },
                { status: 400 }
            );
        }

        // Create a conversation if this is a new chat
        if (!conversationId) {
            const { data: conversation, error: conversationError } =
                await supabase
                    .from("conversations")
                    .insert({})
                    .select("id")
                    .single();

            if (conversationError) {
                console.error(conversationError);

                return Response.json(
                    {
                        success: false,
                        error: "Could not create conversation."
                    },
                    { status: 500 }
                );
            }

            conversationId = conversation.id;
        }

        // Save the user's message
        const { data: message, error: messageError } =
            await supabase
                .from("messages")
                .insert({
                    conversation_id: conversationId,
                    sender: "user",
                    text: text
                })
                .select("id, conversation_id, sender, text, created_at")
                .single();

        if (messageError) {
            console.error(messageError);

            return Response.json(
                {
                    success: false,
                    error: "Could not save message."
                },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            conversationId: conversationId,
            message: message
        });

    } catch (error) {
        console.error("Messages API error:", error);

        return Response.json(
            {
                success: false,
                error: "Server error."
            },
            { status: 500 }
        );
    }
                      }
