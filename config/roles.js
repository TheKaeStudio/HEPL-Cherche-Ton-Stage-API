import p from "./permissions.js";

export const rolePermissions = {
    student: [],

    teacher: [
        p.INTERNSHIP_READ,
        p.USER_READ,
    ],

    manager: [
        p.INTERNSHIP_READ,
        p.INTERNSHIP_CREATE,
        p.INTERNSHIP_UPDATE,
        p.INTERNSHIP_DELETE,
        p.INTERNSHIP_VALIDATE,
        p.COMMENT_CREATE,
        p.USER_READ,
        p.USER_UPDATE,
    ],

    admin: [
        p.COMPANY_CREATE,
        p.COMPANY_UPDATE,
        p.COMPANY_DELETE,
        p.COMPANY_GIVE_ACCESS,
        p.INTERNSHIP_READ,
        p.INTERNSHIP_CREATE,
        p.INTERNSHIP_UPDATE,
        p.INTERNSHIP_DELETE,
        p.INTERNSHIP_VALIDATE,
        p.COMMENT_CREATE,
        p.COMMENT_DELETE,
        p.USER_READ,
        p.USER_CREATE,
        p.USER_UPDATE,
        p.USER_DELETE,
        p.LOG_READ,
    ],
};
