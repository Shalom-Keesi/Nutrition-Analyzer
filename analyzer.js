document.getElementById('calculateButton').addEventListener('click', calculateNutrition);
async function calculateNutrition() {
    const recipe = document.getElementById('recipeInput').value;
    const ingredientLines = recipe.split('\n').filter(line => line.trim() !== '');
    const EDAMAM_APP_ID = '593f0f9e';
    const EDAMAM_APP_KEY = 'feb482379fded74fdc0a485f439a30ae';
    let totalNutrition = {
        calories: 0,
        totalWeight: 0,
        totalNutrients: {},
        totalDaily: {}
    };
    try {
        const requests = ingredientLines.map(ingredient => fetch(`https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(ingredient)}`));
        const responses = await Promise.all(requests);
        for (const response of responses) {
            const data = await response.json();
            if (data.calories) {
                totalNutrition.calories += data.calories;
                totalNutrition.totalWeight += data.totalWeight;
                
                totalNutrition.totalNutrients = {...totalNutrition.totalNutrients, ...data.totalNutrients};
                totalNutrition.totalDaily = {...totalNutrition.totalDaily, ...data.totalDaily};
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    console.log({totalNutrition});
    displayNutrition(totalNutrition);
}
function displayNutrition(nutrition) {
    const resultDiv = document.getElementById('result');
    const html = `
        <h2>Total Nutritional Information</h2>
        <table border="1">
            <tr>
                <th>Nutrient</th>
                <th>Quantity</th>
                <th>Unit</th>
            </tr>
            <tr>
                <td>Calories</td>
                <td>${nutrition.calories.toFixed(2)}</td>
                <td></td>
            </tr>
            <tr>
                <td>Total Weight</td>
                <td>${nutrition.totalWeight.toFixed(2)}</td>
                <td>grams</td>
            </tr>
        </table>
        <h3>Macronutrients</h3>
        <table border="1">
            <tr>
                <th>Nutrient</th>
                <th>Quantity</th>
                <th>Unit</th>
            </tr>
            ${generateNutrientTable(nutrition.totalNutrients)}
        </table>
        <h3>Daily Values</h3>
        <table border="1">
            <tr>
                <th>Nutrient</th>
                <th>Quantity</th>
                <th>Unit</th>
            </tr>
            ${generateNutrientTable(nutrition.totalDaily)}
        </table>
    `;
    resultDiv.innerHTML = html;
}
function generateNutrientTable(nutrients) {
    return Object.keys(nutrients).map(key => `
        <tr>
            <td>${nutrients[key].label}</td>
            <td>${nutrients[key].quantity.toFixed(2)}</td>
            <td>${nutrients[key].unit}</td>
        </tr>
    `).join('');
}
function adjustHeight() {
    var content1 = document.getElementById("content");
    var result1 = document.getElementById("result");
    var additionalHeight = 400;
    var contentHeight = result1.offsetHeight;
    content1.style.height = (contentHeight + additionalHeight) + 'px';
}
window.onload = adjustHeight;
window.onresize = adjustHeight;