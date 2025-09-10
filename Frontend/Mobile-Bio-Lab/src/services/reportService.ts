import axios from "axios";

export async function downloadUserReport(role: string, city: string): Promise<void> {
  try {
    const res = await axios.get<Blob>("http://localhost:5000/api/admin/report", {
      params: { role, city },
      responseType: "blob",
    });

    // Cast to BlobPart[]
    const url = window.URL.createObjectURL(
      new Blob([res.data as BlobPart], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users_report.pdf");
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("❌ Error downloading report:", err);
    throw err;
  }
}
