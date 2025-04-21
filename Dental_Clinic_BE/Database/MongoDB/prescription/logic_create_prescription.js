var priceMap = {
    51: 1000, 52: 1000, 53: 1000, 54: 1000,
    55: 750, 56: 750, 57: 1000, 58: 1750,
    59: 500, 60: 430, 61: 600, 62: 1200
};

var notes = [
    "Dặn uống sau ăn",
    "Uống sau khi ăn no",
    "Dùng thuốc sau bữa ăn",
    "Uống với nhiều nước",
    "Không dùng khi đói"
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

var prescriptions = [];

for (var i = 0; i < 100; i++) {
    var patId = getRandomInt(1, 20);
    var denId = getRandomInt(1, 12);
    var createdAt = getRandomDate(twoMonthsAgo, new Date());
    var note = notes[getRandomInt(0, notes.length - 1)];

    var medicines = [];
    var totalPrice = 0;
    var usedMedIds = new Set();

    for (var j = 0; j < getRandomInt(1, 3); j++) {
        var medId;
        do { medId = getRandomInt(51, 62); } while (usedMedIds.has(medId));
        usedMedIds.add(medId);

        var quantity = getRandomInt(1, 3);
        totalPrice += quantity * priceMap[medId];

        medicines.push({
            med_id: medId,
            quantity_medicine: quantity
        });
    }

    prescriptions.push({
        bill_id: i + 1,
        pat_id: patId,
        den_id: denId,
        created_at: createdAt.toISOString(),
        note: note,
        total_price: totalPrice,
        medicines: medicines,
        is_deleted: false
    });
}

db.prescriptions.insertMany(prescriptions);