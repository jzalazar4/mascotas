import User from "../model/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';

// dotenv carga datos/variables de archivos .env
dotenv.config();

// Registrar usuario
export async function register(req, res) {
    try {
        const { email, password, profile } = req.body;

        // verifica si existe
        const emailExist = new Promise((resolve, reject) => {
            User.findOne({ email })
                .then((data) => (data ? reject({ error: "El email ya se encuentra registrado" }) : resolve()))
                .catch((err) => reject({ emailExistError: err }));
        });

        // Si continua es porque no hay un usuario registrado
        await Promise.allSettled([emailExist]); // espera la promesa

        const hashedPassword = await hashPassword(password); // espera el encriptado
        const user = new User({
            email: email,
            password: hashedPassword,
            profile: profile || '',
        });

        await user.save();
        res.status(201).send({ msg: "Usuario registrado" });
    } catch (err) {

        if (err.emailExistError) {
            return res.status(400).send(err); // error de email registrado
        }
        return res.status(500).send({ error: "No se ha registrado con éxito" });
    }
}


// iniciar sesion
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        User.findOne({ email })
            .then((data) => {
                comparePassword(password, data.password)
                    .then(() => {
                        // crear token
                        const load = { userId: data._id, email: data.email};
                        const expires = { expiresIn: '24h'};
                        const token = jwt.sign(load, process.env.JWT_SECRET_KEY, expires);
                   
                        // si es exitoso el codigo es 200
                        return res.status(200).send({
                            msg: "Inicio de sesión exitoso",
                            email: data.email,
                            token: token,
                        });

                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
            })
            .catch((err) => res.status(500).send({error: "Email no encontrado"}));
       

    } catch (err) {
        return res.status(401).send(err);
    }
}

// generar OTP para enviar por email
export async function generateOTP(req, res){
    try {
        const OTP = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        req.app.locals.OTP = OTP;
        res.status(201).send({OTP: OTP});
    } catch (err){
        res.status(401).send(err);
    }
}
/**
 * otra forma de hacr el otp
 * export async function generateOTP(req, res) {
    try {
        const OTP = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        req.app.locals.OTP = OTP;

        // Llama a sendOtpEmail para enviar el correo al usuario
        await sendOtpEmail('usuario@example.com', OTP);

        res.status(201).send({ OTP: OTP });
    } catch (err) {
        res.status(401).send(err);
    }
}

 */
// verificar OTP
export async function verifyOTP(req, res) {
    try {
        const { otp } = req.query;
        const generatedOTP = req.app.locals.OTP;

        if(parseInt(otp) == parseInt(generatedOTP)) {
            req.app.locals.OTP = null; // resetea el OTP 
            req.app.locals.resetSession = true; 
            return res.status(201).send({ msg: "OTP verificado"});
        } else {
            return res.status(400).send({error: "OTP inváĺido"});
        }
    } catch (err) {
        res.status(401).send(err);
    }
}

// Autenticar token
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
// Si el otp es válido, redirige al usuario a una sesion verificada
export async function newResetSession(req, res) {
    try {
        if (req.app.locals.resetSession) {
            return res.status(201).send({ msg: 'Acceso concedido', flag: req.app.locals.resetSession});

        } else {
            return res.status(440).send({ error: 'Sesión expirada'});
        }

    } catch (err) {
        res.status(401).send(err);
    }
    
}
// Actualizar usuario
export async function updateUser(req, res) {
    try {
        const {userId} = req.user;
        if (userId) {
            const newData = req.body;
            const {email} = newData;

            // verificar si existe el email
            const isEmail = new Promise((resolve, reject) => {
                User.findOne({email, _id: {$ne: userId}})
                    .then((data) => (data ? reject({error: "Email ya registrado"}): resolve ()))
                    .catch((err) => reject({ isEmailError : err }));
            });

            isEmail 
                .then(() => {
                    User.updateOne({ _id: userId}, newData)
                        .then((data) => res.status(201).send({msg: "Usuario actualizado"}))
                        .catch((err) => res.status(500).send({error: "No se ha actualizado el usuario", err}));

                    })
                    .catch((err) => {
                        res.status(500).send(err);
                    });
        } else {
            return res.status(404).send({error: 'Id inválido'});
        }
    } catch (err) {
        return res.status(401).send(err);
    }
    
}

// Resetear contraseña
export async function resetPassword(req, res) {
    if (!req.app.locals.resetSession) return res.status(440).send({error: "Sesión expirada"});
    
    try {
        const { email, password } = req.bod;
        User.findOne({ email })
            .then((data) => {
                hashPassword(password)
                    .then((hashedPassword) => {
                        User.updateOne({ email: data.email} , 
                            { password: hashedPassword}
                        )
                        .then(() => {
                            req.app.locals.resetSession = false;
                            res.status(201).send({ msg: "Contraseña actualizada"});
                        })
                        .catch(() => res.status(500).send({ error: "La contraseña no se ha podido actualizar"}));
                    })
                    .catch((err) => res.status(500).send(err));
            })
            .catch((err) => res.status(404).send({ error: "Usuario no encontrado"}));
    } catch (err) {
        res.status(401).send(err);
    }
}
// Obtener un usuario
export async function getUser(req, res) {
    try {
        const {email} = req.params;
        User.findOne({ email })
            .then((data) => {
                const {password, ...rest} = Object.assign({}, data.toJson());
                return res.status(201).send(rest);
            })
            .catch((err) => res.status(501).send({error: "Usuario no encontrado"}));
    } catch (err) {
        return res.status(401).send(err);
    }
    
}
// comparar contraseñas
async function comparePassword(originalPass, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt
            .compare(originalPass, hashedPassword)
            .then((isCorrect) => (isCorrect ? resolve() : reject({ error: "Las contraseñas no coinciden"})))
            .catch((error) => reject ({error: "La comparación ha fallado"}));
        });
}

// encriptar contraseña
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        if (password) {
            bcrypt
                .hash(password, 10) //caracteres
                .then((hashedPassword) => resolve(hashedPassword))
                .catch((error) => reject({ error: "No se ha podido encriptar la contraseña"}));

        } else {
            reject({ error: "Contraseña inválida"});
        }
    });
}