import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { imageBase64, fileName } = req.body;

            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

            let extension = 'png';
            if (imageBase64.startsWith('data:image/jpeg')) extension = 'jpeg';
            else if (imageBase64.startsWith('data:image/jpg')) extension = 'jpg';
            else if (imageBase64.startsWith('data:image/gif')) extension = 'gif';
            else if (imageBase64.startsWith('data:image/webp')) extension = 'webp';

            // Clean up filename
            const cleanFileName = fileName ? fileName.replace(/[^a-zA-Z0-9]/g, "_") : "upload";
            const name = `${Date.now()}_${cleanFileName}.${extension}`;

            const filePath = path.join(uploadsDir, name);

            fs.writeFileSync(filePath, base64Data, 'base64');

            return res.status(200).json({ url: `/uploads/${name}` });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to upload image' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
