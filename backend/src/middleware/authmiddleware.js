import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
      const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Not authorized" });
        }
        try{
           const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           req.userId = decoded.userId;
           next();
        }
        catch{
           return res.status(401).json({ message: "Not authorized" });
        }
}

export default protect;