import Cat from '../models/catModel.js';
export const createCat = async (req, res) => {
    try {
        const { userId, title, descriptionMd, latitude, longitude } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }
        const photoUrl = `/uploads/cats/${req.file.filename}`;
        const newCat = await Cat.create({
            userId,
            title,
            descriptionMd,
            photoUrl,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        });
        return res.status(201).json(newCat);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error saving cat' });
    }
};
