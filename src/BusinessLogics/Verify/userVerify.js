export const CheckUserCredential=async (req, res, next)=>{
    const { password, username, email, lastName, firstName,avatar,role,isVerified,isActive } = req.body;
    if (!password || !role || !username || !email || !lastName || !firstName) {
        return res.status(400).send(req.body);
    }
    next()
}