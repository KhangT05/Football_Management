import ExcelJS from 'exceljs';

async function exportImportTemplate() {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Danh sách cầu thủ");
    ws.columns = [
        { header: "Họ và tên", key: "name", width: 24 },
        { header: "Email", key: "email", width: 28 },
        { header: "MSSV", key: "student_code", width: 14 },
        { header: "Ngày sinh (YYYY-MM-DD)", key: "dob", width: 20 },
        { header: "Vị trí", key: "position", width: 10 },
        { header: "Số áo", key: "jersey_number", width: 8 },
    ];
    ws.addRow({
        name: "Nguyễn Văn A",
        email: "player1@example.com",
        student_code: "20120001",
        dob: "2000-01-15",
        position: "FW",
        jersey_number: 10,
    });
    const sampleRow = ws.getRow(2);
    sampleRow.font = { italic: true, color: { argb: "FF888888" } };
    for (let i = 1; i < 5; i++) ws.addRow({});

    const wsInfo = wb.addWorksheet("Hướng dẫn");
    wsInfo.columns = [
        { header: "Cột", key: "field", width: 24 },
        { header: "Mô tả / Yêu cầu", key: "note", width: 60 },
    ];
    const instructions = [
        { field: "name", note: "Họ và tên đầy đủ — bắt buộc. Dùng để tạo tài khoản mới nếu email chưa có trong hệ thống." },
        { field: "email", note: "Bắt buộc. Nếu email đã có tài khoản → gắn cầu thủ vào tài khoản đó. Nếu chưa có → hệ thống tự tạo tài khoản (chưa có mật khẩu) và gửi email mời đặt mật khẩu, hiệu lực 24h." },
        { field: "student_code", note: "MSSV — bắt buộc. Xác nhận tư cách sinh viên, điều kiện tiên quyết để tham gia đội." },
        { field: "jersey_number", note: "Số nguyên 1-99, duy nhất trong đội" },
        { field: "date_of_birth", note: "Định dạng YYYY-MM-DD" },
        { field: "position", note: "GK | DEF | MID | FW" },
        { field: "height", note: "cm, có thể để trống" },
        { field: "weight", note: "kg, có thể để trống" },
        { field: "nationality", note: "Có thể để trống" },
        { field: "", note: "Nên chuẩn bị tối thiểu 5 dòng cầu thủ" },
        { field: "", note: "Tối đa 200 dòng / file" },
    ];
    wsInfo.addRows(instructions);
    ws.getRow(1).font = { bold: true };
    wsInfo.getRow(1).font = { bold: true };

    await wb.xlsx.writeFile('C:\\Users\\nguye\\Desktop\\Foolball_Management\\import-template.xlsx');
    console.log('File import-template.xlsx created.');
}

exportImportTemplate().catch(console.error);
