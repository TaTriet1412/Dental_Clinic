var hoLots = ['Nguyễn Văn', 'Trần Thị', 'Lê Hoàng', 'Phạm Minh', 'Võ Thành'];
var tens = ['An', 'Bình', 'Châu', 'Dũng', 'Hạnh', 'Linh', 'Minh', 'Ngọc'];
var gioiTinhs = ['Nam', 'Nữ'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var startBirth = new Date(1975, 0, 1);
var endBirth = new Date(2005, 11, 31);
var startVisit = new Date(2020, 0, 1);
var endVisit = new Date();

var patients = [];

for (var i = 0; i < 20; i++) {
    var full_name = hoLots[getRandomInt(0, hoLots.length - 1)] + ' ' + tens[getRandomInt(0, tens.length - 1)];
    var gender = gioiTinhs[getRandomInt(0, gioiTinhs.length - 1)];
    var birth_date = getRandomDate(startBirth, endBirth).toISOString().split('T')[0];
    var phone_number = '09' + getRandomInt(100000000, 999999999).toString().slice(0, 8);
    var address = `Số ${i + 1} Đường Lê Lợi, Quận ${getRandomInt(1, 12)}, TP.HCM`;
    var email = `benhnhan${i + 1}@gmail.com`;
    var created_at = new Date().toISOString();
    var last_visit = getRandomDate(startVisit, endVisit).toISOString();
    var img = `template/blank_patient.png`;

    patients.push({
        name: full_name,
        gender: gender,
        birthday: birth_date,
        phone: phone_number,
        address: address,
        email: email,
        created_at: created_at,
        last_visit: last_visit,
        img: img
    });
}

db.patients.insertMany(patients);
