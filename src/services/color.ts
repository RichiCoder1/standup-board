const assignedColors: { [key: string]: string } = {};
const availableColors = [
	'maroon', 'teal', 'fuchsia', 'navy', 'darkgreen',
	'red', 'green', 'turquoise', 'purple', 'orange',
];

export function getColor(key: string) {
	if (key in assignedColors) {
		return assignedColors[key];
	}
	
	assignedColors[key] = availableColors.pop()!;
	return assignedColors[key];
}
