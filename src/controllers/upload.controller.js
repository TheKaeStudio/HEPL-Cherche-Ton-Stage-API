/**
 * POST /api/upload/image
 * Reçoit un fichier image (multipart/form-data, champ "file"), le sauvegarde sur disque et retourne son URL publique.
 * @returns {{ url: string }}
 */
export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: "Aucun fichier reçu" });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5500}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;

    return res.status(201).json({ success: true, url });
};
