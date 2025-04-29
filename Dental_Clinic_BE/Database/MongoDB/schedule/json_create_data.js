// Tạo dữ liệu cho Work_Schedule
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30); // 30 ngày trước
const workSchedules = [];

for (let userId = 2; userId <= 19; userId++) {
    for (let day = 0; day < 30; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);
        const timeStart = new Date(date);
        timeStart.setHours(8, 0, 0, 0);
        const timeEnd = new Date(date);
        timeEnd.setHours(17, 0, 0, 0);

        workSchedules.push({
            user_id: userId,
            time_start: timeStart,
            time_end: timeEnd,
        });
    }
}

db.work_schedules.insertMany(workSchedules);

// Tạo dữ liệu cho Appointment
const appointments = [];
const usedSlots = { den: {}, pat: {}, assi: {} };

// Đảm bảo mỗi pat_id (1-20) có ít nhất 1 cuộc hẹn
for (let patId = 1; patId <= 20; patId++) {
    let inserted = false;
    while (!inserted) {
        const denId = Math.floor(Math.random() * 12) + 4; // 4-15
        const assiId = Math.floor(Math.random() * 4) + 16; // 16-19
        const randomDay = Math.floor(Math.random() * 30);

        const date = new Date(startDate);
        date.setDate(date.getDate() + randomDay);
        const hour = Math.floor(Math.random() * 9) + 8; // 8h-16h
        const timeStart = new Date(date);
        timeStart.setHours(hour, 0, 0, 0);
        const timeEnd = new Date(timeStart.getTime() + 60 * 60 * 1000); // 1 tiếng

        // Kiểm tra trùng lặp

        if (!usedSlots.den[denId]) usedSlots.den[denId] = new Set();
        if (!usedSlots.pat[patId]) usedSlots.pat[patId] = new Set();
        if (!usedSlots.assi[assiId]) usedSlots.assi[assiId] = new Set();

        if (
            !usedSlots.den[denId].has(timeStart.toISOString()) &&
            !usedSlots.pat[patId].has(timeStart.toISOString()) &&
            !usedSlots.assi[assiId].has(timeStart.toISOString())
        ) {
            appointments.push({
                den_id: denId,
                pat_id: patId,
                assi_id: assiId,
                time_start: timeStart,
                time_end: timeEnd,
                symptom: "Triệu chứng mẫu",
                note: "Ghi chú mẫu",
                created_at: new Date(),
                status: "finished"
            });

            // Cập nhật các slot đã dùng
            usedSlots.den[denId] = usedSlots.den[denId] || new Set();
            usedSlots.den[denId].add(timeStart.toISOString());
            usedSlots.pat[patId] = usedSlots.pat[patId] || new Set();
            usedSlots.pat[patId].add(timeStart.toISOString());
            usedSlots.assi[assiId] = usedSlots.assi[assiId] || new Set();
            usedSlots.assi[assiId].add(timeStart.toISOString());

            inserted = true;
        }
    }
}

// Tạo 80 cuộc hẹn còn lại
for (let i = 0; i < 80; i++) {
    let inserted = false;
    while (!inserted) {
        const denId = Math.floor(Math.random() * 12) + 4; // 4-15
        const patId = Math.floor(Math.random() * 20) + 1; // 1-20
        const assiId = Math.floor(Math.random() * 4) + 16; // 16-19
        const randomDay = Math.floor(Math.random() * 30);

        const date = new Date(startDate);
        date.setDate(date.getDate() + randomDay);
        const hour = Math.floor(Math.random() * 9) + 8;
        const timeStart = new Date(date);
        timeStart.setHours(hour, 0, 0, 0);
        const timeEnd = new Date(timeStart.getTime() + 60 * 60 * 1000);

        if (!usedSlots.den[denId]) usedSlots.den[denId] = new Set();
        if (!usedSlots.pat[patId]) usedSlots.pat[patId] = new Set();
        if (!usedSlots.assi[assiId]) usedSlots.assi[assiId] = new Set();

        if (
            !usedSlots.den[denId].has(timeStart.toISOString()) &&
            !usedSlots.pat[patId].has(timeStart.toISOString()) &&
            !usedSlots.assi[assiId].has(timeStart.toISOString())
        ) {
            appointments.push({
                den_id: denId,
                pat_id: patId,
                assi_id: assiId,
                time_start: timeStart,
                time_end: timeEnd,
                symptom: "Triệu chứng mẫu",
                note: "Ghi chú mẫu",
                created_at: new Date(),
                status: "finished"
            });

            usedSlots.den[denId] = usedSlots.den[denId] || new Set();
            usedSlots.den[denId].add(timeStart.toISOString());
            usedSlots.pat[patId] = usedSlots.pat[patId] || new Set();
            usedSlots.pat[patId].add(timeStart.toISOString());
            usedSlots.assi[assiId] = usedSlots.assi[assiId] || new Set();
            usedSlots.assi[assiId].add(timeStart.toISOString());

            inserted = true;
        }
    }
}

db.appointments.insertMany(appointments);