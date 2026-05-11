import sectorRepo from "../repositories/sector.repository.js";

/**
 * GET /api/sectors
 * Retourne tous les secteurs, triés par nom.
 */
export const getSectors = async (req, res, next) => {
    try {
        const sectors = await sectorRepo.findAll();
        return res.status(200).json({ success: true, sectors });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/sectors
 * Crée un secteur.
 * @requires SECTOR_CREATE
 * @param {{ body: { name: string, color?: string } }} req
 */
export const createSector = async (req, res, next) => {
    const { name, color } = req.body;
    try {
        const sector = await sectorRepo.create({ name, color });
        return res.status(201).json({ success: true, sector });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /api/sectors/:id
 * Modifie un secteur.
 * @requires SECTOR_UPDATE
 * @param {{ params: { id: string }, body: { name?: string, color?: string } }} req
 */
export const updateSector = async (req, res, next) => {
    const { name, color } = req.body;
    try {
        const sector = await sectorRepo.updateById(req.params.id, { name, color });
        if (!sector) {
            const err = new Error("Secteur introuvable");
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ success: true, sector });
    } catch (err) {
        return next(err);
    }
};

/**
 * DELETE /api/sectors/:id
 * Supprime un secteur.
 * @requires SECTOR_DELETE
 * @param {{ params: { id: string } }} req
 */
export const deleteSector = async (req, res, next) => {
    try {
        const sector = await sectorRepo.deleteById(req.params.id);
        if (!sector) {
            const err = new Error("Secteur introuvable");
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ success: true, message: "Secteur supprimé" });
    } catch (err) {
        return next(err);
    }
};
