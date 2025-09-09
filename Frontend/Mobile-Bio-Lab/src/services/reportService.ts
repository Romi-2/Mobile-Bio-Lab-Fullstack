import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

/**
 * Download user report as PDF
 * @param role optional role filter (Student | Researcher | Technician)
 * @param city optional city filter
 */
export async function downloadUserReport(role?: string, city?: string): Promise<void> {
  try {
    const response = await axios.get(`${API_URL}/report`, {
      params: { role, city },
      responseType: "blob", // ensures backend sends binary data
    });

    // 👇 Cast response.data explicitly as Blob
    const blob = new Blob([response.data as BlobPart], { type: "application/pdf" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove(); // cleanup
  } catch (error) {
    console.error("Error while downloading report:", error);
    throw error;
  }
}
