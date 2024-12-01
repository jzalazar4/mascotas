import { Check, X } from "lucide-react";

// Crear contraseñas fuertes con ciertos criterios
const PasswordReq = ({ password }) => {
    const req = [
        { label: "Mínimo 6 caracteres", met: password.length >= 6 },
        { label: "Al menos una letra mayúscula", met: /[A-Z]/.test(password) },
        { label: "Al menos una letra minúscula", met: /[a-z]/.test(password) },
        { label: "Al menos un número", met: /[0-9]/.test(password) },
    ];
    return (
        <div className='mt-2 space-y-1'>
			{req.map((item) => (
				<div key={item.label} className='flex items-center text-xs'>
					{item.met ? (
						<Check className='size-4 text-green-500 mr-2' />
					) : (
						<X className='size-4 text-gray-500 mr-2' />
					)}
					<span className={item.met ? "text-green-500" : "text-gray-400"}>{item.label}</span>
				</div>
			))}
		</div>
    );
};
// Barra que muestra qué tan segura va siendo la contraseña
const PasswordStrength = ({ password }) => {
    const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		//if (pass.match(/\d/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};
	const strength = getStrength(password);

	const getColor = (strength) => {
		if (strength === 0) return "bg-red-500";
		if (strength === 1) return "bg-red-400";
		if (strength === 2) return "bg-yellow-500";
		if (strength === 3) return "bg-yellow-400";
		return "bg-green-500";
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return "Muy débil";
		if (strength === 1) return "Débil";
		if (strength === 2) return "Intermedio";
		if (strength === 3) return "Buena";
		return "Fuerte";
	};

	return (
		<div className='mt-2'>
			<div className='flex justify-between items-center mb-1'>
				<span className='text-xs text-gray-400'>Password strength</span>
				<span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
			</div>

			<div className='flex space-x-1'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
              `}
					/>
				))}
			</div>
			<PasswordReq password={password} />
		</div>
	);
};
export default PasswordStrength;