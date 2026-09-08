const fs = require('fs');

const newFunc = `function seedAdminIfMissing() {
\tconst raw = localStorage.getItem(STORAGE_KEYS.users);
\tlet list = raw ? JSON.parse(raw) : [];
\tconst exists = list.some(u => u.role === 'admin');
\tif (!exists) {
\t\tlist.push({ email: 'admin@nihongo.local', name: 'Administrator', passwordHash: hash('admin123'), role: 'admin', points: 0, history: [] });
\t}
\tif (!list.some(u => u.email === 'student1@gmail.com')) {
\t\tlist.push({ email: 'student1@gmail.com', name: 'Nguyễn Văn A', passwordHash: hash('123456'), role: 'user', points: 150, history: [] });
\t\tlist.push({ email: 'student2@gmail.com', name: 'Trần Thị B', passwordHash: hash('123456'), role: 'user', points: 420, history: [] });
\t\tlist.push({ email: 'testuser@yahoo.com', name: 'Học sinh Test', passwordHash: hash('123456'), role: 'user', points: 30, history: [] });
\t}
\tlocalStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
}
`;

let content = fs.readFileSync('exercise-2/frontend/app.js', 'utf8');
if (!content.includes('function seedAdminIfMissing')) {
    content = newFunc + content;
    content = content.replace('function loadFromStorage() {', "function loadFromStorage() {\n\tseedAdminIfMissing();");
    fs.writeFileSync('exercise-2/frontend/app.js', content, 'utf8');
}
