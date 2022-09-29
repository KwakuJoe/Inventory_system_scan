/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './resources/views/**/*.edge',
        './resources/css/**/*.css',
        './resources/js/**/*.js',
        './resources/js/**/*.ts',
    ],
    variants: {},
    theme: {
        extend: {},
    },
    plugins: [
        require("kutty")
    ],
}