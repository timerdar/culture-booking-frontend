const generateSeat = (row, index, color, reserved) => {
    return {
        type: "seat",
        row: row,
        index: index,
        color: color,
        reserved: reserved,
        seatId: null
    };
};

const generateAisle = () => {
    return {
        type: "aisle"
    };
};

const gen1 = (row, color, defaultReservationStatus) => {
    const generatedRowOfSeats = []; 
    for (let i = 1; i < 31; i++) {
        if (i === 7 || i === 24) {
            generatedRowOfSeats.push(generateAisle());
        } else {
            let key;
            if (i < 7){
                key = i;
            }else if (i > 24){
                key = i - 2;
            }else {
                key = i - 1;
            }
            generatedRowOfSeats.push(generateSeat(row, key, color, defaultReservationStatus));
        };
    };
    return generatedRowOfSeats;
};

const gen2 = (row, color, defaultReservationStatus) => {
    const generatedRowOfSeats = [];
    for (let i = 1; i < 31; i++) {
        if (i < 7 || i > 24) {
            let key;
            if (i < 7){
                key = i;
            }else{
                key = i - 18;
            }
            generatedRowOfSeats.push(generateSeat(row, key, color, defaultReservationStatus));
        } else {
            generatedRowOfSeats.push(generateAisle());
        };
    };
    return generatedRowOfSeats;
};

const gen3 = (row, color, defaultReservationStatus) => {
    const generatedRowOfSeats = [];
    for (let i = 1; i < 31; i++) {
        if (i === 7 || i === 8 || i === 22 || i === 23 | i === 24) {
            generatedRowOfSeats.push(generateAisle());
        } else {
            let key;
            if (i < 7){
                key = i;
            }else if(i > 24){
                key = i - 5;
            }else{
                key = i - 2;
            }
            generatedRowOfSeats.push(generateSeat(row, key, color, defaultReservationStatus));
        };
    };
    return generatedRowOfSeats;
};

const gen4 = (row, color, defaultReservationStatus) => {
    const generatedRowOfSeats = [];
    for (let i = 1; i < 31; i++) {
        if (i === 7 || i === 8 || i === 23 | i === 24) {
            generatedRowOfSeats.push(generateAisle());
        } else {
            let key;
            if (i < 7){
                key = i;
            }else if(i > 24){
                key = i - 4;
            }else{
                key = i - 2;
            }
            generatedRowOfSeats.push(generateSeat(row, key, color, defaultReservationStatus));
        };
    };
    return generatedRowOfSeats;
};

const gen5 = (row, color, defaultReservationStatus) => {
    const generatedRowOfSeats = [];
    for (let i = 1; i < 31; i++) {
        if ( (i < 5) || (i > 9 && i < 23) || i > 26) {
            let key;
            if (i < 5){
                key = i;
            }else if(i > 26){
                key = i - 8;
            }else{
                key = i - 5;
            }
            generatedRowOfSeats.push(generateSeat(row, key, color, defaultReservationStatus));
        } else {
            generatedRowOfSeats.push(generateAisle());
        };
    };
    return generatedRowOfSeats;
};

const gen6 = (row, color, defaultReservationStatus) => {
    const generatedRowOfSeats = [];
    for (let i = 1; i < 31; i++) {
        if ( (i < 6) || (i > 7 && i < 24) || i > 24) {
            let key;
            if (i < 6){
                key = i;
            }else if(i > 26){
                key = i - 3;
            }else{
                key = i - 2;
            }
            generatedRowOfSeats.push(generateSeat(row, key, color, defaultReservationStatus));
        } else {
            generatedRowOfSeats.push(generateAisle());
        };
    };
    return generatedRowOfSeats;
};

const genEmpty = () => {
    const empty = [];
    for (let i = 1; i < 31; i ++) {
        empty.push(generateAisle());
    };
    return empty;
}

//mode = режим select или assign
const generateSeats = (mode) => {

    var initSeats = [];

    const defaultReservationStatus = mode === "select";

    const color = "#808080";
    
    for (let i = 1; i < 6; i++){
        initSeats.push(gen1(i, color, defaultReservationStatus));
    };
    initSeats.push(gen2(6, color, defaultReservationStatus));
    for(let i = 7; i < 17; i++){
        initSeats.push(gen1(i, color, defaultReservationStatus));
    };
    initSeats.push(genEmpty());
    initSeats.push(gen3(17, color, defaultReservationStatus));
    initSeats.push(gen3(18, color, defaultReservationStatus));
    initSeats.push(gen4(19, color, defaultReservationStatus));

    initSeats.push(genEmpty());
    for (let i = 20; i < 24; i++){
        initSeats.push(gen6(i, color, defaultReservationStatus));
    };
    initSeats.push(gen5(24, color, defaultReservationStatus));
    initSeats.push(gen5(25, color, defaultReservationStatus));
    initSeats.push(gen5(26, color, defaultReservationStatus));
    initSeats.push(gen6(27, color, defaultReservationStatus));

    return initSeats;
};

export default generateSeats;