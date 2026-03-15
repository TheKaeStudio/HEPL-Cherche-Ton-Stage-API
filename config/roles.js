import p from "./permissions.js";

export const rolePermissions = {
    student: [p.INTERNSHIP_UPDATE],

    teacher: [
        p.INTERNSHIP_CREATE,
        p.INTERNSHIP_UPDATE,
        p.INTERNSHIP_DELETE,
        p.USER_READ,
    ],

    admin: [
        p.COMPANY_CREATE,
        p.COMPANY_UPDATE,
        p.COMPANY_DELETE,
        p.INTERNSHIP_CREATE,
        p.INTERNSHIP_UPDATE,
        p.INTERNSHIP_DELETE,
        p.USER_READ,
        p.USER_CREATE,
        p.USER_DELETE,
    ],
};
