import { Check, X } from "lucide-react";

// Requisitos de contraseña
const PasswordReq = ({ password }) => {
	const req = [
		{ label: "6+ caracteres", met: password.length >= 6 },
		{ label: "1 letra mayúscula", met: /[A-Z]/.test(password) },
		{ label: "1 número", met: /[0-9]/.test(password) },
	];
	return (
		<div style={{ fontSize: "9px", color: "#888", display: "flex", gap: "8px" }}>
			{req.map((item) => (
				<span
					key={item.label}
					style={{
						color: item.met ? "green" : "gray",
					}}
				>
					{item.met ? "✔" : "✘"} {item.label}
				</span>
			))}
		</div>
	);
};


// Fortaleza de contraseña
const PasswordStrength = ({ password }) => {
	const getStrength = (pass) => {
		let strength = 0;
		if (pass.length >= 6) strength++;
		if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
		if (pass.match(/[^a-zA-Z\d]/)) strength++;
		return strength;
	};
	const strength = getStrength(password);

	const getColor = (strength) => {
		if (strength === 0) return "bg-red-500";
		if (strength === 1) return "bg-red-400";
		if (strength === 2) return "bg-yellow-500";
		if (strength === 3) return "bg-green-500";
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return "Muy débil";
		if (strength === 1) return "Débil";
		if (strength === 2) return "Intermedio";
		return "Fuerte";
	};

	return (
		<div className="mt-1">
			<div className="flex justify-between items-center mb-1">
				{/*<span className="text-[5px] text-gray-50">Fortaleza:</span>
				<span className="text-[5px] text-gray-50">{getStrengthText(strength)}</span>*/}
			</div>
			<div className="flex space-x-0.5">
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-300"}
              `}
					/>
				))}
			</div>
			<PasswordReq password={password} />
		</div>
	);
};

export default PasswordStrength;
