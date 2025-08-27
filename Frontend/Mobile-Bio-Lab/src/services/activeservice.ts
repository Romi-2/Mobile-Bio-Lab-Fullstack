// src/services/activeService.ts
export const activateUser = async (userId: number) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    return data; // { success: boolean, message: string }
  } catch (err) {
    console.error("Activation API error:", err);
    return { success: false, message: "Server error" };
  }
};
