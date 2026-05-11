import groupRepo from "../repositories/group.repository.js";

/**
 * GET /api/groups
 * Retourne tous les groupes, triés par nom.
 */
export const getGroups = async (req, res, next) => {
    try {
        const groups = await groupRepo.findAll();
        return res.status(200).json({ success: true, groups });
    } catch (err) {
        return next(err);
    }
};

/**
 * POST /api/groups
 * Crée un groupe.
 * @requires GROUP_CREATE
 * @param {{ body: { name: string, color?: string } }} req
 */
export const createGroup = async (req, res, next) => {
    const { name, color } = req.body;
    try {
        const group = await groupRepo.create({ name, color });
        return res.status(201).json({ success: true, group });
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /api/groups/:id
 * Modifie un groupe.
 * @requires GROUP_UPDATE
 * @param {{ params: { id: string }, body: { name?: string, color?: string } }} req
 */
export const updateGroup = async (req, res, next) => {
    const { name, color } = req.body;
    try {
        const group = await groupRepo.updateById(req.params.id, { name, color });
        if (!group) {
            const err = new Error("Groupe introuvable");
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ success: true, group });
    } catch (err) {
        return next(err);
    }
};

/**
 * DELETE /api/groups/:id
 * Supprime un groupe.
 * @requires GROUP_DELETE
 * @param {{ params: { id: string } }} req
 */
export const deleteGroup = async (req, res, next) => {
    try {
        const group = await groupRepo.deleteById(req.params.id);
        if (!group) {
            const err = new Error("Groupe introuvable");
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({ success: true, message: "Groupe supprimé" });
    } catch (err) {
        return next(err);
    }
};
