import { generateHtml } from "../api/exportHtmlService";

export async function renderHtml(craftNodes: any) {
    try {
        const response = await generateHtml(craftNodes);
        return response;
    } catch (err) {
        throw err;
    }
}
