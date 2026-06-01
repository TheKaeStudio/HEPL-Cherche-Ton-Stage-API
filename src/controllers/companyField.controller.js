import companyFieldRepo from "../repositories/companyField.repository.js";

const DEFAULT_FIELDS = [
    { label: "Stage d'observation", order: 0 },
    { label: "Stage BAC3",          order: 1 },
];

/**
 * GET /api/company-fields
 * Retourne tous les champs personnalisés. Seed les valeurs par défaut si aucun n'existe.
 */
export const getFields = async (req, res, next) => {
    try {
        let fields = await companyFieldRepo.findAll();
        if (fields.length === 0) {
            fields = await Promise.all(DEFAULT_FIELDS.map((f) => companyFieldRepo.create(f)));
        }
        return res.status(200).json({ success: true, fields });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/company-fields
 * @requires COMPANY_CREATE
 */
export const createField = async (req, res, next) => {
    try {
        const { label, order = 0 } = req.body;
        const field = await companyFieldRepo.create({ label, order });
        return res.status(201).json({ success: true, field });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /api/company-fields/:id
 * @requires COMPANY_CREATE
 */
export const updateField = async (req, res, next) => {
    try {
        const { label, order } = req.body;
        const updates = {};
        if (label !== undefined) updates.label = label;
        if (order !== undefined) updates.order = order;
        const field = await companyFieldRepo.updateById(req.params.id, updates);
        if (!field) return res.status(404).json({ success: false, error: "Champ introuvable" });
        return res.status(200).json({ success: true, field });
    } catch (err) {
        return next(err);
    }
};

/**
 * DELETE /api/company-fields/:id
 * @requires COMPANY_CREATE
 */
export const deleteField = async (req, res, next) => {
    try {
        const field = await companyFieldRepo.deleteById(req.params.id);
        if (!field) return res.status(404).json({ success: false, error: "Champ introuvable" });
        return res.status(200).json({ success: true });
    } catch (err) {
        return next(err);
    }
};
