document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bmiForm');
    const unitSelect = document.getElementById('unit');
    const weightLabel = document.getElementById('weightLabel');
    const heightLabel = document.getElementById('heightLabel');
    const resultDiv = document.getElementById('result');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const bmiInput = document.getElementById('bmiInput');

    unitSelect.addEventListener('change', function() {
        const unit = unitSelect.value;
        if (unit === 'metric') {
            weightLabel.textContent = 'Weight (kg)';
            heightLabel.textContent = 'Height (m)';
        } else {
            weightLabel.textContent = 'Weight (lbs)';
            heightLabel.textContent = 'Height (in)';
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            weight: parseFloat(formData.get('weight')),
            height: parseFloat(formData.get('height')),
            unit: formData.get('unit')
        };

        try {
            const response = await fetch('/api/calculators/bmi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (response.ok) {
                bmiValue.textContent = `BMI: ${result.bmi}`;
                bmiCategory.textContent = `Category: ${result.category}`;
                bmiInput.textContent = `Input: ${result.input.weight} ${result.unit === 'metric' ? 'kg' : 'lbs'}, ${result.input.height} ${result.unit === 'metric' ? 'm' : 'in'}`;
                
                // Color code the category
                const categoryColors = {
                    'Underweight': '#17a2b8',
                    'Normal weight': '#28a745',
                    'Overweight': '#ffc107',
                    'Obese': '#dc3545'
                };
                bmiCategory.style.color = categoryColors[result.category] || '#333';
                
                resultDiv.style.display = 'block';
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Error calculating BMI: ' + error.message);
        }
    });
});