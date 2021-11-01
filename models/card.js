const path = require('path');
const fs = require('fs');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'card.json');

module.exports = class Card {
    static async add(course) {
        const card = await Card.fetch();

        const index = card.courses.findIndex(xCourse => xCourse.id === course.id);
        const candidate = card.courses[index];

        if (candidate) {
            //Курс уже есть
            candidate.count++;
            card.courses[index] = candidate;
        } else {
            //Нужно добавить курс
            course.count = 1;
            card.courses.push(course);
        }
        //Обновить цену
        card.price += +course.price;

        return new Promise(((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) reject(err);
                else resolve();
            });
        }));
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', ((err, data) => {
                if (err) reject(err);
                else resolve(JSON.parse(data));
            }));
        });
    }

    static async remove(id) {
        const card = await Card.fetch();

        const index = card.courses.findIndex(xCourse => xCourse.id === id);
        const course = card.courses[index];

        if (course.count === 1) {
            //удалить
            card.courses = card.courses.filter(xCourse => xCourse.id !== id);
        } else {
            //изменить количество
            card.courses[index].count--;
        }
        //пересчитать цену
        card.price -= course.price;

        return new Promise(((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), err => {
                if (err) reject(err);
                else resolve(card);
            });
        }));
    }
};