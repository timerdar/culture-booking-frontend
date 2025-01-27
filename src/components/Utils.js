class Utils{
    static formatDate(input_date){
        const date = new Date(input_date);

        const formattedDate = date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        });

        const formattedTime = date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        });

        return `${formattedTime} ${formattedDate}`
    }

    static rgbStringToHex(rgb) {
        // Парсим строку формата 'rgb(r, g, b)'
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) {
            throw new Error('Invalid RGB format');
        }
    
        // Извлекаем компоненты R, G, B
        const [, r, g, b] = match.map(Number);
    
        // Преобразуем RGB в HEX
        const toHex = (component) => component.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
}

export default Utils;