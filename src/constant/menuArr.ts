import { testImage } from "./images";

export const menu = [
    {
        type: { en: 'Sandwich', ar: 'السندويشات' },
        data: [
            {
                name: { en: 'Shawrma', ar: 'شاورما' },
                price: 10,
                image:
                    testImage,
            },
            {
                name: { en: 'Flafel', ar: 'فلافل' },
                price: 5,
                image:
                    testImage,
            },
            {
                name: { en: 'Burger', ar: 'برغر' },
                price: 20,
                image:
                    testImage,
            },

        ],
    },
    {
        type: { en: 'Meals', ar: 'الوجبات' },
        data: [
            {
                name: { en: 'Shawrma-meal', ar: 'وجبة شاورما' },
                price: 20,
                image:
                    testImage,
            },
            {
                name: { en: 'Flafel-meal', ar: 'وجبة فلافل' },
                price: 30,
                image:
                    testImage,
            },
            {
                name: { en: 'Burger-meal', ar: 'وجبة برغر' },
                price: 40,
                image:
                    testImage,
            },
        ],
    },
];