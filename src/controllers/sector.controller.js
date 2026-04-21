import sectorRepo from "../repositories/sector.repository.js";

export const getSectors = async (req, res, next) => {
    try {
        const sectors = await sectorRepo.findAll();
        return res.status(200).json({ success: true, sectors });
    } catch (err) {
        return next(err);
    }
};

export const createSector = async (req, res, next) => {
    const { name, color } = req.body;
    try {
        const sector = await sectorRepo.create({ name, color });
        return res.status(201).json({ success: true, sector });
    } catch (err) {
        return next(err);
    }
};

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
