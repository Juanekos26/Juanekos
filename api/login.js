
export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            message: "Método no permitido."
        });

    }

    try {

        const { usuario, clave } = req.body || {};

        if (!usuario || !clave) {

            return res.status(400).json({
                success: false,
                message: "Completa todos los campos."
            });

        }

        const usuarioCorrecto =
            usuario === process.env.ADMIN_USUARIO;

        const claveCorrecta =
            clave === process.env.ADMIN_CLAVE;

        if (!usuarioCorrecto || !claveCorrecta) {

            return res.status(401).json({
                success: false,
                message: "Usuario o contraseña incorrectos."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Acceso autorizado."
        });

    } catch (error) {

        console.error("Error de login:", error);

        return res.status(500).json({
            success: false,
            message: "Error interno del servidor."
        });

    }
}
