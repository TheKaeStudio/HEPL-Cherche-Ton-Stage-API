const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Erreur serveur";

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        statusCode = 404;
        message = "Ressource introuvable";
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue);
        statusCode = 400;
        message = `Un utilisateur avec ce ${field} existe déjà`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};

export default errorMiddleware;
