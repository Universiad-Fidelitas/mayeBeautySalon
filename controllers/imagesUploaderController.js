const imagesUploader = async (req, res = response) => {
    try {
        res.status(200).json({
            success: true,
            meta: req.files,
            message: "appointments.successDelete"
        });
    }
    catch(error) {
        res.status(200).json({
            success: false,
            message: "appointments.errorDelete",
            error: error.message
        })
    }
}

module.exports = {
    imagesUploader
}