import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const { text } = req.body;

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                success: false,
                error: "Message is empty"
            });
        }

        const { data, error } = await supabase
            .from("messages")
            .insert({
                text: text.trim()
            })
            .select("id, text")
            .single();

        if (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                error: "Could not save message"
            });
        }

        return res.status(200).json({
            success: true,
            id: data.id,
            text: data.text
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}
