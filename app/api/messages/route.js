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

        if (!text) {
            return Response.json(
                {
                    success: false,
                    error: "Message is empty."
                },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("messages")
            .insert({ text })
            .select("id, text")
            .single();

        if (error) {
            console.error(error);

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
            id: data.id,
            text: data.text
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                error: "Server error."
            },
            { status: 500 }
        );
    }
}
