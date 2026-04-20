import express from "express";
import {
    createInternship,
    deleteInternship,
    getInternshipById,
    getInternships,
    submitSheet,
    updateInternship,
    updateSheet,
    validateInternship,
} from "../controllers/internship.controller.js";
import { addComment, deleteComment, getComments } from "../controllers/comment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/permission.middleware.js";
import p from "../../config/permissions.js";

const internshipRouter = express.Router();

internshipRouter.get("/", authenticate, getInternships);
internshipRouter.get("/:id", authenticate, getInternshipById);

internshipRouter.post("/create", authenticate, authorize(p.INTERNSHIP_CREATE), createInternship);
internshipRouter.put("/update/:id", authenticate, authorize(p.INTERNSHIP_UPDATE), updateInternship);
internshipRouter.put("/:id/sheet", authenticate, updateSheet);
internshipRouter.post("/:id/submit", authenticate, submitSheet);
internshipRouter.put("/:id/validate", authenticate, authorize(p.INTERNSHIP_VALIDATE), validateInternship);
internshipRouter.delete("/delete/:id", authenticate, authorize(p.INTERNSHIP_DELETE), deleteInternship);

internshipRouter.get("/:id/comments", authenticate, getComments);
internshipRouter.post("/:id/comments", authenticate, authorize(p.COMMENT_CREATE), addComment);
internshipRouter.delete("/:id/comments/:commentId", authenticate, authorize(p.COMMENT_DELETE), deleteComment);

export default internshipRouter;
